import { state } from './state.js';
import { getFavicon } from './icons.js';
import { hideTooltip } from './tooltip.js';
import { saveSectionOrder } from './tree.js';

// render() wird von init.js übergeben (vermeidet zirkulären Import)
let render = () => {};
export function initDrag({ render: renderFn }) { render = renderFn; }
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
export function attachSectionDrag(secEl, header, sec) {
  header.setAttribute('draggable', 'true');

  header.addEventListener('dragstart', e => {
    if (state.drag.itemId) return;
    state.drag.secId = sec.id;
    secEl.classList.add('dragging-sec');
    e.dataTransfer.effectAllowed = 'move';
  });
  header.addEventListener('dragend', () => {
    state.drag.secId = null;
    document.querySelectorAll('.section').forEach(el =>
      el.classList.remove('dragging-sec', 'sec-drop-above', 'sec-drop-below')
    );
  });

  secEl.addEventListener('dragover', e => {
    if (!state.drag.secId || state.drag.secId === sec.id) return;
    e.preventDefault();
    document.querySelectorAll('.section').forEach(el =>
      el.classList.remove('sec-drop-above', 'sec-drop-below')
    );
    const r = secEl.getBoundingClientRect();
    secEl.classList.add(e.clientY < r.top + r.height / 2 ? 'sec-drop-above' : 'sec-drop-below');
  });
  secEl.addEventListener('dragleave', e => {
    if (!secEl.contains(e.relatedTarget))
      secEl.classList.remove('sec-drop-above', 'sec-drop-below');
  });
  secEl.addEventListener('drop', e => {
    if (!state.drag.secId || state.drag.secId === sec.id) return;
    e.preventDefault();
    secEl.classList.remove('sec-drop-above', 'sec-drop-below');
    const fromIdx = state.sections.findIndex(s => s.id === state.drag.secId);
    const r = secEl.getBoundingClientRect();
    const insertBefore = e.clientY < r.top + r.height / 2;
    const [moved] = state.sections.splice(fromIdx, 1);
    const newIdx = state.sections.findIndex(s => s.id === sec.id);
    state.sections.splice(insertBefore ? newIdx : newIdx + 1, 0, moved);
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
