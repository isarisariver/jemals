import { state } from './state.js';
import { getFavicon } from './icons.js';
import { hideTooltip } from './tooltip.js';
import { saveSectionOrder } from './tree.js';

// render() wird von init.js übergeben (vermeidet zirkulären Import)
let render = () => {};
export function initDrag({ render: renderFn }) {
  render = renderFn;
  initSectionDrop();
}
const rerender = () => render(state.currentFilter);

// ─── Drag Ghost ───────────────────────────────────────────
const dragGhost = document.createElement('div');
dragGhost.id = 'drag-ghost';
dragGhost.innerHTML = '<img id="ghost-img"><span id="ghost-label"></span>';
document.body.appendChild(dragGhost);

function showGhost(bm, e) {
  document.getElementById('ghost-img').src = getFavicon(bm.url);
  document.getElementById('ghost-label').textContent = bm.label;
  dragGhost.style.display = 'flex';
  moveGhost(e);
}
function moveGhost(e) {
  dragGhost.style.left = (e.clientX + 16) + 'px';
  dragGhost.style.top  = (e.clientY + 16) + 'px';
}
function hideGhost() { dragGhost.style.display = 'none'; }

// ─── Helpers ──────────────────────────────────────────────
function clearIndicators() {
  document.querySelectorAll('.drop-before,.drop-after,.drop-active,.drag-over')
    .forEach(el => el.classList.remove('drop-before','drop-after','drop-active','drag-over'));
}

function getDropTarget(grid, x, y) {
  for (const el of [...grid.querySelectorAll('.item:not(.dragging)')]) {
    const r = el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
      return { el, side: x < r.left + r.width / 2 ? 'before' : 'after' };
  }
  return null;
}

// Nimmt das gezogene Bookmark aus seiner aktuellen Sektion und gibt es zurück.
function takeDraggedBookmark() {
  for (const s of state.sections) {
    const idx = s.bookmarks.findIndex(b => b.id === state.drag.itemId);
    if (idx !== -1) return s.bookmarks.splice(idx, 1)[0];
  }
  return null;
}

// ─── Sektionen umsortieren (Drag am Header) ───────────────
// Transparentes 1x1-GIF, vorgeladen, als unsichtbares natives Drag-Bild
const blankDragImg = new Image();
blankDragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Ghost, der dem Mauszeiger folgt
const secGhost = document.createElement('div');
secGhost.id = 'sec-ghost';
document.body.appendChild(secGhost);

// Einfügelinie in der Lücke zwischen den Ordnern
const secDropLine = document.createElement('div');
secDropLine.id = 'sec-drop-line';
document.body.appendChild(secDropLine);

function moveSecGhost(e) {
  // Drag-Events können ohne gültige Position (0/0) kommen: ignorieren, sonst
  // erscheint der Ghost kurz in der Ecke und springt dann zum Zeiger.
  if (e.clientX === 0 && e.clientY === 0) return;
  secGhost.style.left = (e.clientX + 16) + 'px';
  secGhost.style.top  = (e.clientY + 16) + 'px';
  secGhost.style.display = 'flex'; // erst jetzt sichtbar
}

function showSecGhost(sec, e) {
  secGhost.style.borderLeftColor = sec.color;
  const title = document.createElement('span');
  title.className = 'sec-ghost-title';
  title.textContent = sec.title;
  const count = document.createElement('span');
  count.className = 'sec-ghost-count';
  count.textContent = sec.bookmarks.length;
  secGhost.replaceChildren(title, count);
  secGhost.style.display = 'none';
  moveSecGhost(e); // zeigt den Ghost nur bei gültiger Position
  // Position auch über Lücken und anderen Elementen nachführen
  document.addEventListener('dragover', moveSecGhost, true);
}

function hideSecDrag() {
  secGhost.style.display = 'none';
  secDropLine.style.display = 'none';
  document.removeEventListener('dragover', moveSecGhost, true);
}

// Einfügeposition anhand der Mausposition: vor dem ersten Ordner, dessen Mitte
// unter dem Zeiger liegt, sonst hinter den letzten. Funktioniert auch in den Lücken.
function getSectionInsertion(container, y) {
  const secs = [...container.querySelectorAll('.section[data-sec-id]')]
    .filter(el => el.dataset.secId !== state.drag.secId);
  for (const el of secs) {
    const r = el.getBoundingClientRect();
    if (y < r.top + r.height / 2) return { el, before: true };
  }
  const last = secs[secs.length - 1];
  return last ? { el: last, before: false } : null;
}

function showDropLine({ el, before }) {
  const r = el.getBoundingClientRect();
  const y = before ? r.top - 8 : r.bottom + 8; // Mitte der 1rem-Lücke
  Object.assign(secDropLine.style, {
    display: 'block',
    left: r.left + 'px',
    width: r.width + 'px',
    top: (y - 2) + 'px'
  });
}

// Pro Ordner: nur das Ziehen am Header. Das Ablegen übernimmt initSectionDrop().
export function attachSectionDrag(secEl, header, sec) {
  header.setAttribute('draggable', 'true');

  header.addEventListener('dragstart', e => {
    if (state.drag.itemId) return;
    state.drag.secId = sec.id;
    secEl.classList.add('dragging-sec');
    e.dataTransfer.effectAllowed = 'move';
    // Unsichtbares natives Bild, wir zeigen unseren eigenen Ghost
    e.dataTransfer.setDragImage(blankDragImg, 0, 0);
    showSecGhost(sec, e);
  });

  header.addEventListener('dragend', () => {
    state.drag.secId = null;
    hideSecDrag();
    document.querySelectorAll('.section.dragging-sec')
      .forEach(el => el.classList.remove('dragging-sec'));
  });
}

