"""Publish a curated chair story from original PDF artwork, without AI alterations."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json

root=Path(__file__).resolve().parents[1]
source=Path('C:/Users/Lenovo/Downloads/chair.pdf')
reader=PdfReader(source)
folder=root/'public/images/portfolio/butterfly-effect/chair-story'
folder.mkdir(parents=True,exist_ok=True)
selection=[
 (9,'Image96','finished-chair','Finished chair: sculpted wooden seat and black metal frame','outcome'),
 (4,None,'wave-studies','Four parametric surface studies','form'),
 (5,'Image61','seat-outlines','Seat outlines explored against the surface contours','form'),
 (5,'Image68','selected-seat','Selected seat: the edge follows the wave pattern','form'),
 (6,'Image77','metal-frame','Tapered legs joined by a square connection','structure'),
 (7,'Image80','exploded-drawing','Exploded view of the seat, connection and legs','structure'),
 (8,'Image86','bending-frame','Adjusting the metal frame to its final angle','making'),
 (8,'Image88','cnc-seat','CNC milling the seat surface','making'),
 (8,'Image87','welding-frame','Welding the metal frame','making'),
 (9,'Image104','seat-detail','Lacquered surface and tactile contours','details'),
 (9,'Image98','chair-in-use','The finished chair in use','details'),
 (9,'Image103','finished-chair-deck','Finished chair and metal frame','details')
]
cache={}
def images(page):
 if page not in cache:cache[page]={Path(i.name).stem:i for i in reader.pages[page-1].images}
 return cache[page]
records=[]
for page,name,slug,caption,section in selection:
 if name:
  im=images(page)[name].image.convert('RGB')
  if name=='Image103': im=im.transpose(Image.Transpose.ROTATE_270)
 else:
  names=['Image55','Image54','Image56','Image51']
  im=Image.new('RGB',(1154,1140),'black')
  for i,key in enumerate(names):
   tile=images(page)[key].image.convert('RGB')
   im.paste(tile,((i%2)*577,(i//2)*570))
 destination=folder/(slug+'.webp')
 im.save(destination,'WEBP',quality=95,method=6)
 records.append(dict(src='/'+destination.relative_to(root/'public').as_posix(),width=im.width,height=im.height,caption=caption,sectionKey=section,sourcePage=page,sourceDocument='chair.pdf',sourceImage=name or names))

# Keep the user's established grass photo as both card cover and opening image.
cover=root/'public/images/portfolio/butterfly-effect/cover-upscaled.webp'
with Image.open(cover) as im:
 records[0]=dict(src='/images/portfolio/butterfly-effect/cover-upscaled.webp',width=im.width,height=im.height,caption='Finished chair on the lawn',sectionKey='outcome',retainedCover=True)

# Restore the original seat close-up alongside the retained lawn photograph.
seat=root/'public/images/portfolio/butterfly-effect/artwork/02.webp'
with Image.open(seat) as im:
 records.append(dict(src='/images/portfolio/butterfly-effect/artwork/02.webp',width=im.width,height=im.height,caption='Carved wooden seat: wave pattern and grain',sectionKey='details',retainedArtwork=True))

def read_export(path,name):return json.loads(path.read_text(encoding='utf-8-sig').split('export const '+name+'=',1)[1].rstrip().removesuffix(';'))
artfile=root/'portfolio-artwork.mjs'
artwork=read_export(artfile,'portfolioArtwork')
artwork['butterfly-effect']['images']=records
artfile.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
metafile=root/'portfolio-projects.mjs'
projects=read_export(metafile,'portfolioProjects')
for p in projects:
 if p['slug']=='butterfly-effect':
  p['image']='/images/portfolio/butterfly-effect/cover-upscaled.webp'
  p['summary']='A group-designed chair combining a parametric, CNC-milled wooden seat with a minimal metal frame.'
metafile.write_text('// Imported project metadata. Artwork and website copy remain separate.\nexport const portfolioProjects='+json.dumps(projects,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
manifest={'source':str(source),'selection':f'{len(records)} visuals across five story sections; original embedded artwork, no generated enhancement. Four surface studies combined into one comparison. Existing grass cover retained.','groupProject':True,'images':records}
(root/'sources/chair-story.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Published {len(records)} chair visuals; original lawn cover and seat close-up retained.')
