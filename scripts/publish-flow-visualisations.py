"""Publish selected Flow visualisations without altering the saved PNG masters."""
from pathlib import Path
from PIL import Image
import json

root=Path(__file__).resolve().parents[1]
folder=root/'public/images/portfolio/flow/visualisations'
def read_export(path,name):
 return json.loads(path.read_text(encoding='utf-8-sig').split('export const '+name+'=',1)[1].rstrip().removesuffix(';'))
selected=[
 ('grass-fog','Landscape visitor centre — meadow setting','landscapes'),
 ('snow-fog','Landscape visitor centre — winter setting','landscapes'),
 ('timber-woodland','Woodland visitor centre — timber study','materials'),
 ('steel-arid','Weathering-steel gallery — material study','materials'),
 ('urban-linework','Waterfront reading centre — experimental illustration','urban-study'),
 ('grass-elevated','Landscape visitor centre — elevated view','landscape-view')
]
records=[]
for name,caption,section in selected:
 master=folder/'selected-2026-10-27'/(name+'.png')
 if not master.exists():master=folder/'separated'/(name+'.png')
 if not master.exists():master=folder/'aligned'/(name+'.png')
 if not master.exists():master=folder/(name+'.png')
 with Image.open(master) as source:
  image=source.convert('RGB')
  destination=master.with_suffix('.webp')
  if not destination.exists() or destination.stat().st_mtime<master.stat().st_mtime:
   image.save(destination,'WEBP',quality=95,method=6)
  records.append(dict(src='/'+destination.relative_to(root/'public').as_posix(),width=image.width,height=image.height,caption=caption,sectionKey=section,aiGenerated=True))
  if name=='grass-fog':
   image.thumbnail((1000,1000))
   thumbnail=master.parent/'thumbnail-fog.webp'
   if not thumbnail.exists() or thumbnail.stat().st_mtime<master.stat().st_mtime:
    image.save(thumbnail,'WEBP',quality=94,method=6)

artpath=root/'portfolio-artwork.mjs'
artwork=read_export(artpath,'portfolioArtwork')
old=artwork['flow']['images']
models=[{**i,'sectionKey':'paper'} for i in old if i.get('sourcePage')==9]
process_order={'04':(1,'Draw the curve'),'05':(2,'Mark the ribbon lines'),'03':(3,'Cut the ribbons'),'02':(4,'Finished paper model')}
for model in models:
 key=Path(model.get('originalSrc',model['src'])).stem
 if key in process_order:
  model['stepNumber'],model['caption']=process_order[key]
models.sort(key=lambda image:image.get('stepNumber',99))
drawings=[{**i,'sectionKey':'drawings'} for i in old if i.get('sourcePage') in (10,11) and not i.get('originalSrc',i['src']).endswith('/09.webp')]
artwork['flow']['images']=records[:2]+models+drawings+records[2:]
artpath.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
metapath=root/'portfolio-projects.mjs'
metadata=read_export(metapath,'portfolioProjects')
for project in metadata:
 if project['slug']=='flow':project['image']='/'+(folder/'selected-2026-10-27/thumbnail-fog.webp').relative_to(root/'public').as_posix()
metapath.write_text('// Imported project metadata. Artwork and website copy remain separate.\nexport const portfolioProjects='+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Published six visualisations; Flow contains '+str(len(artwork['flow']['images']))+' images. PNG masters and original source artwork retained.')
