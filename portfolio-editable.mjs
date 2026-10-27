import {projectNotes} from './project-notes.mjs';
import {portfolioArtwork} from './portfolio-artwork.mjs';
import {projectCopy} from './project-copy.mjs';
import {portfolioSections} from './portfolio-sections.mjs';
export function renderEditablePortfolio(project,navigation,esc,originalMarkup){
 const source=portfolioArtwork[project.slug];if(!source)return originalMarkup;
 const content={...source,...projectCopy[project.slug]};
 let figureNumber=0;
 const handles='<span class="frame-handles" aria-hidden="true">'+Array.from({length:8},()=>'<i></i>').join('')+'</span>';
 const art=record=>{figureNumber++;return `<figure class="reflow-art ${record.width/record.height>2.5?'reflow-art-panorama':''}"><a href="${esc(record.src)}" aria-haspopup="dialog" aria-label="Open ${esc(record.caption)} at full size"><img src="${esc(record.src)}" alt="${esc(record.caption+' — '+project.title)}" width="${record.width}" height="${record.height}" loading="lazy" decoding="async">${handles}</a><figcaption><span class="figure-index" aria-hidden="true">${String(record.stepNumber??figureNumber).padStart(2,'0')}</span> <span class="figure-caption">${esc(record.caption)}</span></figcaption></figure>`;};
 // Native sections use individual artwork and live text, with no printed page images.
 const groups=new Map();
 for(const image of content.images){const key=image.sectionKey??image.sourcePage;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(image);}
 const notes=projectNotes[project.slug]||project.disciplines.split(' / ');
 const layerItems=notes.map((note,index)=>`<li title="${esc(note)}"><span class="layer-eye" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg></span><span class="layer-swatch" aria-hidden="true"></span><span class="layer-title">${esc(note)}</span></li>`).join('');
 const layers=`<aside class="project-layers"><details open><summary>Layers <span aria-hidden="true">≡</span></summary><ul class="project-layer-notes" aria-label="Project notes">${layerItems}</ul><div class="layers-footer">${notes.length} notes</div></details></aside>`;
 const sections=[...groups].map(([page,images],index)=>{
  const copy=portfolioSections[`${project.slug}:${page}`]||portfolioSections[page]||{heading:images[0].caption};
  const text=copy.body||(index===0?content.body:'');
  const isMakingSequence=project.slug==='flow'&&page==='paper';
  const artwork=isMakingSequence?`<div class="flow-process-strip">${images.slice(0,3).map(art).join('')}</div><div class="flow-process-outcome">${images.slice(3).map(art).join('')}</div>`:images.map(art).join('');
  return `<section class="project-flow-section" aria-labelledby="study-heading-${index}"><header class="project-flow-heading"><span class="layout-section-marker" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><h2 id="study-heading-${index}">${esc(copy.heading)}</h2>${text?`<p>${esc(text)}</p>`:''}${copy.items?`<ul>${copy.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}</header><div class="reflow-art-grid ${project.slug==='butterfly-effect'&&page==='form'?'chair-form-studies':''} ${project.slug==='butterfly-effect'&&page==='structure'?'chair-structure-pair':''} ${images.length===1?'reflow-single-art':''} ${project.slug==='flow'&&images.length===2?'reflow-paired-art':''} ${isMakingSequence?'flow-making-sequence':''}">${artwork}</div></section>`;
 }).join('');
 return `<div class="project-document reflow-document"><div class="project-document-toolbar"><a class="back-link" href="/work/">← Back to work</a><div class="layout-view-controls"><span class="layout-view-label">Layout</span><button class="guides-toggle" type="button" aria-pressed="true">Guides on</button></div></div><div class="project-layout-with-layers"><div class="document-pasteboard reflow-pasteboard"><div class="project-flow"><span class="page-crop-marks" aria-hidden="true"><i></i><i></i><i></i><i></i></span><section class="project-flow-intro" aria-labelledby="project-title"><span class="eyebrow">${esc(project.category)}</span><h1 id="project-title">${esc(project.title)}</h1><p class="sheet-intro">${esc(project.summary)}</p></section>${sections}</div></div>${layers}</div><div class="layout-document-status"><span><i aria-hidden="true"></i>${source.images.length} linked images</span><span>Fit to width</span></div>${navigation}</div>`;
}
