"""Publish the seven user-approved AI enhancements; retain original source images."""
from pathlib import Path
from PIL import Image
import json,shutil

root=Path(__file__).resolve().parents[1]
review=root/'previews/flow-enhancement/generation-record.json'
manifest=json.loads(review.read_text(encoding='utf-8'))
artpath=root/'portfolio-artwork.mjs'
artwork=json.loads(artpath.read_text(encoding='utf-8-sig').split('export const portfolioArtwork=',1)[1].rstrip().removesuffix(';'))
folder=root/'public/images/portfolio/flow/enhanced-artwork'
folder.mkdir(parents=True,exist_ok=True)
published=[]
for record in manifest['images']:
 identifier=record['id']
 preview=root/'previews/flow-enhancement'/(identifier+'-enhanced.png')
 master=folder/(identifier+'.png')
 shutil.copy2(preview,master)
 with Image.open(master) as source:
  image=source.convert('RGB')
  image.save(folder/(identifier+'.webp'),'WEBP',quality=96,method=6)
  original='/images/portfolio/flow/complete-artwork/'+identifier+'.webp'
  matching=[i for i in artwork['flow']['images'] if i.get('originalSrc',i['src'])==original]
  if len(matching)!=1:raise RuntimeError('Expected one source image: '+original)
  matching[0].update(src='/images/portfolio/flow/enhanced-artwork/'+identifier+'.webp',width=image.width,height=image.height,originalSrc=original,aiEnhanced=True)
  published.append(matching[0]['src'])
artpath.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+json.dumps(artwork,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
manifest.update(published=True,publishedPaths=published,purpose='User-approved AI enhancement previews published on the Flow project page')
manifest['notes']=[note for note in manifest['notes'] if 'remain pending' not in note]
review.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Published seven approved enhancements; original files retained.')
