import { initFooterPlayground } from './footer-playground.js';
import { initDocumentRulers } from './document-rulers.js';
import { initImageViewer } from './image-viewer.js';
initFooterPlayground();
initDocumentRulers();
initImageViewer();

// Collapse project notes above the document on compact screens.
for(const panel of document.querySelectorAll('.project-layers')){
 const details=panel.querySelector('details');
 const compact=matchMedia('(max-width:1100px)');
 details.open=!compact.matches;
 compact.addEventListener('change',event=>{details.open=!event.matches;});
}

// A real layout-view control; the artwork, captions and viewer stay available.
for(const button of document.querySelectorAll('.guides-toggle')){
 const documentView=button.closest('.project-document');
 button.addEventListener('click',()=>{
  const show=button.getAttribute('aria-pressed')!=='true';
  button.setAttribute('aria-pressed',String(show));
  button.textContent=show?'Guides on':'Guides off';
  documentView.classList.toggle('guides-hidden',!show);
 });
}

// Text-only theme switch; default to the system until the visitor chooses.
const themeButton=document.querySelector('.theme-toggle');
if(themeButton){
 const systemTheme=matchMedia('(prefers-color-scheme:dark)');let chosen=false;
 try{chosen=['light','dark'].includes(localStorage.getItem('portfolio-theme'));}catch{}
 function updateTheme(mode){document.documentElement.dataset.theme=mode;const target=mode==='dark'?'Light':'Dark';themeButton.textContent=target+' mode';themeButton.setAttribute('aria-label','Switch to '+target.toLowerCase()+' mode');document.querySelectorAll('meta[name="theme-color"]').forEach(meta=>{meta.removeAttribute('media');meta.content=mode==='dark'?'#0f0f0f':'#ffffff';});}
 updateTheme(document.documentElement.dataset.theme|| (systemTheme.matches?'dark':'light'));
 themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';chosen=true;try{localStorage.setItem('portfolio-theme',next)}catch{}updateTheme(next);});
 systemTheme.addEventListener('change',event=>{if(!chosen)updateTheme(event.matches?'dark':'light');});
}

const reduced = window.matchMedia(
  '(prefers-reduced-motion: reduce), (max-width:700px), (hover:none) and (pointer:coarse)'
).matches;
if (!reduced) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document
    .querySelectorAll(
      '#selected .section-heading:not(.morph-section),#selected .project,#selected>.text-link'
    )
    .forEach((e, i) => {
      e.classList.add('scroll-reveal');
      e.style.setProperty('--reveal-delay', `${(i % 2) * 90}ms`);
      observer.observe(e);
    });
}
function drawing(canvas, hero = false) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width,
    height,
    angle = 0;
  const type = canvas.dataset.drawing || 'Personal';
  const colors =
    type === 'Product'
      ? ['#e7c6b4', '#d3adbc']
      : type === 'Interactive'
        ? ['#a8d8d4', '#bad8ec']
        : ['#a8c9df', '#d5e1ff'];
  function render() {
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width * 0.32, height * 0.4);
    for (let i = 0; i < 100; i++) {
      const u = (i / 99) * Math.PI * 2;
      for (let j = 0; j < 45; j++) {
        const v = (j / 44) * Math.PI * 2;
        const r = 0.9 + 0.24 * Math.cos(v * 3 + u * 2);
        let x = (r + 0.33 * Math.cos(v)) * Math.cos(u),
          y = (r + 0.33 * Math.cos(v)) * Math.sin(u),
          z = 0.5 * Math.sin(v) + 0.26 * Math.sin(u * 3);
        const a = angle - 0.35;
        let X = x * Math.cos(a) + z * Math.sin(a),
          Z = -x * Math.sin(a) + z * Math.cos(a);
        const px = width * 0.51 + X * scale,
          py = height * 0.52 + (y * 0.53 + Z * 0.64) * scale;
        ctx.globalAlpha = 0.26 + (Z + 1.5) / 4;
        ctx.fillStyle = j % 3 ? colors[0] : colors[1];
        ctx.beginPath();
        ctx.arc(px, py, hero ? 0.85 : 0.65, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    render();
  }
  resize();
  new ResizeObserver(resize).observe(canvas);
  if (hero && !reduced) {
    canvas.addEventListener('pointermove', (e) => {
      angle = (e.offsetX / width - 0.5) * 0.8;
      render();
    });
    canvas.addEventListener('pointerleave', () => {
      angle = 0;
      render();
    });
  }
}
document
  .querySelectorAll('canvas[data-drawing]')
  .forEach((c) => drawing(c, c.id === 'hero-drawing'));
document.querySelectorAll('[data-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document
      .querySelectorAll('[data-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach((p) => {
      p.hidden = category !== 'All' && p.dataset.category !== category;
      if (!p.hidden) count++;
    });
    document
      .querySelector('.project-grid')
      .classList.toggle('filtered', category !== 'All');
    document.getElementById('filter-status').textContent =
      `Showing ${count} project${count === 1 ? '' : 's'}`;
  })
);

const introText = document.querySelector('.quiet-interlude p');
if (introText && !reduced) {
  introText.classList.add('intro-fade');
  new IntersectionObserver(
    (entries) => {
      introText.classList.toggle('is-visible', entries[0].isIntersecting);
    },
    { rootMargin: '-20% 0px', threshold: 0.3 }
  ).observe(introText);
}
