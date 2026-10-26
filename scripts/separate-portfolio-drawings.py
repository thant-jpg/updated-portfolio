"""Separate artwork from composite PDF pages; captions and prose are native HTML."""
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from PIL import Image, ImageChops
import json, subprocess, pdfplumber

root=Path(__file__).resolve().parents[1]
source=json.loads((root/'sources/portfolio-import.json').read_text())['source']
reader=PdfReader(source)
temp=root/'tmp/native-layout';temp.mkdir(parents=True,exist_ok=True)
# Coordinates use the header-free page. Each region contains one complete drawing or photo.
regions={
7:[('Object model',(.03,.04,.26,.36)),('Exploded object model',(.03,.52,.26,.84)),('Exploded axonometric drawing',(.27,.02,.88,.93))],
25:[('Public streets and private homes',(.105,.02,.39,.32)),('Massing and aggregation',(.40,.02,.96,.28)),('Ground floor plan',(.10,.36,.35,.92)),('Typical block plan',(.40,.34,.66,.92))],
26:[('Unit distribution',(.08,.02,.37,.33)),('Studio model',(.43,.04,.63,.30)),('Studio floor plan',(.663,.025,.804,.292)),('Multi-generation home model',(.43,.34,.63,.60)),('Multi-generation floor plan',(.663,.303,.912,.616)),('Shophouse model',(.43,.65,.64,.92)),('Shophouse floor plans',(.663,.638,.906,.906))],
27:[('Residential and public lifts',(.035,.02,.31,.34)),('Active streets',(.035,.35,.31,.62)),('Residential levels',(.035,.64,.31,.94)),('Building cross-section',(.33,.02,.92,.94))],
28:[('Building axonometric',(.10,.02,.87,.92))],
29:[('Roof plan',(.075,.34,.35,.94)),('Longitudinal section',(.36,.02,.96,.53)),('Interior street',(.36,.58,.66,.94)),('Public sky street',(.65,.58,.96,.94))],
31:[('Bridge front view',(.055,.02,.30,.62)),('Bridge side view',(.082,.665,.553,.883)),('Full-scale bridge',(.32,.02,.58,.63)),('Completed bridge model',(.59,.02,.94,.93))],
32:[('Joint isometric drawing',(.065,.02,.38,.38)),('Joint cutting and fold pattern',(.065,.46,.38,.93)),('Fabricated metal joint',(.40,.02,.94,.62))],
33:[('Joint assembly drawing',(.065,.02,.38,.37)),('Unfolded joint',(.065,.46,.38,.93)),('Connection detail',(.40,.02,.94,.46)),('Completed bridge',(.40,.49,.94,.94))]
}
# Use the PDF's actual image bounds wherever possible, avoiding guessed crops.
raster_regions={7:{0:[0],1:[1]},25:{1:[8,9,10,11],2:[4,5],3:[6,7]},26:{0:[0],1:[1],3:[2],5:[3]},27:{0:[0],1:[1],2:[2],3:[3,4]},28:{0:[0,1,2]},29:{0:[6,7],1:[0,1],2:[2,3,4],3:[5]},31:{0:[0],2:[1],3:[2]},32:{0:[1],2:[0]},33:{0:[0],2:[1],3:[2]}}
with pdfplumber.open(source) as geometry:
 for n,mapping in raster_regions.items():
  page=geometry.pages[n-1]
  for index,indices in mapping.items():
   objects=[page.images[i] for i in indices]
   bbox=(min(o['x0'] for o in objects)/page.width,(min(o['top'] for o in objects)-46)/(page.height-46),max(o['x1'] for o in objects)/page.width,(max(o['bottom'] for o in objects)-46)/(page.height-46))
   regions[n][index]=(regions[n][index][0],bbox)
regions[25][0]=('Public streets and private homes',(.08,.025,.345,.34))
writer=PdfWriter()
for n in regions:
 page=writer.add_page(reader.pages[n-1]);page.cropbox.upper_right=(float(page.mediabox.right),float(page.mediabox.top)-46)
writer.remove_text()
pdf=temp/'drawings-only.pdf'
with pdf.open('wb') as stream:writer.write(stream)
subprocess.run([r'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe','-cropbox','-scale-to','3200','-png',str(pdf),str(temp/'drawing')],check=True)
artfile=root/'portfolio-artwork.mjs'
stories=json.loads(artfile.read_text(encoding='utf-8').split('export const portfolioArtwork=',1)[1].rstrip().removesuffix(';'))
updates={}
for page_number,file in zip(regions,sorted(temp.glob('drawing-*.png'))):
 image=Image.open(file).convert('RGB');w,h=image.size
 slug='spatial' if page_number==7 else 'stacked-streets' if page_number<30 else 'a-bridge'
 folder=root/'public/images/portfolio'/slug/'separated-artwork';folder.mkdir(parents=True,exist_ok=True)
 records=[]
 for index,(caption,(x0,y0,x1,y1)) in enumerate(regions[page_number],1):
  crop=image.crop((max(0,round(x0*w)),max(0,round(y0*h)),min(w,round(x1*w)),min(h,round(y1*h))))
  # Trim only blank outer margins, keeping every mark within the selected drawing.
  bounds=ImageChops.difference(crop,Image.new('RGB',crop.size,'white')).convert('L').point(lambda v:255 if v>18 else 0).getbbox()
  if bounds:
   l,t,r,b=bounds;crop=crop.crop((max(0,l-12),max(0,t-12),min(crop.width,r+12),min(crop.height,b+12)))
  path=folder/f'{page_number:02d}-{index:02d}.webp';crop.save(path,'WEBP',quality=95,method=5)
  records.append(dict(src='/'+path.relative_to(root/'public').as_posix(),width=crop.width,height=crop.height,caption=caption,sourcePage=page_number,separatedArtwork=True))
 updates[page_number]=records
for story in stories.values():
 images=[];replaced=set()
 for image in story['images']:
  if image['sourcePage'] in updates:
   if image['sourcePage'] not in replaced:images.extend(updates[image['sourcePage']]);replaced.add(image['sourcePage'])
  else:images.append(image)
 story['images']=images
artfile.write_text('// Individual project artwork; all section copy and captions are native website text.\nexport const portfolioArtwork='+json.dumps(stories,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Separated',sum(map(len,updates.values())),'visuals from',len(regions),'composite pages.')
