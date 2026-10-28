import fs from 'node:fs';
import {projectCopy} from '../project-copy.mjs';
import {portfolioArtwork} from '../portfolio-artwork.mjs';
import {portfolioSections} from '../portfolio-sections.mjs';
const questions={
'stacked-streets':'How can the shophouse adapt to rising rents and changing retail, so people can live and build a business in the same neighbourhood?',
'the-wandering-archive':'What knowledge is worth carrying when a community cannot preserve everything?',
'a-bridge':'How can timber, tension members and metal joints work together in a bridge we can build at full size?',
spatial:'How can modelling an everyday room and object help me understand their spaces, parts and construction?',
flow:'How can a 25 × 25 cm sheet of paper become a structure that creates shelter?',
'butterfly-effect':'How can CNC milling turn patterns from nature into a chair experienced through touch as well as sight?',
ribbon:'How can an AI staircase image become a workable parametric and BIM model?',
ascent:'How can a home support a gardener’s shared and private routines within a plan limited to a square, triangle and circle?',
venture:'How can subtracting a basic shape from a cliff create usable spaces with daylight?',
pause:'How can a public toilet offer privacy while remaining open to light, air and planting?',
weave:'How can artists’ work shape the spaces and visitor route of a satellite museum?',
'virtual-singapore':'How can shared games and a virtual city give people ways to meet and connect?',
easyconvo:'How can a phonics app support young children learning to read, alongside their teachers?'
};
for(const [slug,q]of Object.entries(questions))if(projectCopy[slug])projectCopy[slug].problemStatement=q;
const a=portfolioArtwork['stacked-streets'];
a.sectionOrder=['masterplan','masterplan-reading','masterplan-water','masterplan-connections','intentions','site',24,25,26,27,29,28,'building-model','unit-model'];
portfolioSections['stacked-streets:intentions'].heading='My brief: a neighbourhood for living and working';
portfolioSections['stacked-streets:intentions'].body='E-commerce and increasing rents led me to ask how the shophouse could adapt. I wanted people to have a place to build a business without having to choose between work and home. My target users are creative solo-preneurs and freelancers, small-scale manufacturers and shophouse owners, including singles and multigenerational families. Their different routines informed the mix of unit types and shared spaces.';
portfolioSections['stacked-streets:24'].heading='Bringing the street upwards';
portfolioSections['stacked-streets:24'].body='My response is a vertical neighbourhood with public sky streets between residential floors. This brings the everyday encounters of a shophouse street into a denser building, while retaining a quieter route home. The following plans, unit studies and sections show how I developed that separation and the connections between living, working and shared space.';
for(const [file,name,value]of [['project-copy.mjs','projectCopy',projectCopy],['portfolio-artwork.mjs','portfolioArtwork',portfolioArtwork],['portfolio-sections.mjs','portfolioSections',portfolioSections]])fs.writeFileSync(file,'// Portfolio content from supplied project material.\nexport const '+name+'='+JSON.stringify(value,null,2)+';\n');
let r=fs.readFileSync('portfolio-editable.mjs','utf8');
const old='<p class="sheet-intro">${esc(project.summary)}</p>';
const updated='${content.problemStatement?`<p class="project-problem-statement"><strong>${esc(content.problemStatement)}</strong></p>`:\'\'}'+old;
if(!r.includes('class="project-problem-statement"'))r=r.replace(old,updated);
fs.writeFileSync('portfolio-editable.mjs',r);
