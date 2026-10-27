"""Import the three new projects as individual artwork, never flattened PDF pages."""
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject
from PIL import Image, ImageDraw
import json, subprocess, pdfplumber

root=Path(__file__).resolve().parents[1]
sources={
 'one':Path('C:/Users/Lenovo/Downloads/Portfolio Thant Thiri Wai (1).pdf'),
 'two':Path('C:/Users/Lenovo/Downloads/Portfolio 2.pdf')
}
readers={key:PdfReader(path) for key,path in sources.items()}
projects=[
 dict(slug='ascent',title='Ascent',date='2025-03',source='one',pages=[8,9,10,11],disciplines='Architecture / Housing / Landscape',note='A home shaped by a rising landscape',summary='A hillside home for a gardener and plant researcher, with living spaces arranged along a gradual ascent.',role='Architecture student'),
 dict(slug='venture',title='Venture',date='2025-02',source='two',pages=[8,9,10,11],disciplines='Architecture / Spatial design / Light studies',note='A sensory journey through a cliff',summary='A cliff-space study that moves from daylight into darkness, then opens towards the landscape.',role='Architecture student'),
 dict(slug='pause',title='Pause',date='2025-09',source='two',pages=[32,33],disciplines='Architecture / Public space / Competition',note='A public pavilion around a living tree',summary='A public-toilet competition proposal for TOTO, using a tree, filtered light and natural ventilation to create a moment of pause.',role='Competition entry')
]
# Each record is one complete source image. Reassemble the tiled Venture section.
assets={
 'ascent':[(8,['Im0'],'AI concept render'),(9,['Im0'],'Section through the rising terrain'),(9,['Im1'],'Section AA'),(9,['Im2'],'Section BB'),(9,['Im3'],'Section CC'),(9,['Im4'],'Section DD'),(10,['Im0'],'Interior AI render'),(10,['Im2'],'Digital interior model'),(10,['Im1'],'AI aerial study'),(11,['Im0'],'Isometric digital model'),(11,['Im2'],'Floor plan'),(11,['Im1'],'AI evening render')],
 'venture':[(8,['Im0'],'Interior AI render'),(9,['Im15'],'Form and subtraction studies'),(9,[f'Im{i}' for i in range(15)],'Isometric section'),(10,['Im0'],'Interior AI light study'),(11,['Im1'],'Exploded spatial model'),(11,['Im0'],'Interior AI outlook study')],
 'pause':[(32,['Im0'],'Exterior render'),(33,['Im1'],'Pavilion elevations'),(33,['Im2'],'Floor plan'),(33,['Im0'],'Exploded pavilion drawing')]
}
copy={
 'ascent':{'heading':'A home that rises with the terrain','body':'Using one square, one equilateral triangle and one circle, I arranged a gardener’s home along the slope. The journey begins in the garden, rises through shared living spaces and reaches the private rooms and rooftop retreat.'},
 'venture':{'heading':'From light into solitude','body':'I extended and subtracted a rectangular form from a cliff to shape a sequence of spaces. An exposed entrance leads into a dim corridor, a bright living area, a dark meditation space and finally an outlook at the cliff edge.'},
 'pause':{'heading':'A brief pause in the landscape','body':'A living tree forms the centre of the pavilion. Vertical louvers and a perforated roof filter light and air while balancing privacy and openness.'}
}
writer=PdfWriter();records=[]
with pdfplumber.open(sources['two']) as geometry:
 for project in projects:
  key=project['source'];reader=readers[key];slug=project['slug']
  for index,(number,names,caption) in enumerate(assets[slug],1):
   page=reader.pages[number-1];objects=page['/Resources']['/XObject']
   if len(names)==1:
    obj=objects['/'+names[0]].get_object();w,h=int(obj['/Width']),int(obj['/Height'])
    transforms=[(names[0],w,h,0,0)]
   else:
    pieces=[i for i in geometry.pages[number-1].images if i['name'] in names]
    x0=min(i['x0'] for i in pieces);y0=min(i['y0'] for i in pieces)
    x1=max(i['x1'] for i in pieces);y1=max(i['y1'] for i in pieces)
    w=709;scale=w/(x1-x0);h=round((y1-y0)*scale)
    transforms=[(i['name'],i['width']*scale,i['height']*scale,(i['x0']-x0)*scale,(i['y0']-y0)*scale) for i in pieces]
   standalone=writer.add_blank_page(width=w,height=h)
   xobjects=DictionaryObject();commands=[]
   for name,tw,th,x,y in transforms:
    clone=objects['/'+name].get_object().clone(writer)
    xobjects[NameObject('/'+name)]=clone.indirect_reference
    commands.append(f'q {tw} 0 0 {th} {x} {y} cm /{name} Do Q')
   resources=DictionaryObject({NameObject('/XObject'):xobjects})
   colors=page['/Resources'].get('/ColorSpace')
   if colors:resources[NameObject('/ColorSpace')]=colors.get_object().clone(writer)
   standalone[NameObject('/Resources')]=resources
   stream=DecodedStreamObject();stream.set_data('\n'.join(commands).encode())
   standalone[NameObject('/Contents')]=writer._add_object(stream)
   records.append(dict(slug=slug,index=index,sourceDocument=sources[key].name,sourcePage=number,caption=caption))

