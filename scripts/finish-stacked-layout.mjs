import fs from 'node:fs';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
const sizes=JSON.parse(fs.readFileSync('tmp/stacked-review/published-sizes.json','utf8'));
for(const im of portfolioArtwork['stacked-streets'].images){const name=im.src.split('/').pop().replace('.webp','');if(sizes[name])[im.width,im.height]=sizes[name];if(im.aiEnhanced)im.grain=true;}
fs.writeFileSync('portfolio-artwork.mjs','// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+JSON.stringify(portfolioArtwork,null,2)+';\n');
let r=fs.readFileSync('portfolio-editable.mjs','utf8');
if(!r.includes("record.grain?'photo-grain'"))r=r.replace('class="reflow-art ${record.featuredDrawing','class="reflow-art ${record.grain?\'photo-grain\':\'\'} ${record.featuredDrawing');
r=r.replace("'pause':['32']","'pause':['32'],'stacked-streets':['24','masterplan','site','unit-model']");
r=r.replace('class="reflow-art-grid ${project.slug===', 'class="reflow-art-grid ${project.slug===\'stacked-streets\'?\'stacked-gallery stacked-\'+page:\'\'} ${project.slug===');
fs.writeFileSync('portfolio-editable.mjs',r);
