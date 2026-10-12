import { state } from './state.js';
import { render } from './render.js';
import { showModal, hideModal } from './modal.js';
import { hideCtxMenu } from './context-menu.js';
import { COLORS } from './tree.js';
// t() und currentLang kommen global aus i18n.js

// ─── Uhr ──────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const use24h = !document.getElementById('toggle-12h').classList.contains('active');
  el.textContent = new Date().toLocaleTimeString(
    currentLang,
    { hour: '2-digit', minute: '2-digit', hour12: !use24h }
  );
}
setInterval(updateClock, 1000);
updateClock();

// ─── Suche ────────────────────────────────────────────────
const search = document.getElementById('search');
search.addEventListener('input', e => {
  render(e.target.value.trim() || null);
});

// ─── Neuer Ordner ─────────────────────────────────────────
document.getElementById('btn-new-folder').addEventListener('click', () => {
  showModal(t('modal_new_folder'), [
    { label: t('field_name'), id: 'inp-title', value: '' }
  ], () => {
    const title = document.getElementById('inp-title').value.trim();
    if (!title) return;
    chrome.bookmarks.create({ parentId: '2', title }, node => {
      state.sections.push({
        id: node.id,
        title: node.title,
        color: COLORS[state.sections.length % COLORS.length],
        collapsed: true,
        bookmarks: []
      });
      render(state.currentFilter);
    });
  });
});

// ─── Help Modal ───────────────────────────────────────────
const helpOverlay = document.getElementById('help-overlay');
document.getElementById('btn-help').addEventListener('click', () => helpOverlay.classList.add('visible'));
document.getElementById('help-close').addEventListener('click', () => helpOverlay.classList.remove('visible'));
helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.remove('visible'); });

// ─── Keyboard Shortcuts ───────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    helpOverlay.classList.remove('visible');
    hideCtxMenu();
    hideModal();
    if (search.value) { search.value = ''; render(null); }
  }
  if (e.key === '/' && document.activeElement !== search) {
    e.preventDefault();
    search.focus();
  }
});