temp=root/'tmp/new-portfolios/assets';temp.mkdir(parents=True,exist_ok=True)
pdf=temp/'individual-artwork.pdf'
with pdf.open('wb') as file:writer.write(file)
subprocess.run([r'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe','-r','72','-png',str(pdf),str(temp/'asset')],check=True)
files=sorted(temp.glob('asset-*.png'))
if len(files)!=len(records):raise RuntimeError('Artwork render count mismatch')
for file,record in zip(files,records):
 image=Image.open(file).convert('RGB')
 folder=root/'public/images/portfolio'/record['slug']/'artwork';folder.mkdir(parents=True,exist_ok=True)
 destination=folder/f"{record['index']:02d}.webp";image.save(destination,'WEBP',quality=95,method=5)
 record.update(src='/'+destination.relative_to(root/'public').as_posix(),width=image.width,height=image.height)
 if record['index']==1:
  image.save(folder.parent/'cover.webp','WEBP',quality=95,method=5)
  image.thumbnail((800,800));image.save(folder.parent/'thumbnail.webp','WEBP',quality=93,method=5)

def read_export(path,name):return json.loads(path.read_text(encoding='utf-8-sig').split('export const '+name+'=',1)[1].rstrip().removesuffix(';'))
artfile=root/'portfolio-artwork.mjs';artwork=read_export(artfile,'portfolioArtwork')
projectfile=root/'portfolio-projects.mjs';metadata=read_export(projectfile,'portfolioProjects')
for project in projects:
 slug=project['slug'];artwork[slug]={**copy[slug],'images':[{k:v for k,v in r.items() if k not in ['slug','index']} for r in records if r['slug']==slug]}
 metadata=[p for p in metadata if p['slug']!=slug]
 metadata.append({k:v for k,v in project.items() if k not in ['source','pages']})
 metadata[-1].update(category='Architecture',image=f'/images/portfolio/{slug}/thumbnail.webp',accent='blue',sections=[],nativeArtwork=True)
artfile.write_text('// Individual project artwork with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
projectfile.write_text('// Imported project metadata. Source artwork and live copy are separate.\nexport const portfolioProjects='+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
manifest={'sources':{key:str(path) for key,path in sources.items()},'projects':projects,'assets':records,'dates':{'pause':'September 2025, confirmed by the user','ascent':'March 2025, source PDF','venture':'February 2025, source PDF'}}
(root/'sources/additional-projects-import.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
canvas=Image.new('RGB',(1400,((len(files)+3)//4)*220),'#bbb');draw=ImageDraw.Draw(canvas)
for i,(file,record) in enumerate(zip(files,records)):
 image=Image.open(file).convert('RGB');image.thumbnail((340,185));x=i%4*350;y=i//4*220
 canvas.paste(image,(x,y+30));draw.text((x+4,y+5),record['slug']+' '+str(record['index'])+' '+record['caption'][:28],fill='black')
canvas.save(temp/'contact.jpg')
print(f'Imported {len(projects)} new projects and {len(records)} individual visuals.',flush=True)
