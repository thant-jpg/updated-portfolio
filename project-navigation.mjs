export function renderProjectNavigation(projects,current,esc,imageExists){
 const index=projects.findIndex(project=>project.slug===current.slug);
 const previous=projects[index<0?projects.length-1:(index-1+projects.length)%projects.length];
 const next=projects[(index+1)%projects.length];
 const card=(project,direction)=>{
  const image=[`/images/portfolio/${project.slug}/thumbnail.webp`,project.image].find(src=>src&&imageExists(src));
  const initials=project.title.split(/\s+/).slice(0,2).map(word=>word[0]).join('');
  const thumbnail=image?`<img src="${esc(image)}" alt="" width="64" height="48" loading="lazy" decoding="async">`:`<span class="project-nav-initials" aria-hidden="true">${esc(initials)}</span>`;
  return `<a class="project-nav-card project-nav-${direction}" href="/work/${esc(project.slug)}/" rel="${direction==='previous'?'prev':'next'}" aria-label="${direction==='previous'?'Previous':'Next'} project: ${esc(project.title)}"><span class="project-nav-thumbnail">${thumbnail}</span><span class="project-nav-copy"><span class="project-nav-label">${direction==='previous'?'← Back':'Next →'}</span><span class="project-nav-title">${esc(project.title)}</span></span></a>`;
 };
 return `<nav class="document-end-nav" aria-label="Project navigation">${card(previous,'previous')}<a class="project-nav-all" href="/work/">All projects</a>${card(next,'next')}</nav>`;
}
