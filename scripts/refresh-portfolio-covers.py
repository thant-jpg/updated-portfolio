from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json
manifest=json.loads(Path('sources/portfolio-import.json').read_text());reader=PdfReader(manifest['source'])
for group in manifest['groups']:
 page=reader.pages[group['cover']-1];images=list(page.images);best=max(images,key=lambda i:i.image.width*i.image.height);key='/'+best.name.rsplit('.',1)[0];matrices=[]
 def locate(op,args,cm,tm):
  if op==b'Do' and str(args[0])==key:matrices.append(list(cm))
 page.extract_text(visitor_operand_before=locate)
 if not matrices:raise RuntimeError('Image placement missing for '+group['slug'])
 a,b,c,d,e,f=matrices[0];corners=[(e,f),(a+e,b+f),(c+e,d+f),(a+c+e,b+d+f)]
 full=Image.open(f"tmp/portfolio-render/page-{group['cover']:02d}.png").convert('RGB');sx=full.width/float(page.mediabox.width);sy=full.height/float(page.mediabox.height)
 box=(round(min(x for x,y in corners)*sx),round(full.height-max(y for x,y in corners)*sy),round(max(x for x,y in corners)*sx),round(full.height-min(y for x,y in corners)*sy))
 cover=full.crop(box);folder=Path('public/images/portfolio')/group['slug'];cover.save(folder/'cover.webp','WEBP',quality=94,method=6);cover.thumbnail((800,800));cover.save(folder/'thumbnail.webp','WEBP',quality=91,method=6)
 print(group['slug'],box)
