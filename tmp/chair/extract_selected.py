from pathlib import Path
from pypdf import PdfReader
from PIL import Image,ImageDraw
import json
root=Path.cwd();reader=PdfReader('C:/Users/Lenovo/Downloads/chair.pdf')
folder=root/'tmp/chair/extracted';folder.mkdir(exist_ok=True)
selection=[(9,'Image96','finished-chair'),(5,'Image61','seat-outlines'),(5,'Image68','selected-seat'),(6,'Image77','metal-frame'),(7,'Image80','exploded-drawing'),(8,'Image86','bending-frame'),(8,'Image88','cnc-seat'),(8,'Image87','welding-frame'),(9,'Image104','seat-detail'),(9,'Image98','chair-in-use')]
for page,name,slug in selection:
 assets={Path(i.name).stem:i for i in reader.pages[page-1].images}
 assets[name].image.convert('RGB').save(folder/(slug+'.png'))
waves=[]
assets={Path(i.name).stem:i for i in reader.pages[3].images}
for name in ['Image55','Image54','Image56','Image51']:
 waves.append(assets[name].image.convert('RGB'))
canvas=Image.new('RGB',(1154,1140),'black')
for i,im in enumerate(waves):canvas.paste(im.resize((577,570)),((i%2)*577,(i//2)*570))
canvas.save(folder/'wave-studies.png')
files=list(folder.glob('*.png'));sheet=Image.new('RGB',(1200,360*((len(files)+3)//4)),'#ddd');draw=ImageDraw.Draw(sheet)
for i,file in enumerate(files):
 im=Image.open(file);im.thumbnail((280,320));x=(i%4)*300;y=(i//4)*360;sheet.paste(im,(x,y+26));draw.text((x+5,y+5),file.stem,fill='black')
sheet.save(root/'tmp/chair/selected-contact.jpg')
print('Extracted',len(files),'selected visuals')
