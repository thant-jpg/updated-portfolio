import {renderImportedPortfolio} from './portfolio-document.mjs';
import {projectMedia} from './project-media.mjs';

// The sheet layout is shared by project pages; artwork and copy remain project-specific.
export function renderProjectDocument(project, next, esc, imageExists) {
  if(project.sourcePages?.length)return renderImportedPortfolio(project,next,esc);
  const media=projectMedia[project.slug]||{};
  const architectural=project.category==='Architecture';
  const labels=architectural
    ? {cover:'Main drawing or render',plan:'Plan or spatial study',section:'Section or development',outcome:'Final drawing or model'}
    : {cover:'Main project visual',plan:'Early exploration',section:'Development or prototype',outcome:'Final outcome'};
  const asset=(key,figure)=>{
    const src=media[key]||(key==='cover'?project.image:null);
    const available=src&&imageExists(src);
    return `<figure class="layout-figure layout-figure-${key}"><div class="layout-image ${available?'has-artwork':'is-empty'}">${available?`<img src="${esc(src)}" alt="${esc(project.title+' — '+labels[key])}" loading="${key==='cover'?'eager':'lazy'}">`:`<div class="layout-placeholder"><svg viewBox="0 0 64 48" aria-hidden="true"><path d="M5 5h54v38H5Z M5 43 25 23l12 12 10-10 12 12"/><circle cx="45" cy="15" r="4"/></svg><span>${esc(labels[key])}</span><small>Artwork to follow</small></div>`}</div><figcaption><span>Fig. ${figure} — ${esc(labels[key])}</span><span>${available?'': 'IMAGE SPACE'}</span></figcaption></figure>`;
  };
  const folio=number=>'';
  const section=(index,fallback)=>project.sections[index]||[fallback,''];
  const first=section(0,'The starting point'),second=section(1,'Process & development'),last=section(2,'The outcome');
  const topTicks=Array.from({length:61},(_,i)=>`<path d="M${i*20} 24v-${i%5===0?12:5}"/>${i%5===0?`<text x="${i*20+4}" y="9">${i*20}</text>`:''}`).join('');
  const sideTicks=Array.from({length:36},(_,i)=>`<path d="M24 ${i*20}h-${i%5===0?12:5}"/>${i%5===0?`<text x="2" y="${i*20+10}">${i*20}</text>`:''}`).join('');
  return `<div class="project-document"><div class="project-document-toolbar"><a class="back-link" href="/work/">← Back to work</a></div><div class="document-pasteboard"><div class="page-ruler page-ruler-top" aria-hidden="true"><svg viewBox="0 0 1220 24" preserveAspectRatio="none">${topTicks}</svg></div><div class="page-ruler page-ruler-side" aria-hidden="true"><svg viewBox="0 0 24 720" preserveAspectRatio="none">${sideTicks}</svg></div>
  <article class="portfolio-sheet sheet-opening" aria-labelledby="project-title"><div class="sheet-copy"><span class="eyebrow">${esc(project.category)}</span><h1 id="project-title">${esc(project.title)}</h1><p class="sheet-intro">${esc(project.summary)}</p><dl class="sheet-meta"><div><dt>My role</dt><dd>${esc(project.role)}</dd></div><div><dt>Disciplines</dt><dd>${esc(project.disciplines)}</dd></div></dl></div>${asset('cover','01')}${folio('01')}</article>
  <article class="portfolio-sheet sheet-process" aria-labelledby="process-title"><div class="sheet-section-heading"><span class="eyebrow">Process</span><h2 id="process-title">${esc(first[0])}</h2></div><div class="sheet-process-grid"><div class="sheet-process-copy"><p>${esc(first[1])}</p><h3>${esc(second[0])}</h3><p>${esc(second[1])}</p></div>${asset('plan','02')}${asset('section','03')}</div>${folio('02')}</article>
  <article class="portfolio-sheet sheet-outcome" aria-labelledby="outcome-title"><div class="sheet-section-heading"><span class="eyebrow">Outcome</span><h2 id="outcome-title">${esc(last[0])}</h2></div><div class="sheet-outcome-grid">${asset('outcome','04')}<div class="sheet-outcome-copy"><p>${esc(last[1])}</p></div></div>${folio('03')}</article>
  </div><nav class="document-end-nav" aria-label="Project navigation"><a class="text-link" href="/work/">All projects</a><a class="text-link" href="/work/${esc(next.slug)}/">Next: ${esc(next.title)} ↗</a></nav></div>`;
}
