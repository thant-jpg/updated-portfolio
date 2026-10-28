"""Publish the selected Venture render edits without replacing original source images."""
from pathlib import Path
from PIL import Image
import json
import sys

root=Path(__file__).resolve().parents[1]
folder=root/'public/images/portfolio/venture/artwork'
outputs={}
for number,source in zip(['01','04','06'],sys.argv[1:]):
    destination=folder/(number+'-meditation-exhibition.webp')
    image=Image.open(source).convert('RGB')
    image.save(destination,'WEBP',quality=95,method=6)
    outputs[number]=dict(src='/images/portfolio/venture/artwork/'+destination.name,width=image.width,height=image.height)
assert len(outputs)==3,'Expected three selected renders'
path=root/'portfolio-artwork.mjs'
data=json.loads(path.read_text(encoding='utf-8-sig').split('export const portfolioArtwork=',1)[1].strip().removesuffix(';'))
captions={'01':'Exhibition space and stepped circulation — AI assisted render','04':'Quiet gallery and meditation route — AI assisted render','06':'Daylit exhibition space with connecting stairs — AI assisted render'}
for image in data['venture']['images']:
    number=Path(image['src']).stem[:2]
    if number in outputs:
        image.update(outputs[number],caption=captions[number],aiEnhanced=True)
data['venture']['heading']='Meditation and exhibition within a cliff'
data['venture']['body']='A sequence of exhibition and meditation spaces explores a gradual movement from light into darkness and back to the landscape.'
path.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(root/'sources/venture-render-enhancements.json').write_text(json.dumps({'edits':'Higher resolution render edits; casual visitors, sparse exhibition pieces, connecting stairs in the timber interior. Original renders retained.','outputs':outputs},indent=2),encoding='utf-8')
print('Published all three Venture renders.')
