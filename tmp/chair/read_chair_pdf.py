from pathlib import Path
import pdfplumber,json,subprocess
from PIL import Image,ImageDraw
source=Path('C:/Users/Lenovo/Downloads/chair.pdf')
out=Path('tmp/chair')
with pdfplumber.open(source) as doc:
 pages=[{'page':i+1,'text':p.extract_text() or '', 'images':[{k:im.get(k) for k in ('name','x0','top','x1','bottom','width','height','srcsize')} for im in p.images]} for i,p in enumerate(doc.pages)]
(out/'inspection.json').write_text(json.dumps(pages,indent=2),encoding='utf-8')
print('\n\n'.join('PAGE '+str(p['page'])+'\n'+p['text'] for p in pages))
subprocess.run(['C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe','-scale-to','700','-png',str(source),str(out/'page')],check=True)
files=sorted(out.glob('page-*.png'))
sheet=Image.new('RGB',(1400,575*5),'#dddddd')
for i,f in enumerate(files):
 im=Image.open(f).convert('RGB');im.thumbnail((680,530));x=(i%2)*700;y=(i//2)*575
 sheet.paste(im,(x,y+28));ImageDraw.Draw(sheet).text((x+10,y+8),'Page '+str(i+1),fill='black')
sheet.save(out/'contact-sheet.jpg')
