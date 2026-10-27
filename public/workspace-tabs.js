// Keep open document order across page navigations in this browser session.
export function initWorkspaceTabs() {
  const bar = document.querySelector('.document-tabs');
  if (!bar) return;
  const catalog = new Map(JSON.parse(bar.dataset.tabCatalog));
  const current = location.pathname.replace(/\/?$/, '/');
  const storageKey = 'portfolio-open-tabs-v1';
  let paths = ['/', '/work/', '/about/', '/resume/'];
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (Array.isArray(saved)) paths = saved;
  } catch {}
  paths = [...new Set(paths.filter(path => catalog.has(path)))];
  if (!paths.includes('/')) paths.unshift('/');
  if (catalog.has(current) && !paths.includes(current)) paths.push(current);
  const save = () => { try { sessionStorage.setItem(storageKey, JSON.stringify(paths)); } catch {} };
  let dragging = null;
  function move(source, target) {
    if (!source || source === target) return;
    const from = paths.indexOf(source), to = paths.indexOf(target);
    if (from < 0 || to < 0) return;
    paths.splice(from, 1);
    paths.splice(to, 0, source);
    save();
    render();
    bar.querySelector(`[data-path="${source}"] a`)?.focus();
  }
  function render() {
    bar.replaceChildren();
    for (const path of paths) {
      const label = catalog.get(path);
      const tab = document.createElement('div');
      tab.className = 'workspace-tab' + (path === current ? ' is-active' : '');
      tab.dataset.path = path;
      tab.draggable = true;
      const link = document.createElement('a');
      link.className = 'document-tab';
      link.href = path;
      link.title = `${label} — drag to reorder, or use Alt + Left/Right`;
      if (path === current) link.setAttribute('aria-current', 'page');
      const icon = document.createElement('span');
      icon.className = 'document-tab-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '▤';
      const text = document.createElement('span');
      text.className = 'document-tab-label';
      text.textContent = label + '.indd';
      link.append(icon, text);
      link.addEventListener('keydown', event => {
        if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const neighbor = paths[paths.indexOf(path) + (event.key === 'ArrowLeft' ? -1 : 1)];
        if (neighbor) move(path, neighbor);
      });
      tab.append(link);
      if (path !== '/') {
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'tab-close';
        close.textContent = '×';
        close.setAttribute('aria-label', `Close ${label} tab`);
        close.title = `Close ${label}`;
        close.addEventListener('click', () => {
          const index = paths.indexOf(path);
          paths.splice(index, 1);
          save();
          if (path === current) location.assign(paths[Math.min(index, paths.length - 1)]);
          else {
            render();
            bar.querySelector(`[data-path="${current}"] a`)?.focus();
          }
        });
        tab.append(close);
      }
      tab.addEventListener('dragstart', event => {
        if (event.target.closest('button')) { event.preventDefault(); return; }
        dragging = path;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', path);
        tab.classList.add('is-dragging');
      });
      tab.addEventListener('dragover', event => {
        if (!dragging || dragging === path) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        tab.classList.add('drag-target');
      });
      tab.addEventListener('dragleave', () => tab.classList.remove('drag-target'));
      tab.addEventListener('drop', event => {
        event.preventDefault();
        move(dragging, path);
        dragging = null;
      });
      tab.addEventListener('dragend', () => {
        dragging = null;
        bar.querySelectorAll('.is-dragging,.drag-target').forEach(node => node.classList.remove('is-dragging', 'drag-target'));
      });
      bar.append(tab);
    }
  }
  save();
  render();
  bar.querySelector('[aria-current="page"]')?.scrollIntoView({block: 'nearest', inline: 'nearest'});
}
