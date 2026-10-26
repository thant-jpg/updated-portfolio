import {portfolioArtwork} from './portfolio-artwork.mjs';
import {projectCopy} from './project-copy.mjs';
import {portfolioSections} from './portfolio-sections.mjs';
export function renderEditablePortfolio(project,next,esc,originalMarkup){
 const source=portfolioArtwork[project.slug];if(!source)return originalMarkup;
 const content={...source,...projectCopy[project.slug]};
 const art=record=>`<figure class="reflow-art"><a href="${esc(record.src)}" target="_blank" rel="noopener" aria-label="Open ${esc(record.caption)} at full size"><img src="${esc(record.src)}" alt="${esc(record.caption+' — '+project.title)}" width="${record.width}" height="${record.height}" loading="lazy" decoding="async"></a><figcaption>${esc(record.caption)}</figcaption></figure>`;
 // Native sections use individual artwork and live text, with no printed page images.
 const groups=new Map();
 for(const image of content.images){if(!groups.has(image.sourcePage))groups.set(image.sourcePage,[]);groups.get(image.sourcePage).push(image);}
 const cover=project.presentationImage||'/images/portfolio/'+project.slug+'/cover.webp';
 const sections=[...groups].map(([page,images],index)=>{
  const copy=portfolioSections[page]||{heading:images[0].caption};
  const text=copy.body||(index===0?content.body:'');
  return `<section class="project-flow-section" aria-labelledby="study-heading-${index}"><header class="project-flow-heading"><h2 id="study-heading-${index}">${esc(copy.heading)}</h2>${text?`<p>${esc(text)}</p>`:''}${copy.items?`<ul>${copy.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}</header><div class="reflow-art-grid ${images.length===1?'reflow-single-art':''}">${images.map(art).join('')}</div></section>`;
 }).join('');
 return `<div class="project-document reflow-document"><div class="project-document-toolbar"><a class="back-link" href="/work/">← Back to work</a></div><div class="document-pasteboard reflow-pasteboard"><div class="project-flow"><section class="project-flow-intro" aria-labelledby="project-title"><span class="eyebrow">${esc(project.category)}</span><h1 id="project-title">${esc(project.title)}</h1><p class="sheet-intro">${esc(project.summary)}</p><dl class="sheet-meta"><div><dt>Project</dt><dd>${esc(project.role)}</dd></div><div><dt>Disciplines</dt><dd>${esc(project.disciplines)}</dd></div></dl><figure class="reflow-cover"><a href="${esc(cover)}" target="_blank" rel="noopener" aria-label="Open ${esc(project.title)} cover at full size"><img src="${esc(cover)}" alt="${esc(project.title)} project visual" loading="eager"></a></figure></section>${sections}</div></div><nav class="document-end-nav" aria-label="Project navigation"><a class="text-link" href="/work/">All projects</a><a class="text-link" href="/work/${esc(next.slug)}/">Next: ${esc(next.title)} ↗</a></nav></div>`;
}
