"""Import a supplied architecture portfolio after rendering pages with pdftoppm.
Usage: python scripts/import-portfolio.py SOURCE_PDF RENDER_DIRECTORY
No drawings or written content are altered by this import.
"""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json,sys
source=Path(sys.argv[1]); rendered=Path(sys.argv[2]); reader=PdfReader(str(source))
groups=[
 dict(slug='stacked-streets',title='Stacked Streets',start=24,end=29,cover=24,disciplines='Architecture / Housing / Urban design',note='Shophouse future',summary='A vertical neighbourhood along the Bishan River that reimagines the shophouse for 2070s Singapore, combining homes, small businesses and public sky streets.',role='Architecture student'),
 dict(slug='the-wandering-archive',title='The Wandering Archive',start=16,end=23,cover=23,disciplines='Architecture / Speculative design / 3D environments',note='A mobile library for 2100',summary='A speculative mobile library for Mongolian nomads adapting to cave dwellings in 2100, exploring cultural memory, weather data and the relationship between mobility and shelter.',role='Architecture student'),
 dict(slug='a-bridge',title="A Bridge",start=30,end=33,cover=30,disciplines='Architecture / Structures / Fabrication',note='A 4.7 m full-scale bridge',summary='A collaborative 4.7 m bridge project exploring tension, structural behaviour, physical fabrication and folded metal connections.',role='Group project'),
 dict(slug='spatial',title='Spatial',start=4,end=7,cover=5,disciplines='Architecture / 3D modelling / Drawing',note='Spaces and everyday objects',summary='An introduction to Rhino modelling through a building, a lived-in room and an object, using isometric drawings and digital models to tell a personal spatial story.',role='Architecture student'),
 dict(slug='flow',title='Flow',start=8,end=11,cover=8,disciplines='Architecture / Physical modelling / Form studies',note='Structure meets landscape',summary='A paper-model exploration of a structure that rises from the landscape, shaped by wave-like contours, walkable roof surfaces and sheltered spaces.',role='Architecture student'),
 dict(slug='ribbon',title='Ribbon',start=12,end=15,cover=12,disciplines='Computational design / Grasshopper / BIM',note='A parametric staircase',summary='A collaborative staircase study developed from AI-generated imagery through parametric modelling in Grasshopper and a BIM model in Revit.',role='Group project'),
 dict(slug='previously',title='Previously',start=34,end=41,cover=38,disciplines='Architecture / Drafting / Models / Visual studies',note='Earlier work and studies',summary='A collection of earlier work spanning architectural drafting, 3D modelling, visualisation, detail drawings, urban sketches and painting.',role='Selected earlier work')
]
originals=Path('sources/portfolio-cover-originals');originals.mkdir(parents=True,exist_ok=True)
projects=[]
for number,g in enumerate(groups,1):
 folder=Path('public/images/portfolio')/g['slug'];folder.mkdir(parents=True,exist_ok=True)
 page=reader.pages[g['cover']-1];embedded=list(page.images)
 best=max(embedded,key=lambda im:im.image.width*im.image.height)
 (originals/(g['slug']+Path(best.name).suffix)).write_bytes(best.data)
 cover=best.image.convert('RGB');cover.thumbnail((1800,1800));cover.save(folder/'cover.webp','WEBP',quality=93,method=6)
 thumb=cover.copy();thumb.thumbnail((800,800));thumb.save(folder/'thumbnail.webp','WEBP',quality=90,method=6)
 pages=[]
 for pdfpage in range(g['start'],g['end']+1):
  image=Image.open(rendered/f'page-{pdfpage:02d}.png').convert('RGB')
  full=folder/f'page-{pdfpage:02d}.webp';image.save(full,'WEBP',quality=94,method=5)
  width,height=image.size
  preview=image.copy();preview.thumbnail((1300,1300));small=folder/f'page-{pdfpage:02d}-small.webp';preview.save(small,'WEBP',quality=91,method=5)
  text=reader.pages[pdfpage-1].extract_text() or ''
  pages.append(dict(sourcePage=pdfpage,src='/'+str(full.relative_to('public')).replace('\\','/'),preview='/'+str(small.relative_to('public')).replace('\\','/'),width=width,height=height,text=text))
 project={k:g[k] for k in ['slug','title','disciplines','note','summary','role']}
 project.update(category='Architecture',number=f'{number:02d}',image=f"/images/portfolio/{g['slug']}/thumbnail.webp",accent='blue',sections=[],sourcePages=pages,sourceRange=[g['start'],g['end']])
 projects.append(project)
 print(f"Imported {g['title']}: {len(pages)} pages",flush=True)
Path('portfolio-projects.mjs').write_text('// Draft import from the supplied portfolio PDF. Original page layouts are preserved.\nexport const portfolioProjects='+json.dumps(projects,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
Path('sources/portfolio-import.json').write_text(json.dumps(dict(source=str(source),groups=groups,pageCount=len(reader.pages)),indent=2),encoding='utf-8')
