"""Import Weave and Butterfly Effect, and separate personal art from internship work."""
from pathlib import Path
from pypdf import PdfReader,PdfWriter
from pypdf.generic import DictionaryObject,NameObject,DecodedStreamObject
from PIL import Image,ImageDraw
import json,subprocess,shutil,pdfplumber

root=Path(__file__).resolve().parents[1]
source=Path('C:/Users/Lenovo/Downloads/Portfolio Thant Thiri Wai (2).pdf')
painting=Path('C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-6bcc8865-6688-4473-8572-81ca86cd9aba.png')
reader=PdfReader(source);writer=PdfWriter();records=[]
assets={
 'weave':[(3,['Im0'],'Isometric AI concept render'),(3,['Im2'],'Ground floor plan'),(3,['Im3'],'First floor plan'),(3,['Im1'],'Top-view digital model'),(4,['Im4','Im5'],'Sectional axonometric drawing'),(4,['Im6'],'Exterior digital model'),(4,['Im0','Im1'],'Building section'),(4,['Im3'],'Side-view digital model'),(4,['Im2'],'Side-view digital model'),(5,['Im5'],'Aerial AI concept render'),(5,['Im6'],'Isometric digital model'),(5,['Im0'],'Exterior digital model'),(5,['Im1'],'Interior digital model'),(5,['Im2'],'Isometric digital model'),(5,['Im3'],'Interior AI light study'),(5,['Im4'],'Interior AI light study')],
 'butterfly-effect':[(16,['Im0'],'Fabricated chair'),(16,['Im2'],'Sculpted seat surface')]
}
with pdfplumber.open(source) as geometry:
 for slug,entries in assets.items():
  for index,(number,names,caption) in enumerate(entries,1):
   page=reader.pages[number-1];objects=page['/Resources']['/XObject']
   if len(names)==1:
    obj=objects['/'+names[0]].get_object();w,h=int(obj['/Width']),int(obj['/Height']);transforms=[(names[0],w,h,0,0)]
   else:
    pieces=[i for i in geometry.pages[number-1].images if i['name'] in names]
    x0=min(i['x0'] for i in pieces);y0=min(i['y0'] for i in pieces);x1=max(i['x1'] for i in pieces);y1=max(i['y1'] for i in pieces)
    w=int(objects['/'+names[0]].get_object()['/Width']);scale=w/(x1-x0);h=round((y1-y0)*scale)
    transforms=[(i['name'],i['width']*scale,i['height']*scale,(i['x0']-x0)*scale,(i['y0']-y0)*scale) for i in pieces]
   standalone=writer.add_blank_page(width=w,height=h);xobjects=DictionaryObject();commands=[]
   for name,tw,th,x,y in transforms:
    clone=objects['/'+name].get_object().clone(writer);xobjects[NameObject('/'+name)]=clone.indirect_reference
    commands.append(f'q {tw} 0 0 {th} {x} {y} cm /{name} Do Q')
   resources=DictionaryObject({NameObject('/XObject'):xobjects});colors=page['/Resources'].get('/ColorSpace')
   if colors:resources[NameObject('/ColorSpace')]=colors.get_object().clone(writer)
   standalone[NameObject('/Resources')]=resources;stream=DecodedStreamObject();stream.set_data('\n'.join(commands).encode());standalone[NameObject('/Contents')]=writer._add_object(stream)
   records.append(dict(slug=slug,index=index,caption=caption,sourcePage=number,sourceDocument=source.name))
temp=root/'tmp/another-portfolio/assets';temp.mkdir(parents=True,exist_ok=True);pdf=temp/'individual-artwork.pdf'
with pdf.open('wb') as file:writer.write(file)
subprocess.run([r'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe','-r','72','-png',str(pdf),str(temp/'asset')],check=True)
files=sorted(temp.glob('asset-*.png'))
if len(files)!=len(records):raise RuntimeError('Artwork count mismatch')
for file,record in zip(files,records):
 image=Image.open(file).convert('RGB');folder=root/'public/images/portfolio'/record['slug']/'artwork';folder.mkdir(parents=True,exist_ok=True)
 destination=folder/f"{record['index']:02d}.webp";image.save(destination,'WEBP',quality=95,method=5)
 record.update(src='/'+destination.relative_to(root/'public').as_posix(),width=image.width,height=image.height)
 if record['index']==1:
  image.save(folder.parent/'cover.webp','WEBP',quality=95,method=5);image.thumbnail((800,800));image.save(folder.parent/'thumbnail.webp','WEBP',quality=93,method=5)

