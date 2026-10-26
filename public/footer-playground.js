// Small, dependency-free rigid-disc simulation; SVG pieces share one print palette.
const motifs = [
  [
    'Stepped architectural model',
    '<path d="m7 66 15-9V43l14-8V22L56 9l17 10v47L38 78Z" fill="currentColor"/><path d="m7 66 31 12V64L22 55m16 9 35-20M36 35l18 10V31L36 22m18 23 19-11M56 9v14l17-4"/>',
  ],
  [
    'Masonry arch',
    '<path d="M8 74V35a32 32 0 0 1 64 0v39H53V36a13 13 0 0 0-26 0v38Z" fill="currentColor"/><path d="M17 35h10m26 0h10M40 5v18M19 13l12 14m30-14L49 27M9 49h18m26 0h19M9 63h18m26 0h19"/>',
  ],
  [
    'Pitched roof house',
    '<path d="M5 36 34 7l39 19v42L39 78 8 63V37Z" fill="currentColor"/><path d="m5 36 34 16 34-26M34 7l5 45v26M15 43v13l11 5V48Zm34 7v15l13-5V45Z"/>',
  ],
  [
    'Tower model',
    '<path d="m20 13 26-9 19 10v56l-27 9-18-10Z" fill="currentColor"/><path d="m20 13 18 11 27-10M38 24v55M25 25l8 5m-8 6 8 5m-8 6 8 5m-8 6 8 5M44 29l15-5M44 41l15-5M44 53l15-5M44 65l15-5"/>',
  ],
  [
    'Structural portal frame',
    '<path d="M5 76V8h70v68H60V22H20v54Z" fill="currentColor"/><path d="M10 14h58M12 21v48m55-48v48M20 22l14 14m26-14L46 36"/>',
  ],
  [
    'Apartment floor plan',
    '<path d="M5 6h70v69H5Z" fill="currentColor"/><path d="M12 13h56v55H12Zm25 0v21H12m25 12v22m0-26h31M37 34h10v8m0-8a8 8 0 0 1 8 8M18 18h12v10H18Zm27 30h15v12H45Z"/>',
  ],
  [
    'Building section',
    '<path d="M6 73V31L40 5l34 26v42Z" fill="currentColor"/><path d="m14 32 26-20 26 20M14 32h52M14 51h52M14 68h52M26 32v36m28-36v36M30 51v-5h5v-5h5v-5h5"/>',
  ],
  [
    'Colonnade',
    '<path d="M4 11h72v11H4Zm5 16h13v39H9Zm25 0h13v39H34Zm25 0h13v39H59ZM4 68h72v9H4Z" fill="currentColor"/><path d="M15 30v32m25-32v32m25-32v32M5 17h70"/>',
  ],
  [
    'Sawtooth workshop',
    '<path d="M5 72V28l23-18v18l23-18v18l23-18v62Z" fill="currentColor"/><path d="M13 38h11v13H13Zm23 0h11v13H36Zm23 0h8v13h-8M33 72V58h17v14"/>',
  ],
  [
    'Truss bridge',
    '<path d="M4 28h72v35H4Z" fill="currentColor"/><path d="M10 34h60v22H10Zm0 22 10-22 10 22 10-22 10 22 10-22 10 22M6 69h68"/>',
  ],
  [
    'Spiral stair',
    '<path d="M35 6h11v68H35Z" fill="currentColor"/><path d="m40 8 30 12-30 8-28 10 28 10 29 11-29 12-29-12" stroke="currentColor" stroke-width="9"/><path d="m40 13 22 7-22 5m-2 8-19 5 19 6m4 10 19 5-19 7"/>',
  ],
  [
    'Wireframe volume',
    '<path d="m40 5 33 18v36L40 77 7 59V23Z" fill="currentColor"/><path d="m7 23 33 19 33-19M40 42v35M40 5v37M7 59l33-17 33 17"/>',
  ],
  [
    'Chair',
    '<path d="M16 7h38v35l16 8v9H56v17h-8V59H24v17h-8V49H9v-9h7Z" fill="currentColor"/><path d="M23 15h23v23H23Zm-7 27 32 10 22-2M24 59v-8"/>',
  ],
  [
    'Round stool',
    '<ellipse cx="40" cy="22" rx="29" ry="14" fill="currentColor"/><path d="M17 24h9l-5 50h-8Zm36 0h9l6 50h-9ZM36 27h9v46h-9Z" fill="currentColor"/><path d="M19 49h42M15 23c15 8 35 8 49 0"/>',
  ],
  [
    'Dining table',
    '<path d="m6 25 38-16 31 17-36 19Z" fill="currentColor"/><path d="M9 27h8v40H9Zm26 14h8v35h-8Zm30-12h8v37h-8Z" fill="currentColor"/><path d="m13 27 26 12 29-12"/>',
  ],
  [
    'Floor lamp',
    '<path d="m27 6-16 27h48L45 6ZM32 34h8v34H32Zm-12 37h32v7H20Z" fill="currentColor"/><path d="M23 28h25M36 8v17"/>',
  ],
  [
    'Bookshelf',
    '<path d="M9 5h62v71H9Z" fill="currentColor"/><path d="M17 13h46v54H17Zm0 18h46M17 49h46M23 16v12m7-12v12m7-12 5 12m8-12v12M23 35v11m9-11v11m12-11 5 11m7-11v11"/>',
  ],
  [
    'Park bench',
    '<path d="M8 10h63v13H8Zm0 17h63v12H8ZM4 45h72v12H4Zm9 11h9v20h-9Zm45 0h9v20h-9ZM10 38h7v7h-7Zm53 0h7v7h-7Z" fill="currentColor"/><path d="M12 17h55M12 33h55M9 51h62"/>',
  ],
  [
    'Coffee cup',
    '<path d="M10 23h48v8h8a13 13 0 0 1 0 26H55a23 23 0 0 1-45-7Zm48 16v10h8a5 5 0 0 0 0-10Z" fill="currentColor"/><path d="M19 29v19M9 73h58M24 16c-8-6 8-7 0-13m15 13c-8-6 8-7 0-13"/>',
  ],
  [
    'Bubble tea',
    '<path d="M29 5h9l7 20h22l-7 49H20l-7-49h23Z" fill="currentColor"/><path d="M15 25h50M22 34h36"/><circle cx="29" cy="59" r="3"/><circle cx="42" cy="64" r="3"/><circle cx="53" cy="55" r="3"/><circle cx="39" cy="50" r="3"/>',
  ],
  [
    'Filament spool',
    '<circle cx="40" cy="40" r="35" fill="currentColor"/><circle cx="40" cy="40" r="9"/><circle cx="40" cy="40" r="27"/><path d="m31 16 5 15m13-15-5 15m20 9H49M16 40h15m0 24 5-15m13 15-5-15"/>',
  ],
  [
    'Domed pavilion',
    '<path d="M6 39a34 34 0 0 1 68 0ZM10 43h11v25H10Zm24 0h12v25H34Zm25 0h11v25H59ZM5 70h70v8H5Z" fill="currentColor"/><path d="M40 6v29M18 33c2-15 10-25 22-27 12 2 20 12 22 27M9 35h62"/>',
  ],
  [
    'Barrel vault',
    '<path d="M7 72V36a33 33 0 0 1 66 0v36H58V36a18 18 0 0 0-36 0v36Z" fill="currentColor"/><path d="M15 68V36a25 25 0 0 1 50 0v32M40 4v13M17 13l12 14m34-14L51 27"/>',
  ],
  [
    'Cantilever house',
    '<path d="m5 24 43-16 27 15v22L48 58 5 40Zm25 25 18 9v18l-18-9Z" fill="currentColor"/><path d="m5 24 43 19 27-20M48 43v15M13 29v9m9-5v8m9-4v8m25-7v10m9-14v10"/>',
  ],
  [
    'Roof truss',
    '<path d="M3 64 40 10l37 54Z" fill="currentColor"/><path d="M15 57 40 22l25 35Zm25-35v35M15 57l25-16 25 16M27 40l13 17 13-17"/>',
  ],
  [
    'Folded roof pavilion',
    '<path d="m3 29 19-19 19 19 18-19 18 19-18 17-18-17-19 17ZM12 40h7v33h-7Zm49-1h7v34h-7Z" fill="currentColor"/><path d="m9 29 13 10 19-17 18 17 12-10M22 12v23m37-23v23"/>',
  ],
  [
    'Spiral column',
    '<path d="M29 5h22v8H29Zm0 61h22v10H29ZM33 13h14v53H33Z" fill="currentColor"/><path d="m29 19 23 9-24 10 24 10-23 11" stroke="currentColor" stroke-width="10"/><path d="m33 20 13 7m-13 12 13 7m-13 12 13 6"/>',
  ],
  [
    'Arched window',
    '<path d="M9 73V34a31 31 0 0 1 62 0v39Z" fill="currentColor"/><path d="M18 64V34a22 22 0 0 1 44 0v30Zm22-52v52M18 39h44M18 52h44"/>',
  ],
  [
    'Facade screen',
    '<path d="M6 7h68v66H6Z" fill="currentColor"/><path d="M16 15v50m12-50v50m12-50v50m12-50v50m12-50v50M12 29h56M12 51h56"/>',
  ],
  [
    'Cantilever lounge chair',
    '<path d="m12 10 10-3 12 31h33v10H27Zm15 38h10v17h28v10H27Z" fill="currentColor"/><path d="m18 15 12 28h32M32 53v16h28"/>',
  ],
  [
    'Armchair',
    '<path d="M19 10h42v31h13v26H6V41h13ZM12 67h9v9h-9Zm47 0h9v9h-9Z" fill="currentColor"/><path d="M25 17h30v27H25Zm-11 32h52M19 43v17m42-17v17"/>',
  ],
  [
    'Sofa',
    '<path d="M12 20h56v20h10v27H2V40h10ZM8 68h9v8H8Zm55 0h9v8h-9Z" fill="currentColor"/><path d="M20 27h40v22H20Zm20 0v22M10 44v15h60V44M14 53h52"/>',
  ],
  [
    'Desk with drawers',
    '<path d="M4 17h72v10H4Zm4 10h8v48H8Zm40 0h24v48H48Z" fill="currentColor"/><path d="M54 34h12m-12 16h12m-12 16h12M49 43h22M49 59h22"/>',
  ],
  [
    'Pendant light',
    '<path d="M36 3h8v27H36ZM40 27C24 27 10 42 7 59h66C70 42 56 27 40 27Z" fill="currentColor"/><path d="M16 53h48M23 47c3-8 8-13 14-15M34 62v9m12-9v9"/>',
  ],
  [
    'Plant in architectural planter',
    '<path d="M18 49h44l-8 27H26ZM36 22h8v28h-8ZM35 37C11 37 8 19 9 12c21 0 28 8 26 25ZM45 29C45 9 61 3 74 6c-1 19-12 28-29 23Z" fill="currentColor"/><path d="M24 56h32M17 20l16 13m17-10L65 12"/>',
  ],
  [
    'Drafting set square',
    '<path d="M7 5v71h66Zm12 30 28 29H19Z" fill="currentColor" fill-rule="evenodd"/><path d="M13 17h5m-5 10h5m-5 10h5m-5 10h5m-5 10h5M27 70v-5m12 5v-5m12 5v-5"/>',
  ],
  [
    'Site model terraces',
    '<path d="m3 56 35-19 38 19-35 22ZM10 39l28-15 31 15v16L41 70 10 54ZM22 20 39 9l19 11v18L40 49 22 38Z" fill="currentColor"/><path d="m3 56 38 17 35-17M10 39l31 16 28-16M22 20l18 10 18-10M40 30v19M41 55v15"/>',
  ],
];
export function initFooterPlayground() {
  const stage = document.querySelector('.footer-playground');
  if (!stage) return;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let width = 0,
    height = 0,
    items = [],
    frame = 0,
    previous = 0,
    awake = 0,
    visible = false,
    held = null;
  let cursor = null;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function render() {
    for (const p of items)
      p.el.style.transform = `translate3d(${p.x - p.r}px,${p.y - p.r}px,0) rotate(${p.angle}rad)`;
  }
  function step(dt) {
    for (const p of items) {
      if (p === held) continue;
      p.vy += 0.24 * dt;
      p.vx *= Math.pow(0.994, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.spin * dt;
      p.spin *= 0.99;
      if (p.x < p.r || p.x > width - p.r) {
        p.x = clamp(p.x, p.r, width - p.r);
        p.vx *= -0.5;
      }
      if (p.y > height - p.r) {
        p.y = height - p.r;
        p.vy = Math.abs(p.vy) < 0.7 ? 0 : -p.vy * 0.28;
        p.vx *= 0.88;
        p.spin *= 0.8;
      }
      if (p.y < p.r) {
        p.y = p.r;
        p.vy = Math.abs(p.vy);
      }
    }
    for (let pass = 0; pass < 3; pass++)
      for (let i = 0; i < items.length; i++)
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i],
            b = items[j],
            dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.hypot(dx, dy) || 0.01,
            min = (a.r + b.r) * 0.89;
          if (d >= min) continue;
          const nx = dx / d,
            ny = dy / d,
            overlap = min - d,
            am = a === held ? 0 : b === held ? 1 : 0.5,
            bm = b === held ? 0 : a === held ? 1 : 0.5;
          a.x -= nx * overlap * am;
          a.y -= ny * overlap * am;
          b.x += nx * overlap * bm;
          b.y += ny * overlap * bm;
          const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (speed < 0) {
            const impulse = -speed * 0.65;
            if (a !== held) {
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
            }
            if (b !== held) {
              b.vx += impulse * nx;
              b.vy += impulse * ny;
            }
          }
        }
    for (const p of items) {
      p.x = clamp(p.x, p.r, width - p.r);
      p.y = clamp(p.y, p.r, height - p.r);
    }
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - (previous || now)) / 16.667, 1.5);
    previous = now;
    step(dt);
    render();
    if (held || now < awake) frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (reduced.matches) return;
    awake = performance.now() + 6500;
    if (visible && !document.hidden && !frame) {
      previous = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  function settle() {
    for (let i = 0; i < 450; i++) step(1);
    render();
  }
  function reset() {
    for (const [i, p] of items.entries()) {
      const diameter = clamp(width * 0.055, 38, 76),
        columns = Math.max(4, Math.floor(width / (diameter * 1.08))),
        column = i % columns,
        row = Math.floor(i / columns);
      p.x = ((column + 0.5) * width) / columns + (Math.random() - 0.5) * 8;
      p.y = height - p.r - row * diameter * 0.82;
      p.vx = (Math.random() - 0.5) * 3;
      p.vy = 0;
      p.angle = (Math.random() - 0.5) * 1.8;
      p.spin = (Math.random() - 0.5) * 0.02;
    }
    if (reduced.matches) settle();
    else {
      render();
      wake();
    }
  }
  function build() {
    const box = stage.getBoundingClientRect();
    if (!box.width) return;
    if (
      items.length &&
      Math.abs(box.width - width) < 1 &&
      Math.abs(box.height - height) < 1
    )
      return;
    cancelAnimationFrame(frame);
    frame = 0;
    held = null;
    stage.replaceChildren();
    items = [];
    width = box.width;
    height = box.height;
    const diameter = clamp(width * 0.055, 38, 76),
      columns = Math.max(4, Math.floor(width / (diameter * 1.08))),
      rows = width < 700 ? 4 : 5;
    const count = Math.min(300, columns * rows);
    items = Array.from({ length: count }, (_, i) => {
      const [name, art] = motifs[(i * 11) % motifs.length],
        el = document.createElement('button'),
        r = diameter * (0.45 + (i % 4) * 0.035);
      el.type = 'button';
      el.className = 'play-piece';
      el.setAttribute('aria-label', `${name}, draggable piece ${i + 1}`);
      el.innerHTML = `<svg viewBox="0 0 80 80" aria-hidden="true">${art}</svg>`;
      el.style.width = el.style.height = r * 2 + 'px';
      stage.append(el);
      const p = { el, r, x: r, y: r, vx: 0, vy: 0, angle: 0, spin: 0 };
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        held = p;
        p.vx = p.vy = 0;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-held');
        wake();
      });
      el.addEventListener('pointermove', (e) => {
        if (held !== p) return;
        const bounds = stage.getBoundingClientRect(),
          x = clamp(e.clientX - bounds.left, r, width - r),
          y = clamp(e.clientY - bounds.top, r, height - r);
        p.vx = clamp((x - p.x) * 0.5, -14, 14);
        p.vy = clamp((y - p.y) * 0.5, -14, 14);
        p.x = x;
        p.y = y;
        render();
        if (!reduced.matches) wake();
      });
      const release = () => {
        if (held !== p) return;
        held = null;
        el.classList.remove('is-held');
        if (reduced.matches) {
          p.vx = p.vy = 0;
          render();
        } else wake();
      };
      el.addEventListener('lostpointercapture', release);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('keydown', (e) => {
        const directions = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
        };
        const direction = directions[e.key];
        if (!direction) return;
        e.preventDefault();
        p.x = clamp(p.x + direction[0] * 24, r, width - r);
        p.y = clamp(p.y + direction[1] * 24, r, height - r);
        p.vx = direction[0] * 4;
        p.vy = direction[1] * 4;
        render();
        if (!reduced.matches) wake();
      });
      return p;
    });
    reset();
  }
  stage.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch' || reduced.matches || held) return;
      const bounds = stage.getBoundingClientRect(),
        x = e.clientX - bounds.left,
        y = e.clientY - bounds.top;
      const speed = cursor
        ? Math.min(18, Math.hypot(x - cursor.x, y - cursor.y))
        : 3;
      cursor = { x, y };
      let touched = false;
      for (const p of items) {
        const dx = p.x - x,
          dy = p.y - y,
          d = Math.hypot(dx, dy),
          reach = p.r + 65;
        if (d >= reach) continue;
        const force = (1 - d / reach) * (1 + speed * 0.55),
          nx = dx / Math.max(d, 1);
        p.vx = clamp(p.vx + nx * force * 1.6, -15, 15);
        p.vy = clamp(p.vy - force * 1.8, -13, 10);
        p.spin = clamp(p.spin + nx * force * 0.007, -0.09, 0.09);
        touched = true;
      }
      if (touched) wake();
    },
    { passive: true }
  );
  stage.addEventListener('pointerleave', () => {
    cursor = null;
  });
  new ResizeObserver(build).observe(stage);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !reduced.matches) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: '100px' }
  ).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (!reduced.matches) wake();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
    } else wake();
  });
  build();
}