// Einmalig am Container (überlebt jedes render())
function initSectionDrop() {
  const container = document.getElementById('dashboard');

  container.addEventListener('dragover', e => {
    if (!state.drag.secId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = getSectionInsertion(container, e.clientY);
    if (target) showDropLine(target); else secDropLine.style.display = 'none';
  });

  container.addEventListener('dragleave', e => {
    if (!container.contains(e.relatedTarget)) secDropLine.style.display = 'none';
  });

  container.addEventListener('drop', e => {
    if (!state.drag.secId) return;
    e.preventDefault();
    const target = getSectionInsertion(container, e.clientY);
    const movedId = state.drag.secId;
    state.drag.secId = null;
    hideSecDrag();
    if (!target) return;

    const fromIdx = state.sections.findIndex(s => s.id === movedId);
    if (fromIdx === -1) return;
    const [moved] = state.sections.splice(fromIdx, 1);
    const targetIdx = state.sections.findIndex(s => s.id === target.el.dataset.secId);
    state.sections.splice(target.before ? targetIdx : targetIdx + 1, 0, moved);
    saveSectionOrder();
    rerender();
  });
}

// ─── Bookmark auf (zugeklappten) Header ziehen ────────────
export function attachHeaderDrop(header, sec) {
  header.addEventListener('dragover', e => {
    if (state.drag.secId || !state.drag.itemId) return;
    e.preventDefault();
    header.classList.add('drag-over-bm');
  });
  header.addEventListener('dragleave', e => {
    if (!header.contains(e.relatedTarget)) header.classList.remove('drag-over-bm');
  });
  header.addEventListener('drop', e => {
    if (state.drag.secId || !state.drag.itemId) return;
    e.preventDefault();
    header.classList.remove('drag-over-bm');
    const bm = takeDraggedBookmark();
    if (!bm) return;
    sec.bookmarks.push(bm);
    chrome.bookmarks.move(bm.id, { parentId: sec.id, index: sec.bookmarks.length - 1 });
    rerender();
  });
}

// ─── Einzelnes Bookmark ziehen ────────────────────────────
export function attachItemDrag(item, bm) {
  item.addEventListener('dragstart', e => {
    hideTooltip();
    state.drag.itemId = bm.id;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Unsichtbares natives Ghost-Bild
    const blank = document.createElement('canvas');
    blank.width = 1; blank.height = 1;
    e.dataTransfer.setDragImage(blank, 0, 0);
    showGhost(bm, e);
  });
  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    clearIndicators();
    state.drag.itemId = null;
    hideGhost();
  });
}

// ─── Bookmark in Grid ablegen ─────────────────────────────
export function attachGridDrop(grid, sec) {
  grid.addEventListener('dragover', e => {
    if (state.drag.secId) return;
    e.preventDefault();
    clearIndicators();
    grid.classList.add('drop-active');
    const hit = getDropTarget(grid, e.clientX, e.clientY);
    if (hit) hit.el.classList.add(hit.side === 'before' ? 'drop-before' : 'drop-after');
    moveGhost(e);
  });
  grid.addEventListener('dragleave', e => {
    if (!grid.contains(e.relatedTarget)) grid.classList.remove('drop-active');
  });
  grid.addEventListener('drop', e => {
    if (state.drag.secId) return;
    e.preventDefault();
    clearIndicators();
    const bm = takeDraggedBookmark();
    if (!bm) return;

    const hit = getDropTarget(grid, e.clientX, e.clientY);
    if (hit) {
      const targetIdx = sec.bookmarks.findIndex(b => b.id === hit.el.dataset.bmId);
      sec.bookmarks.splice(hit.side === 'before' ? targetIdx : targetIdx + 1, 0, bm);
    } else {
      sec.bookmarks.push(bm);
    }
    const newIndex = sec.bookmarks.findIndex(b => b.id === bm.id);

    // Echte Chrome-Kinder abfragen, weil ausgeblendete Unterordner die
    // Chrome-Indizes gegenüber unserem Array verschieben.
    const targetBmId = newIndex < sec.bookmarks.length - 1
      ? sec.bookmarks[newIndex + 1]?.id // Bookmark, das nach uns kommen soll
      : null;
    chrome.bookmarks.getChildren(sec.id, children => {
      let chromeIndex;
      if (targetBmId) {
        const afterIdx = children.findIndex(c => c.id === targetBmId);
        chromeIndex = afterIdx !== -1 ? afterIdx : newIndex;
      } else {
        // Ans Ende: Chrome-Index des letzten sichtbaren Bookmarks + 1
        const lastBmId = sec.bookmarks[sec.bookmarks.length - 2]?.id;
        const lastIdx = lastBmId ? children.findIndex(c => c.id === lastBmId) : -1;
        chromeIndex = lastIdx !== -1 ? lastIdx + 1 : children.length;
      }
      chrome.bookmarks.move(bm.id, { parentId: sec.id, index: chromeIndex });
    });
    rerender();
  });
}
