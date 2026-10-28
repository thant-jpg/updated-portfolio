import fs from 'node:fs';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
import {portfolioSections} from '../portfolio-sections.mjs';
const slug='the-wandering-archive';
const entries=Object.entries(portfolioSections).filter(([key])=>key.startsWith(slug+':'));
const words=s=>s.trim().split(/\s+/).length;
const before=entries.reduce((n,[,c])=>n+words(c.body||'')+(c.items||[]).reduce((n,t)=>n+words(t),0),0);
const bodies={
'16':'What knowledge is worth carrying when you cannot keep everything? I imagined a community collecting weather observations as it travels, preserving what might help someone survive the next journey.',
studio:'Our studio developed this future timeline together. My highlighted proposal follows a nomadic community that leaves its usual routes, collecting climatic data to share with the communities it meets.',
narrative:'In my imagined future, the grasslands begin to fail in the 2050s. Longer summers and harsher winters force nomadic communities into cities. The housing is meant to be temporary, but the weather never settles.',
'personal-timeline':'From 2078, the community’s growing collection of weather observations becomes a travelling library. Archives left along its routes gradually form a network around a permanent hub.',
community:'I chose Mongolian nomads because seasonal knowledge of weather, land and ecology is already part of their way of life. Passed through oral tradition and collective memory, this knowledge gave me a starting point for a library rooted in movement.',
quartz:'Quartz glass storage gave the archive a durable physical medium. Data is written using laser pulses and read through specialised optical equipment. In my narrative, the limit is what people can carry: selecting what to preserve becomes as important as collecting it.',
'weather-research':'I studied how OpenWeather acquires, organises, filters and represents weather data. This helped me identify the work needed between receiving an observation and making it useful to someone planning a journey.',
'data-flow':'Sensors, observations and satellites supply raw data. Librarians sort and select it before engraving useful records onto quartz. Reading and transcription make those records accessible again, while discussions bring local knowledge back into the collection. The diagram follows this cycle from observation to shared knowledge.',
users:'Librarians follow the working route through selection, engraving, checking and archiving. Visitors come to read, retrieve information and contribute observations. The reading chamber and discussion circle are where these routes meet.',
'blender-site':'I developed the cave geometry in Blender, studying its openings and terrain before placing the library.',
'unreal-site':'In Unreal Engine, I explored the site’s vegetation and light. These three views move from the exposed landscape towards the sheltered cave interior, before the architecture is added.',
'site-model':'The physical site model helped me study the cave’s enclosure and openings away from the screen.',
'selected-site':'I selected a 42 m cube near the cave entrance, where visitors can reach the library without travelling deep inside. The position brings daylight to the arrival spaces and connects the sheltered archive with the landscape beyond.',
programmes:'I translated the data cycle into three groups of spaces: public areas for reading and exchange, processing spaces for selection and engraving, and collection areas for observation and quality control.',
'19':'I studied Devetashka Cave in Bulgaria as a cave typology. Solar radiation analysis helped distinguish brighter gathering areas from shaded archive spaces. Flat-surface analysis identified possible locations for platforms and attachments.',
'20':'Purple collection spaces feed into blue processing areas and orange public rooms. Mesh bridges connect the workspaces, allowing librarians to carry records between selection, engraving and checking. The routes also provide places to pause and exchange ideas.',
'21':'The section, plan and aerial view show how the rooms, bridges and canopies fit within the cave. I kept the larger communal spaces connected while giving the working areas their own routes between levels.',
'22':'The interior views follow the collection into the reading chamber, archive and quartz display. Visitors can browse records, request a copy of a dataset or share observations in the discussion circle.',
'23':'The cave is a permanent place to return to, while smaller libraries carry knowledge between communities. Each journey adds something to the archive and takes something useful away.',
'physical-model':'The final model brings the solid rooms and lightweight canopies together, showing how a permanent archive can retain the character of portable shelters.'
};
for(const [key,body]of Object.entries(bodies))portfolioSections[slug+':'+key].body=body;
portfolioSections[slug+':narrative'].items=[
'2063–2075 · Life in the cities: Platform-n tracks daily resource use. Some people adapt, but others find the routines too rigid.',
'2073–2075 · Remembering: stories of travelling with the seasons begin to feel like possibilities again.',
'2076–2078 · Returning to movement: small groups leave with portable technology and collapsible shelters. They travel light, trade and repair rather than replace.'
];
portfolioSections[slug+':19'].heading='Reading the cave through analysis';
portfolioSections[slug+':massing']={heading:'Fitting rooms and shelters into the rock',body:'I adjusted the programme volumes to the cave’s contours and flatter surfaces. Tent-like canopies recall the community’s temporary shelters: smaller ones cover reading and discussion areas, while the larger canopy gathers the communal spaces beneath it.'};
portfolioSections[slug+':21'].heading='The library in plan and section';
const a=portfolioArtwork[slug];
for(const im of a.images)if(im.sectionKey==='19'&&im.src.includes('/complete-artwork/'))im.sectionKey='massing';
// Keep all selected artwork, in sequence; group layouts are controlled by section key.
fs.writeFileSync('portfolio-artwork.mjs','// Individual artwork, with native website copy and captions.\nexport const portfolioArtwork='+JSON.stringify(portfolioArtwork,null,2)+';\n');
fs.writeFileSync('portfolio-sections.mjs','// Native website text selected from the supplied project material.\nexport const portfolioSections='+JSON.stringify(portfolioSections,null,2)+';\n');
const after=Object.entries(portfolioSections).filter(([k])=>k.startsWith(slug+':')&&a.images.some(i=>k===slug+':'+i.sectionKey)).reduce((n,[,c])=>n+words(c.body||'')+(c.items||[]).reduce((n,t)=>n+words(t),0),0);
console.log('Active page text: '+after+' words. Earlier archive section entries: '+before+' words (including unused entries). All '+a.images.length+' selected images retained.');
