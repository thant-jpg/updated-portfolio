"""Extract complete PDF images without rectangular artwork crops.
Composite drawing sheets retain vector labels/linework as a full, header-free sheet.
"""
from pathlib import Path
from pypdf import PdfReader,PdfWriter
from pypdf.generic import DictionaryObject,NameObject,DecodedStreamObject
from PIL import Image,ImageStat
import json,subprocess
source=json.loads(Path('sources/portfolio-import.json').read_text())['source'];reader=PdfReader(source)
projects=json.loads(Path('portfolio-projects.mjs').read_text(encoding='utf-8').split('export const portfolioProjects=',1)[1].rstrip().removesuffix(';'))
artfile=Path('portfolio-artwork.mjs');stories=json.loads(artfile.read_text(encoding='utf-8').split('export const portfolioArtwork=',1)[1].rstrip().removesuffix(';'))
# These sheets mix raster images with vector plans, dimensions, and annotations.
composites={7,25,26,27,28,29,31,32,33}
captions={
 4:['Isometric room drawing'],5:['Room model'],6:['Building model','Facade model','Building elevation'],
 8:['Concept render'],9:['Physical model','Paper study','Paper study','Paper study'],10:['Section study','Top-view model','Concept render'],11:['Isometric drawing'],
 12:['Staircase concept'],13:['Aerial render','Grasshopper definition','Script study'],14:['Grasshopper definition','Geometry iteration','Grasshopper definition','Geometry iteration','Grasshopper definition','Geometry iteration'],15:['Revit model','Top-view render'],
 16:['Conceptual collage'],17:['Environment render','Interior render','Landscape render','Timeline diagram'],18:['Concept diagram','Site model','Community diagram','Community diagram','Community diagram'],19:['Surface study','Surface study','Surface study','Spatial model studies'],20:['Model development','Model development','Model section','Model section'],21:['Architectural section','Section cut','Aerial render'],22:['Interior render','Interior render','Interior render'],23:['Environment render'],
 24:['Building render'],30:['Bridge model'],35:['Architectural drafting'],36:['Elevation drawing','Elevation drawing','Section drawing','Section drawing','Elevation drawing'],37:['Digital model','Plans and elevations'],38:['Pool model','Pool model','Pool render'],39:['Detail drawing','Detail drawing','Detail drawing'],40:['Urban sketch','Light and colour study'],41:['Still-life painting']
}
writer=PdfWriter();records=[]
for project in projects:
 seen=set();slug=project['slug'];index=0
 for entry in project['sourcePages']:
  n=entry['sourcePage'];page=reader.pages[n-1]
  if n in composites:
   new=writer.add_page(page);new.cropbox.upper_right=(float(page.mediabox.right),float(page.mediabox.top)-46)
   index+=1;records.append(dict(slug=slug,sourcePage=n,caption={7:'Exploded object drawing and views',25:'Site, massing and programme studies',26:'Unit types and floor plans',27:'Building section and circulation',28:'Axonometric drawing',29:'Roof plan, section and street views',31:'Bridge drawings and full-scale model',32:'Metal joint design and fabrication',33:'Joint details and completed bridge'}[n],completeSheet=True,index=index));continue
  for pos,image in enumerate(page.images):
   obj=image.indirect_reference.get_object();width,height=int(obj.get('/Width',0)),int(obj.get('/Height',0))
   if width<200 or height<160 or width*height<70000:continue
   key=(image.indirect_reference.idnum,image.indirect_reference.generation)
   if key in seen:continue
   seen.add(key);scale=720/max(width,height);w,h=width*scale,height*scale
   new=writer.add_blank_page(width=w,height=h);clone=obj.clone(writer)
   resources=DictionaryObject({NameObject('/XObject'):DictionaryObject({NameObject('/Artwork'):clone.indirect_reference})})
   colors=page['/Resources'].get('/ColorSpace')
   if colors:resources[NameObject('/ColorSpace')]=colors.get_object().clone(writer)
   new[NameObject('/Resources')]=resources
   stream=DecodedStreamObject();stream.set_data(f'q {w} 0 0 {h} 0 0 cm /Artwork Do Q'.encode());new[NameObject('/Contents')]=writer._add_object(stream)
   names=captions.get(n,[]);caption=names[pos] if pos<len(names) else 'Project study'
   index+=1;records.append(dict(slug=slug,sourcePage=n,caption=caption,completeSheet=False,index=index))
 folder=Path('public/images/portfolio')/slug/'complete-artwork';folder.mkdir(parents=True,exist_ok=True)
 print('Prepared '+slug,flush=True)
temp=Path('tmp/complete-artwork');pdf=temp/'artwork.pdf'
with pdf.open('wb') as output:writer.write(output)
(temp/'manifest.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print('Rendering '+str(len(records))+' complete visuals',flush=True)
subprocess.run([r'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe','-cropbox','-scale-to','2200','-png',str(pdf),str(temp/'image')],check=True)
files=sorted(temp.glob('image-*.png'))
if len(files)!=len(records):raise RuntimeError('Render count mismatch')
for file,record in zip(files,records):
 image=Image.open(file).convert('RGB')
 if all(low>=254 for low,high in ImageStat.Stat(image).extrema):record['skip']=True;continue
 dest=Path('public/images/portfolio')/record['slug']/'complete-artwork'/f"{record['index']:02d}.webp";image.save(dest,'WEBP',quality=94,method=5)
 record.update(src='/'+dest.relative_to('public').as_posix(),width=image.width,height=image.height)
for project in projects:
 slug=project['slug'];stories[slug]['images']=[{k:v for k,v in item.items() if k not in ['slug','index']} for item in records if item['slug']==slug and not item.get('skip')]
artfile.write_text('// Complete source visuals. Layouts expand to fit the project; no fixed sheet limit.\nexport const portfolioArtwork='+json.dumps(stories,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Exported '+str(len(records))+' complete visuals',flush=True)
