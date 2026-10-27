"""Copy the user's artworks unchanged and add descriptive, undated gallery records."""
from pathlib import Path
from PIL import Image
import json,shutil,hashlib

root=Path(__file__).resolve().parents[1]
incoming=Path('C:/Users/Lenovo/AppData/Local/Temp')
uploads=[
 ('032a3c81-c33c-4313-9b28-ef3c5e946417','profile-drawing','Profile drawing','portraits-figures'),
 ('8780d14c-b807-4eb2-81df-aa31d8f70c5c','doorway-sketch','Doorway sketch','cityscapes'),
 ('07c1ac91-45ca-4a28-9c4e-d69fb886b565','portrait-colour-accents','Portrait with colour accents','portraits-figures'),
 ('023c0fa3-3e8b-4a9b-89b4-a186bd04d47d','figure-drapery-study','Figure and drapery study','portraits-figures'),
 ('976f6ef5-bb67-44bc-9ae4-52f733cfbc21','figure-drapery-colour','Figure and drapery — colour variation','portraits-figures'),
 ('707ef911-7111-4bab-b8bf-5873e95edc2f','evening-skyline','Evening skyline','cityscapes'),
 ('5f7249ed-26b8-45d7-98f0-f3c285391c16','eye-hand-study','Eye and hand study','sketchbook'),
 ('e95b503e-6e86-4dfb-bd29-27b1d2d07bfc','portrait-ornament-study','Portrait and ornament study','sketchbook'),
 ('e42543f7-ca90-44b9-9dad-75cfd12f4461','bust-shading-study','Bust shading study','portraits-figures'),
 ('119586ce-47fb-47ee-ac86-f7b8e786e7ff','blue-yellow-character','Blue and yellow character study','light-colour'),
 ('a73338e1-0aaf-4b2f-b968-4debb754a450','potted-plant-drawing','Potted plant drawing','still-life'),
 ('665beaf0-ebb7-43c7-96f5-bb410210e013','corridor-perspective','Corridor perspective sketch','cityscapes'),
 ('05348f60-fe66-4011-8d5b-ffdea9e8835a','portrait-with-fish','Portrait with fish','sketchbook'),
 ('b19dc86b-46ca-41b1-827f-083b7f34af06','rabbit-character','Rabbit character sketch','sketchbook'),
 ('2198bbee-f8fd-4e78-b3fc-1c814c00ae19','bus-stop-perspective','Bus stop perspective sketch','cityscapes'),
 ('75628dce-f27f-425d-b71a-b32db33737f3','portrait-gesture-study','Portrait gesture study','portraits-figures')
]
def read_export(path,name):return json.loads(path.read_text(encoding='utf-8-sig').split('export const '+name+'=',1)[1].rstrip().removesuffix(';'))
artfile=root/'portfolio-artwork.mjs';artwork=read_export(artfile,'portfolioArtwork')
story=artwork['art-studies'];existing={i.get('sourceAttachment'):i for i in story['images'] if i.get('sourceAttachment')}
folder=root/'public/images/portfolio/art-studies/artwork';folder.mkdir(parents=True,exist_ok=True)
manifest=[]
for identifier,slug,caption,section in uploads:
 name=f'codex-clipboard-{identifier}.jpg';source=incoming/name;dest=folder/f'{slug}.jpg'
 if source.exists():shutil.copy2(source,dest)
 elif not dest.exists():raise FileNotFoundError(source)
 with Image.open(dest) as image:width,height=image.size
 record=dict(src='/'+dest.relative_to(root/'public').as_posix(),width=width,height=height,caption=caption,sectionKey=section,sourceAttachment=name)
 if name in existing:story['images'].remove(existing[name])
 story['images'].append(record)
 digest=hashlib.sha256(dest.read_bytes()).hexdigest()
 if source.exists():assert digest==hashlib.sha256(source.read_bytes()).hexdigest()
 manifest.append({**record,'sha256':digest})
order=['cityscapes','portraits-figures','sketchbook','light-colour','still-life']
story['images'].sort(key=lambda image:order.index(image.get('sectionKey')))
story['heading']='Paintings, drawings and studies'
story['body']=''
artfile.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
metadatafile=root/'portfolio-projects.mjs';metadata=read_export(metadatafile,'portfolioProjects')
for project in metadata:
 if project['slug']=='art-studies':project.update(summary='Paintings and drawings exploring people, places, light and colour.',disciplines='Painting / Drawing / Studies',date=None)
metadatafile.write_text('// Imported project metadata. Artwork and website copy remain separate.\nexport const portfolioProjects='+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(root/'sources/art-uploads.json').write_text(json.dumps({'datePolicy':'Undated, as requested','artworks':manifest},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Added {len(manifest)} original images; Art studies now contains {len(story["images"])} pieces.')
