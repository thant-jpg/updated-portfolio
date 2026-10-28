from PIL import Image
from pathlib import Path
import base64
im=Image.open('tmp/archive-import/massing-spread.png')
im.save('tmp/archive-import/massing-spread.webp',quality=96)
b=base64.b64encode(Path('tmp/archive-import/massing-spread.webp').read_bytes()).decode()
root=Path('public/images/portfolio/the-wandering-archive/booklet')
for name,x,y,w,h in [('labelled-programmes',120,210,1330,1300),('mesh-bridges',1860,420,1140,910)]:
 root.joinpath(name+'.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{x} {y} {w} {h}"><image width="3200" height="1600" href="data:image/webp;base64,{b}"/></svg>',encoding='utf-8')