def read_export(path,name):return json.loads(path.read_text(encoding='utf-8-sig').split('export const '+name+'=',1)[1].rstrip().removesuffix(';'))
artfile=root/'portfolio-artwork.mjs';artwork=read_export(artfile,'portfolioArtwork')
metadatafile=root/'portfolio-projects.mjs';metadata=read_export(metadatafile,'portfolioProjects')
new=[
 dict(slug='weave',title='Weave',date='2025-05',category='Architecture',disciplines='Architecture / Museum / Circulation',note='Woven routes and circular galleries',summary='A MoMA satellite museum proposal in Singapore, shaped by circular galleries, woven circulation and light wells.',role='Architecture student'),
 dict(slug='butterfly-effect',title='Butterfly Effect',date='2025',dateLabel='Early 2025',category='Product',disciplines='Product design / Furniture / CNC milling',note='A sculpted CNC chair',summary='A group-designed chair exploring the expressive possibilities of CNC milling.',role='Group project'),
 dict(slug='art-studies',title='Art studies',date=None,category='Art',disciplines='Painting / Drawing / Colour studies',note='Paintings and observational studies',summary='A collection of paintings exploring architecture, light, colour and everyday subjects.',role='Personal work')
]
for project in new:
 slug=project['slug'];metadata=[p for p in metadata if p['slug']!=slug]
 project.update(nativeArtwork=True,sections=[],accent='blue',image=f'/images/portfolio/{slug}/thumbnail.webp');metadata.append(project)
 if slug!='art-studies':artwork[slug]={'heading':project['title'],'body':'','images':[{k:v for k,v in r.items() if k not in ['slug','index']} for r in records if r['slug']==slug]}

# Keep the original source files and route, but remove artwork from the internship display.
for project in metadata:
 if project['slug']=='previously':
  project.update(title='Internship work',disciplines='Architecture / Drafting / Modelling / Visualisation',note='Architectural internship',summary='Architectural drafting, models, visualisations and detail drawings from my internship.')
old_art=[i for i in artwork['previously']['images'] if i.get('sourcePage') in [40,41]]
if not old_art:old_art=[i for i in artwork.get('art-studies',{}).get('images',[]) if i.get('sourcePage') in [40,41]]
artwork['previously']['images']=[i for i in artwork['previously']['images'] if i.get('sourcePage') not in [40,41]]
artwork['previously'].update(heading='Architectural internship work',body='Architectural drawings, models, visualisations and detail studies from my internship.')
folder=root/'public/images/portfolio/art-studies/artwork';folder.mkdir(parents=True,exist_ok=True)
personal=[]
for index,record in enumerate(old_art,1):
 origin=root/'public'/record['src'].lstrip('/');destination=folder/f'{index:02d}.webp'
 if origin.resolve()!=destination.resolve():shutil.copy2(origin,destination)
 record={**record,'src':'/'+destination.relative_to(root/'public').as_posix()}
 record['sectionKey']='cityscapes' if record['caption']=='Urban sketch' else 'still-life' if record['sourcePage']==41 else 'light-colour'
 if record['caption']=='Urban sketch':record['caption']='Architectural painting'
 personal.append(record)
destination=folder/'waterfront-skyline.png';shutil.copy2(painting,destination);uploaded=Image.open(destination)
personal.insert(0,dict(src='/'+destination.relative_to(root/'public').as_posix(),width=uploaded.width,height=uploaded.height,caption='Waterfront skyline painting',sectionKey='cityscapes',sourceAttachment=painting.name))
thumb=uploaded.convert('RGB');thumb.thumbnail((800,800));thumb.save(folder.parent/'thumbnail.webp','WEBP',quality=95,method=5)
artwork['art-studies']={'heading':'Paintings and studies','body':'','images':personal}
artfile.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
metadatafile.write_text('// Imported project metadata. Artwork and website copy remain separate.\nexport const portfolioProjects='+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
manifest={'source':str(source),'projects':new,'assets':records,'artworkMovedFrom':'previously','artImages':personal,'excluded':['Miniature car','Python memory game','LuminaTrail'],'dateNotes':{'weave':'May 2025, PDF','butterfly-effect':'Early 2025, user; no month assigned','art-studies':'Undated, as requested'}}
(root/'sources/weave-butterfly-art-import.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
canvas=Image.new('RGB',(1400,((len(files)+3)//4)*220),'#bbb');d=ImageDraw.Draw(canvas)
for i,(file,record) in enumerate(zip(files,records)):
 image=Image.open(file).convert('RGB');image.thumbnail((340,185));x=i%4*350;y=i//4*220;canvas.paste(image,(x,y+30));d.text((x+4,y+5),record['slug']+' '+str(record['index'])+' '+record['caption'][:24],fill='black')
canvas.save(temp/'contact.jpg');print('Imported Weave (16 visuals), Butterfly Effect (2), and Art studies (4).')
