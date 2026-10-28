import {writeFile} from 'node:fs/promises';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
const project=portfolioArtwork.venture;
const byName=Object.fromEntries(project.images.map(image=>[image.src.split('/').pop(),image]));
byName['05.webp'].sectionKey=9;
byName['03.webp'].sectionKey=11;
project.images=['01.webp','02.webp','05.webp','04.webp','06.webp','03.webp'].map(name=>byName[name]);
await writeFile(new URL('../portfolio-artwork.mjs',import.meta.url),'// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+JSON.stringify(portfolioArtwork,null,2)+';\n');
console.log('Moved original image 05 into section 02 and the isometric section into the last section.');
