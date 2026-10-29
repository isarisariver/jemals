import { state } from './state.js';
import { showCtxMenu } from './context-menu.js';
import { setFaviconWithFallback } from './icons.js';
import { showTooltip, hideTooltip, positionTooltip } from './tooltip.js';
import { openUrl } from './open.js';
import { sectionLabel } from './tree.js';
import { attachSectionDrag, attachHeaderDrop, attachItemDrag, attachGridDrop } from './drag.js';
// t() kommt global aus i18n.js

// ─── Accordion ────────────────────────────────────────────
function animateGrid(secEl, open) {
  const grid = secEl.querySelector('.section-grid');
  if (!grid) return;
  const animated = document.getElementById('toggle-animations').checked;
  if (!animated) {
    grid.style.transition = 'none';
    grid.style.height = open ? 'auto' : '0';
    grid.style.opacity = open ? '1' : '0';
    grid.style.paddingTop = open ? '12px' : '0';
    grid.style.paddingBottom = open ? '12px' : '0';
    return;
  }
  if (open) {
    // Zielhöhe messen: natürliche Höhe inkl. Padding (border-box)
    grid.style.transition = 'none';
    grid.style.paddingTop = '';
    grid.style.paddingBottom = '';
    grid.style.height = 'auto';
    const targetHeight = grid.offsetHeight;
    // Startzustand: zugeklappt
    grid.style.height = '0';
    grid.style.opacity = '0';
    grid.style.paddingTop = '0';
    grid.style.paddingBottom = '0';
    grid.offsetHeight; // Force reflow
    grid.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
    grid.style.height = targetHeight + 'px';
    grid.style.paddingTop = '';
    grid.style.paddingBottom = '';
    grid.style.opacity = '1';
    grid.addEventListener('transitionend', e => {
      if (e.propertyName !== 'height') return;
      grid.style.height = 'auto';
    }, { once: true });
  } else {
    grid.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
    grid.style.height = grid.scrollHeight + 'px';
    grid.offsetHeight; // Force reflow
    requestAnimationFrame(() => {
      grid.style.height = '0';
      grid.style.opacity = '0';
      grid.style.paddingTop = '0';
      grid.style.paddingBottom = '0';
    });
  }
}

function openSection(secId) {
  state.sections.forEach(s => { s.collapsed = s.id !== secId; });
  document.querySelectorAll('.section[data-sec-id]').forEach(el => {
    if (el.dataset.secId === secId) {
      el.classList.remove('collapsed');
      animateGrid(el, true);
    } else {
      el.classList.add('collapsed');
      animateGrid(el, false);
    }
  });
}

// ─── Render ───────────────────────────────────────────────
function buildHeader(sec, secEl) {
  const header = document.createElement('div');
  header.className = 'section-header';
  header.style.borderLeft = `3px solid ${sec.color}`;

  const title = document.createElement('span');
  title.className = 'section-title';
  title.textContent = sectionLabel(sec);

  const count = document.createElement('span');
  count.className = 'section-count';
  count.textContent = sec.bookmarks.length;

  const toggle = document.createElement('span');
  toggle.className = 'toggle';
  toggle.textContent = '▼';

  header.append(title, count, toggle);

  header.addEventListener('click', () => {
    if (state.drag.secId) return;
    if (sec.collapsed) {
      openSection(sec.id);
    } else {
      sec.collapsed = true;
      secEl.classList.add('collapsed');
      animateGrid(secEl, false);
    }
  });

  header.addEventListener('contextmenu', e => {
    showCtxMenu(e, { type: 'folder', secId: sec.id });
  });

  attachSectionDrag(secEl, header, sec);
  attachHeaderDrop(header, sec);
  return header;
}

