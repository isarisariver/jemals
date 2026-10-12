// t() kommt global aus i18n.js (klassisches Script)

// ─── Modal ────────────────────────────────────────────────
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
let modalCallback = null;

export function showModal(title, fields, onConfirm) {
  modalTitle.textContent = title;
  // DOM statt innerHTML: Werte (Bookmark-Titel/URLs) werden nie als HTML interpretiert
  modalBody.replaceChildren(...fields.map(f => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-field';
    const label = document.createElement('label');
    label.textContent = f.label;
    const input = document.createElement('input');
    input.id = f.id;
    input.type = 'text';
    input.value = f.value || '';
    wrap.append(label, input);
    return wrap;
  }));
  modalConfirm.className = 'btn btn-confirm';
  modalConfirm.textContent = t('modal_save');
  modalCallback = onConfirm;
  modalOverlay.classList.add('visible');
  setTimeout(() => modalBody.querySelector('input')?.focus(), 50);
}

export function showConfirm(title, msg, onConfirm) {
  modalTitle.textContent = title;
  if (msg) {
    const p = document.createElement('p');
    p.style.cssText = 'font-size:13px;color:var(--muted);margin-bottom:4px';
    p.textContent = msg;
    modalBody.replaceChildren(p);
  } else {
    modalBody.replaceChildren();
  }
  modalConfirm.className = 'btn btn-danger';
  modalConfirm.textContent = t('modal_delete');
  modalCallback = onConfirm;
  modalOverlay.classList.add('visible');
}

export function hideModal() {
  modalOverlay.classList.remove('visible');
  modalCallback = null;
}

modalCancel.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) hideModal(); });
modalConfirm.addEventListener('click', () => { if (modalCallback) modalCallback(); hideModal(); });
modalBody.addEventListener('keydown', e => { if (e.key === 'Enter') { if (modalCallback) modalCallback(); hideModal(); } });
