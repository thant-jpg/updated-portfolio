"""Place unaltered script screenshots and outputs on shared white SVG panels."""
from pathlib import Path
from PIL import Image
import base64
import json

root=Path(__file__).resolve().parents[1]
folder=root/'public/images/portfolio/ribbon/code-panels'
folder.mkdir(parents=True,exist_ok=True)
records=[]
for code,product,name,caption in [('05','06','balustrade','Balustrade definition and lofted surfaces'),('07','08','handrail','Handrail definition and generated rails'),('09','10','supports','Support definition and central members')]:
    def embed(number,x,width):
        path=root/f'public/images/portfolio/ribbon/complete-artwork/{number}.webp'
        payload=base64.b64encode(path.read_bytes()).decode()
        return f'<image x="{x}" y="24" width="{width}" height="952" preserveAspectRatio="xMidYMid meet" href="data:image/webp;base64,{payload}"/>'
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1000" viewBox="0 0 2200 1000"><rect width="2200" height="1000" fill="white"/>'+embed(code,24,1200)+embed(product,1272,904)+'</svg>'
    (folder/(name+'.svg')).write_text(svg,encoding='utf-8')
    records.append(dict(src='/images/portfolio/ribbon/code-panels/'+name+'.svg',width=2200,height=1000,caption=caption,sourcePage=14))
path=root/'portfolio-artwork.mjs'
data=json.loads(path.read_text(encoding='utf-8-sig').split('export const portfolioArtwork=',1)[1].strip().removesuffix(';'))
rows=data['ribbon']['images']
index=next(i for i,r in enumerate(rows) if r.get('sourcePage')==14)
rows=[r for r in rows if r.get('sourcePage')!=14]
rows[index:index]=records
data['ribbon']['images']=rows
path.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
