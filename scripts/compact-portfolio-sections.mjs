import fs from 'node:fs';
import {portfolioSections} from '../portfolio-sections.mjs';
const p='the-wandering-archive:';
const changes={
community:['Seasonal knowledge of weather, land and ecology.','Oral traditions and collective memory.','A library shaped around movement and shared experience.'],
quartz:['Durable quartz glass holds the records.','Laser writing; specialised optical reading.','Limited carrying capacity makes selection essential.'],
'weather-research':['Acquire and organise weather observations.','Filter and interpret the data.','Make useful information available for the next journey.'],
users:['Data technician: sorts and selects incoming records.','Archivist: transcribes, tags and stores quartz; gathers oral knowledge.','Visitor: reads datasets, browses the archive and shares observations.'],
programmes:['Public: reading, archive and discussion.','Processing: data selection and engraving.','Collection: observation and quality control.'],
'19':['Solar radiation: locate sunlit gathering areas and shaded archives.','Flat surfaces: identify possible platforms and attachments.']
};
for(const [key,items]of Object.entries(changes)){portfolioSections[p+key].body=key==='community'?'I chose Mongolian nomads for their existing relationship with the land.':key==='weather-research'?'OpenWeather helped me structure the information cycle.':key==='19'?'I studied Devetashka Cave as a typology and tested the modelled site.':'';portfolioSections[p+key].items=items;}
fs.writeFileSync('portfolio-sections.mjs','// Native website text selected from the supplied project material.\nexport const portfolioSections='+JSON.stringify(portfolioSections,null,2)+';\n');
const file='portfolio-editable.mjs';let source=fs.readFileSync(file,'utf8');
const needle='  const text=copy.body||(index===0?content.body:\'\');';
if(!source.includes('const compactSections='))source=source.replace(needle,needle+`
  const compactSections={'the-wandering-archive':['16','studio','narrative','community','quartz','weather-research','selected-site','23','physical-model'],'a-bridge':['30'],'spatial':['5'],'flow':['urban-study','landscape-view'],'ascent':['sun','11'],'venture':['8','10'],'pause':['32']};
  const compactSection=(compactSections[project.slug]||[]).includes(String(page));`);
source=source.replaceAll('class="project-flow-section" aria-labelledby=', 'class="project-flow-section ${compactSection?\'compact-story-section\':\'\'}" aria-labelledby=');
fs.writeFileSync(file,source);
