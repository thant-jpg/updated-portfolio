// Draw in CSS pixels so ruler marks stay evenly spaced on documents of any length.
export function initDocumentRulers() {
  const namespace = 'http://www.w3.org/2000/svg';
  const node = (tag, attributes = {}) => {
    const element = document.createElementNS(namespace, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    return element;
  };
  for (const pasteboard of document.querySelectorAll('.document-pasteboard')) {
    const ruler = direction => {
      let element = pasteboard.querySelector(`:scope > .page-ruler-${direction}`);
      if (!element) {
        element = document.createElement('div');
        element.className = `page-ruler page-ruler-${direction}`;
        element.setAttribute('aria-hidden', 'true');
        pasteboard.prepend(element);
      }
      return element;
    };
    const side = ruler('side'), top = ruler('top');
    let previous = '';
    function draw() {
      const height = Math.round(side.clientHeight), width = Math.round(top.clientWidth);
      const dimensions = `${width}:${height}`;
      if (!height || !width || dimensions === previous) return;
      previous = dimensions;
      for (const [element, length, vertical] of [[side, height, true], [top, width, false]]) {
        const svg = node('svg', {viewBox: vertical ? `0 0 32 ${length}` : `0 0 ${length} 24`});
        const paths = [];
        for (let position = 0; position <= length; position += 20) {
          const major = position % 100 === 0, tick = major ? 12 : 5;
          paths.push(vertical ? `M32 ${position}h-${tick}` : `M${position} 24v-${tick}`);
          if (major) {
            const label = node('text', vertical
              ? {x: 12, y: position + 5, transform: `rotate(-90 12 ${position + 5})`, 'text-anchor': 'end'}
              : {x: position + 4, y: 9});
            label.textContent = position;
            svg.append(label);
          }
        }
        svg.prepend(node('path', {d: paths.join(' ')}));
        element.replaceChildren(svg);
      }
    }
    new ResizeObserver(draw).observe(pasteboard);
    draw();
  }
}
