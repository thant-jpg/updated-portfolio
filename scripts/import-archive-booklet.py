"""Import original embedded artwork; keep reference imagery explicitly labelled."""
from pathlib import Path
from PIL import Image
import json, base64

root=Path('public/images/portfolio/the-wandering-archive/booklet')
root.mkdir(parents=True,exist_ok=True)
entries=[]
assets=[
 (11,0,'city-narrative','Life in the vertical cities — personal narrative collage','narrative'),
 (14,0,'nomadic-life','Mongolian nomadic life — online reference image','community'),
 (17,0,'mongolia','Mongolia — community context map','community'),
 (15,2,'quartz-discs','Quartz glass storage — online research reference','quartz'),
 (15,1,'quartz-reading','Encoded quartz sample — online research reference','quartz'),
 (15,3,'quartz-process','Writing and reading quartz — online research reference','quartz'),
 (16,0,'openweather','OpenWeather research — collecting and representing weather data','weather-research'),
 (19,0,'blender-top','Cave terrain study — Blender','blender-site'),
 (19,1,'blender-axon','Cave geometry study — Blender','blender-site'),
 (20,0,'unreal-landscape','Landscape before inserting the library — Unreal Engine','unreal-site'),
 (21,0,'unreal-terrain','Terrain and vegetation study — Unreal Engine','unreal-site'),
 (21,1,'unreal-aerial','Aerial site study — Unreal Engine','unreal-site'),
 (24,0,'unreal-cave','Cave interior before inserting the library — Unreal Engine','unreal-site'),
 (27,0,'cave-model','Physical cave model — openings and enclosure','site-model'),
 (28,0,'cave-model-interior','Physical cave model — interior study','site-model'),
 (31,0,'librarian-diagram','Librarian user diagram','users'),
 (32,0,'visitor-diagram','Visitor user diagram','users'),
 (55,0,'physical-model-original','Physical library model — original photograph','physical-model'),
 (56,0,'physical-model-front','Physical library model — front view','physical-model'),
]
for page,index,name,caption,section in assets:
 im=Image.open(f'tmp/archive-import/p{page}-{index}.jpg').convert('RGB')
 im.thumbnail((3000,3000))
 im.save(root/f'{name}.webp',quality=92)
 entries.append(dict(src=f'/images/portfolio/the-wandering-archive/booklet/{name}.webp',width=im.width,height=im.height,caption=caption,sectionKey=section,bookletPage=page,provenance='online reference' if page in [11,14,15] else 'user supplied booklet'))

# Retain the original studio diagram, dim all entries except the author's blue box.
# This SVG is an overlay on the rendered PDF, so all original names and text remain intact.
spread=Path('tmp/archive-import/studio-spread.png').read_bytes()
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1455" height="1135" viewBox="22 280 1455 1135">
<defs><mask id="dim"><rect x="22" y="280" width="1455" height="1135" fill="white"/><rect x="409" y="491" width="359" height="108" fill="black"/><rect x="650" y="599" width="30" height="700" fill="black"/></mask></defs>
<image width="3000" height="1500" href="data:image/png;base64,{base64.b64encode(spread).decode()}"/>
<rect x="22" y="280" width="1455" height="1135" fill="#101116" opacity=".58" mask="url(#dim)"/>
</svg>'''
(root/'studio-timeline.svg').write_text(svg,encoding='utf-8')
entries.insert(0,dict(src='/images/portfolio/the-wandering-archive/booklet/studio-timeline.svg',width=1455,height=1135,caption='Collective studio timeline — my 2078 proposal highlighted',sectionKey='studio',bookletPage=2))
Path('sources/archive-booklet-import.json').write_text(json.dumps(entries,indent=2),encoding='utf-8')
