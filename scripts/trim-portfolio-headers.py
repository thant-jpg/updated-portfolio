"""Render web project sheets without the repeated 46pt PDF header band.
The supplied PDF is read only. Crop boxes are applied to a temporary PDF.
"""
from pathlib import Path
from pypdf import PdfReader,PdfWriter
from PIL import Image
import pdfplumber,json,subprocess
manifest=json.loads(Path('sources/portfolio-import.json').read_text())
source=Path(manifest['source']);folder=Path('tmp/portfolio-trim');folder.mkdir(parents=True,exist_ok=True)
reader=PdfReader(str(source));writer=PdfWriter()
for page in reader.pages:
 writer.add_page(page)
 writer.pages[-1].cropbox.upper_right=(float(page.mediabox.right),float(page.mediabox.top)-46)
trimmed=folder/'portfolio-trimmed.pdf'
with trimmed.open('wb') as stream:writer.write(stream)
poppler=Path(r'C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
subprocess.run([str(poppler),'-cropbox','-f','4','-l','41','-scale-to','2600','-png',str(trimmed),str(folder/'page')],check=True)
module=Path('portfolio-projects.mjs');text=module.read_text(encoding='utf-8');projects=json.loads(text.split('export const portfolioProjects=',1)[1].rstrip().removesuffix(';'))
with pdfplumber.open(source) as original:
 for project in projects:
  for page in project['sourcePages']:
   number=page['sourcePage'];image=Image.open(folder/f'page-{number:02d}.png').convert('RGB')
   full=Path('public'+page['src']);small=Path('public'+page['preview']);image.save(full,'WEBP',quality=94,method=5);page['width'],page['height']=image.size
   preview=image.copy();preview.thumbnail((1300,1300));preview.save(small,'WEBP',quality=91,method=5)
   original_page=original.pages[number-1];page['text']=original_page.crop((0,46,original_page.width,original_page.height)).extract_text() or ''
  print('Cleaned headers: '+project['title'],flush=True)
module.write_text('// Draft import from the supplied portfolio PDF. Repeated top headers removed from web sheets.\nexport const portfolioProjects='+json.dumps(projects,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
