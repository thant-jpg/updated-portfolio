// Crop and place the original JPEGs in one SVG image without redrawing the artwork.
import {readFile,writeFile} from 'node:fs/promises';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
const root=new URL('../',import.meta.url);
const folder=new URL('public/images/portfolio/art-studies/artwork/',root);
const portrait=await readFile(new URL('portrait-gesture-study.jpg',folder));
const eye=await readFile(new URL('eye-hand-study.jpg',folder));
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024" role="img" aria-label="Portrait and eye-and-hand pencil studies">
<rect width="1536" height="1024" fill="white"/>
<svg x="60" y="142" width="664" height="740" viewBox="375 50 655 730" overflow="hidden"><image width="1280" height="894" href="data:image/jpeg;base64,${portrait.toString('base64')}"/></svg>
<svg x="812" y="142" width="671" height="740" viewBox="85 220 535 590" overflow="hidden"><image width="894" height="1280" href="data:image/jpeg;base64,${eye.toString('base64')}"/></svg>
</svg>`;
await writeFile(new URL('portrait-eye-studies.svg',folder),svg);
const story=portfolioArtwork['art-studies'];
const originals=['portrait-gesture-study.jpg','eye-hand-study.jpg'];
const index=story.images.findIndex(image=>originals.some(name=>image.src.endsWith('/'+name))||image.src.endsWith('/portrait-eye-studies.svg'));
story.images=story.images.filter(image=>!originals.some(name=>image.src.endsWith('/'+name))&&!image.src.endsWith('/portrait-eye-studies.svg'));
story.images.splice(index,0,{
 src:'/images/portfolio/art-studies/artwork/portrait-eye-studies.svg',
 width:1536,height:1024,caption:'Portrait and eye-and-hand studies',sectionKey:'sketchbook',
 sourceAttachments:['codex-clipboard-75628dce-f27f-425d-b71a-b32db33737f3.jpg','codex-clipboard-5f7249ed-26b8-45d7-98f0-f3c285391c16.jpg'],
 composition:'Cropped original drawings on one white canvas; original JPEGs preserved.'
});
await writeFile(new URL('portfolio-artwork.mjs',root),'// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+JSON.stringify(portfolioArtwork,null,2)+';\n');
console.log('Combined two original studies into one image; '+story.images.length+' gallery images.');
