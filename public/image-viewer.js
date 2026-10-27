export function initImageViewer() {
  const links = [...document.querySelectorAll('.project-document a[href]')]
    .filter(link => link.querySelector('img') && /\.(?:webp|png|jpe?g|gif|svg)(?:[?#]|$)/i.test(link.href));
  // Future artwork in the unfilled project layouts gets the same interaction.
  for (const image of document.querySelectorAll('.project-document .layout-image.has-artwork > img')) {
    const link = document.createElement('a');
    link.href = image.currentSrc || image.src;
    link.className = 'layout-image-link';
    image.replaceWith(link);
    link.append(image);
    links.push(link);
  }
  if (!links.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Enlarged project image');
  dialog.innerHTML = `<div class="image-viewer-bar"><p class="image-viewer-caption" aria-live="polite"></p><button class="image-viewer-close" type="button" autofocus aria-label="Close enlarged image">Close ×</button></div><figure class="image-viewer-art"><img alt="" decoding="async"></figure><div class="image-viewer-navigation"><button type="button" class="image-viewer-previous" aria-label="Previous image">← Previous</button><span class="image-viewer-count"></span><button type="button" class="image-viewer-next" aria-label="Next image">Next →</button></div>`;
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.image-viewer-caption');
  const count = dialog.querySelector('.image-viewer-count');
  const previous = dialog.querySelector('.image-viewer-previous');
  const next = dialog.querySelector('.image-viewer-next');
  let index = 0, opener;

  function display(value) {
    index = Math.max(0, Math.min(links.length - 1, value));
    const link = links[index];
    const original = link.querySelector('img');
    image.alt = original.alt;
    image.src = link.href;
    const figure=link.closest('figure');
    caption.textContent = (figure?.querySelector('.figure-caption') || figure?.querySelector('figcaption'))?.textContent.trim() || original.alt;
    count.textContent = `${index + 1} / ${links.length}`;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }
  for (const [position, link] of links.entries()) {
    link.removeAttribute('target');
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', `Enlarge ${link.querySelector('img').alt}`);
    link.addEventListener('click', event => {
      // Preserve deliberate browser shortcuts such as Ctrl-click.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      display(position);
      document.documentElement.classList.add('image-viewer-open');
      dialog.showModal();
    });
  }
  dialog.querySelector('.image-viewer-close').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => display(index - 1));
  next.addEventListener('click', () => display(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-viewer-open');
    opener?.focus({preventScroll: true});
  });
}