// fromRecent = Eintrag aus dem Verlauf: ziehbar (wird beim Ablegen zum Lesezeichen), aber kein Kontextmenü
function buildItem(bm, sec, fromRecent = false) {
  const item = document.createElement('div');
  item.className = 'item';
  item.setAttribute('draggable', 'true');
  item.dataset.bmId = bm.id;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'item-icon';
  const img = document.createElement('img');
  iconWrap.appendChild(img);
  setFaviconWithFallback(img, bm.url, bm.id);

  const lbl = document.createElement('div');
  lbl.className = 'item-label';
  lbl.textContent = bm.label;

  item.append(iconWrap, lbl);

  item.addEventListener('mouseenter', e => showTooltip(bm, e));
  item.addEventListener('mousemove', e => positionTooltip(e));
  item.addEventListener('mouseleave', () => hideTooltip());

  // Klick nur, wenn es kein Drag war
  let clickStart = 0, startX = 0, startY = 0;
  item.addEventListener('mousedown', e => { clickStart = Date.now(); startX = e.clientX; startY = e.clientY; });
  item.addEventListener('click', e => {
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5 || Date.now() - clickStart > 300) return;
    openUrl(bm.url, { newTab: state.openInNewTab });
  });

  if (!fromRecent) {
    item.addEventListener('contextmenu', e => {
      hideTooltip();
      showCtxMenu(e, { type: 'bookmark', secId: sec.id, bmId: bm.id });
    });
  }

  attachItemDrag(item, bm);
  return item;
}

function buildGrid(sec, filtered) {
  const grid = document.createElement('div');
  grid.className = 'section-grid';

  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'empty-msg';
    msg.textContent = t('empty_folder');
    grid.appendChild(msg);
  } else {
    filtered.forEach(bm => grid.appendChild(buildItem(bm, sec)));
  }

  attachGridDrop(grid, sec);

  // Initiale Höhe setzen ohne Animation
  if (sec.collapsed) {
    grid.style.height = '0';
    grid.style.opacity = '0';
    // Nur oben/unten, nie die Kurzform `padding`: sonst bleibt links/rechts
    // dauerhaft 0 und das Grid hat nach dem Aufklappen eine andere Breite.
    grid.style.paddingTop = '0';
    grid.style.paddingBottom = '0';
  }
  return grid;
}

// ─── Zuletzt besucht ──────────────────────────────────────
function buildRecentSection(term) {
  const items = term
    ? state.recent.filter(b => b.label.toLowerCase().includes(term) || b.url.toLowerCase().includes(term))
    : state.recent;
  if (items.length === 0) return null;

  const secEl = document.createElement('div');
  secEl.className = 'section recent-section'; // bewusst ohne data-sec-id: nicht Teil des Accordions

  const header = document.createElement('div');
  header.className = 'section-header';
  header.style.borderLeft = '3px solid #7f8c8d';
  header.style.cursor = 'default';
  const title = document.createElement('span');
  title.className = 'section-title';
  title.textContent = t('st_recently_visited');
  header.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'section-grid';
  items.forEach(bm => grid.appendChild(buildItem(bm, null, true)));

  secEl.append(header, grid);
  return secEl;
}

function render(filter = null) {
  state.currentFilter = filter;
  const container = document.getElementById('dashboard');
  container.innerHTML = '';
  const term = filter ? filter.toLowerCase() : null;

  if (state.showRecent) {
    const recentEl = buildRecentSection(term);
    if (recentEl) container.appendChild(recentEl);
  }

  state.sections.forEach(sec => {
    if (state.hiddenFolders.includes(sec.id)) return;
    const filtered = term
      ? sec.bookmarks.filter(b => b.label.toLowerCase().includes(term) || b.url.toLowerCase().includes(term))
      : sec.bookmarks;

    if (term && filtered.length === 0) return;

    const secEl = document.createElement('div');
    secEl.className = 'section' + (sec.collapsed ? ' collapsed' : '');
    secEl.dataset.secId = sec.id;

    secEl.appendChild(buildHeader(sec, secEl));
    secEl.appendChild(buildGrid(sec, filtered));
    container.appendChild(secEl);
  });
}

export { render };
