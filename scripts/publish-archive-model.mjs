import fs from 'node:fs';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
const a=portfolioArtwork['the-wandering-archive'];
const im=a.images.find(i=>i.src.endsWith('/physical-model-original.webp')||i.src.endsWith('/physical-model-studio.webp'));
Object.assign(im,{src:'/images/portfolio/the-wandering-archive/booklet/physical-model-studio.webp',width:1254,height:1254,caption:'Physical library model',aiEnhanced:true});
a.images=a.images.filter(i=>i.sectionKey!=='physical-model'||i===im);
fs.writeFileSync('portfolio-artwork.mjs','// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+JSON.stringify(portfolioArtwork,null,2)+';\n');
