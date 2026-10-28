"""Extract the original chair inspiration images and add them to the project."""
from pathlib import Path
from pypdf import PdfReader
import json

root = Path(__file__).resolve().parents[1]
page = PdfReader('C:/Users/Lenovo/Downloads/chair.pdf').pages[1]
images = {Path(image.name).stem: image for image in page.images}
selection = [
    ('Image23', 'inspiration-ripples', 'Ripples and wave interference'),
    ('Image22', 'inspiration-wave-diagram', 'Butterfly shaped wave pattern'),
    ('Image27', 'inspiration-butterfly', 'Patterns and texture in a butterfly wing'),
]
records = []
for key, name, caption in selection:
    image = images[key].image.convert('RGB')
    image.save(root / 'public/images/portfolio/butterfly-effect/chair-story' / (name + '.webp'), 'WEBP', quality=95)
    records.append(dict(src='/images/portfolio/butterfly-effect/chair-story/' + name + '.webp', width=image.width, height=image.height, caption=caption, sectionKey='inspiration', sourcePage=2, sourceDocument='chair.pdf', sourceImage=key))

path = root / 'portfolio-artwork.mjs'
data = json.loads(path.read_text(encoding='utf-8-sig').split('export const portfolioArtwork=', 1)[1].strip().removesuffix(';'))
art = data['butterfly-effect']['images']
art = [image for image in art if image.get('sectionKey') != 'inspiration']
art[1:1] = records
data['butterfly-effect']['images'] = art
path.write_text('// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork=' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
(root / 'sources/chair-inspirations.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
print('Added three original inspiration images, with ripples first.')
