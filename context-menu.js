import { state } from './state.js';
import { showModal, showConfirm } from './modal.js';
import { openUrl } from './open.js';
import { sectionLabel, removeSectionTree } from './tree.js';
// t() kommt global aus i18n.js (klassisches Script)

// ─── Kontextmenü ──────────────────────────────────────────
const ctxMenu = document.getElementById('ctx-menu');
const ctxRename = document.getElementById('ctx-rename');
const ctxEditUrl = document.getElementById('ctx-edit-url');
const ctxDelete = document.getElementById('ctx-delete');
const ctxChangeIcon = document.getElementById('ctx-change-icon');
const ctxResetIcon = document.getElementById('ctx-reset-icon');
const ctxOpenAll = document.getElementById('ctx-open-all');
const ctxSort = document.getElementById('ctx-sort');
const ctxColor = document.getElementById('ctx-color');

let ctxTarget = null;
let render = () => {};

// newtab.js übergibt render(), damit kein zirkulärer Import entsteht.
function initContextMenu({ render: renderFn }) {
  render = renderFn;
}

const rerender = () => render(state.currentFilter);
const findSection = id => state.sections.find(s => s.id === id);
const findBookmark = (sec, id) => sec?.bookmarks.find(b => b.id === id);
const saveIcons = () => chrome.storage.local.set({ customIcons: state.customIcons });
const saveColors = () => chrome.storage.local.set({ customColors: state.customColors });

function showCtxMenu(e, target) {
  e.preventDefault();
  ctxTarget = target;
  const isBm = target.type === 'bookmark';
  ctxEditUrl.style.display = isBm ? 'block' : 'none';
  ctxChangeIcon.style.display = isBm ? 'block' : 'none';
  ctxResetIcon.style.display = isBm && state.customIcons[target.bmId] ? 'block' : 'none';
  ctxOpenAll.style.display = !isBm ? 'block' : 'none';
  ctxSort.style.display = !isBm ? 'block' : 'none';
  ctxColor.style.display = !isBm ? 'block' : 'none';
  ctxDelete.textContent = isBm ? t('ctx_delete_bookmark') : t('ctx_delete_folder');
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 180) + 'px';
  ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 120) + 'px';
  ctxMenu.classList.add('visible');
}

function hideCtxMenu() { ctxMenu.classList.remove('visible'); }

document.addEventListener('click', hideCtxMenu);

// ─── Umbenennen ───────────────────────────────────────────
ctxRename.addEventListener('click', () => {
  if (!ctxTarget) return;
  const sec = findSection(ctxTarget.secId);
  if (!sec) return;

  if (ctxTarget.type === 'folder') {
    showModal(t('modal_rename_folder'), [
      { label: t('field_name'), id: 'inp-title', value: sec.title }
    ], () => {
      const newTitle = document.getElementById('inp-title').value.trim();
      if (!newTitle) return;
      chrome.bookmarks.update(sec.id, { title: newTitle }, () => {
        sec.title = newTitle;
        rerender();
      });
    });
  } else {
    const bm = findBookmark(sec, ctxTarget.bmId);
    if (!bm) return;
    showModal(t('modal_rename_bookmark'), [
      { label: t('field_name'), id: 'inp-title', value: bm.label }
    ], () => {
      const newTitle = document.getElementById('inp-title').value.trim();
      if (!newTitle) return;
      chrome.bookmarks.update(bm.id, { title: newTitle }, () => {
        bm.label = newTitle;
        rerender();
      });
    });
  }
});

// ─── Icon ändern / zurücksetzen ───────────────────────────
ctxChangeIcon.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'bookmark') return;
  const bmId = ctxTarget.bmId; // lokal merken, ctxTarget kann sich ändern
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        canvas.getContext('2d').drawImage(img, 0, 0, 64, 64);
        state.customIcons[bmId] = canvas.toDataURL('image/png');
        saveIcons();
        rerender();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  input.click();
});

ctxResetIcon.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'bookmark') return;
  delete state.customIcons[ctxTarget.bmId];
  saveIcons();
  rerender();
});

// ─── URL ändern ───────────────────────────────────────────
ctxEditUrl.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'bookmark') return;
  const sec = findSection(ctxTarget.secId);
  const bm = findBookmark(sec, ctxTarget.bmId);
  if (!bm) return;
  showModal(t('modal_edit_url'), [
    { label: t('field_name'), id: 'inp-title', value: bm.label },
    { label: t('field_url'), id: 'inp-url', value: bm.url }
  ], () => {
    const newTitle = document.getElementById('inp-title').value.trim();
    const newUrl = document.getElementById('inp-url').value.trim();
    if (!newUrl) return;
    chrome.bookmarks.update(bm.id, { title: newTitle || bm.label, url: newUrl }, () => {
      bm.label = newTitle || bm.label;
      bm.url = newUrl;
      rerender();
    });
  });
});

// ─── Löschen ──────────────────────────────────────────────
ctxDelete.addEventListener('click', () => {
  if (!ctxTarget) return;
  const sec = findSection(ctxTarget.secId);
  if (!sec) return;

  if (ctxTarget.type === 'folder') {
    showConfirm(
      t('modal_delete_folder_title', sectionLabel(sec)),
      t('modal_delete_folder_msg', sec.bookmarks.length),
      () => {
        chrome.bookmarks.removeTree(sec.id, () => {
          removeSectionTree(sec.id); // inkl. Unterordner
          rerender();
        });
      }
    );
  } else {
    const bm = findBookmark(sec, ctxTarget.bmId);
    if (!bm) return;
    showConfirm(t('modal_delete_bookmark_title', bm.label), '', () => {
      chrome.bookmarks.remove(bm.id, () => {
        sec.bookmarks = sec.bookmarks.filter(b => b.id !== bm.id);
        rerender();
      });
    });
  }
});

// ─── Alle öffnen ──────────────────────────────────────────
ctxOpenAll.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'folder') return;
  const sec = findSection(ctxTarget.secId);
  if (!sec) return;
  sec.bookmarks.forEach(bm => openUrl(bm.url, { newTab: true }));
});

// ─── Ordner-Farbe ändern ──────────────────────────────────
ctxColor.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'folder') return;
  const sec = findSection(ctxTarget.secId);
  if (!sec) return;
  const input = document.createElement('input');
  input.type = 'color';
  input.value = sec.color;
  input.addEventListener('input', () => {
    sec.color = input.value;
    state.customColors[sec.id] = input.value;
    saveColors();
    rerender();
  });
  input.click();
});

// ─── Alphabetisch sortieren ───────────────────────────────
ctxSort.addEventListener('click', () => {
  if (!ctxTarget || ctxTarget.type !== 'folder') return;
  const sec = findSection(ctxTarget.secId);
  if (!sec) return;
  sec.bookmarks.sort((a, b) => a.label.localeCompare(b.label));
  sec.bookmarks.forEach((bm, idx) => {
    chrome.bookmarks.move(bm.id, { parentId: sec.id, index: idx });
  });
  rerender();
});

export { showCtxMenu, hideCtxMenu, initContextMenu };
