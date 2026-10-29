import { state } from './state.js';
import { render } from './render.js';
import { sectionLabel } from './tree.js';
import { hasHistoryPermission, requestHistoryPermission, removeHistoryPermission, refreshRecent } from './recent.js';
// setLang() und applyTranslations() kommen global aus i18n.js

// ─── Theme ────────────────────────────────────────────────
const themeSelect = document.getElementById('settings-theme');

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeSelect.value = theme;
  chrome.storage.local.set({ theme });
}

themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));

// ─── Sprache ──────────────────────────────────────────────
const langSelect = document.getElementById('settings-lang');

// pref: 'auto' | 'de' | 'en' | 'fr' | 'es'
export function applyLanguage(pref) {
  langSelect.value = pref || 'auto';
  setLang(pref);
  applyTranslations();
}

langSelect.addEventListener('change', () => {
  const pref = langSelect.value;
  chrome.storage.local.set({ language: pref });
  applyLanguage(pref);
  render(state.currentFilter); // dynamische Texte (z. B. leerer Ordner) neu aufbauen
});

// ─── Uhrzeitformat ────────────────────────────────────────
const toggle24h = document.getElementById('toggle-24h');
const toggle12h = document.getElementById('toggle-12h');

export function applyClockFormat(format) {
  const is24h = format !== '12h';
  toggle24h.classList.toggle('active', is24h);
  toggle12h.classList.toggle('active', !is24h);
}

toggle24h.addEventListener('click', () => {
  applyClockFormat('24h');
  chrome.storage.local.set({ clockFormat: '24h' });
});
toggle12h.addEventListener('click', () => {
  applyClockFormat('12h');
  chrome.storage.local.set({ clockFormat: '12h' });
});

// ─── Links im gleichen / neuen Tab ────────────────────────
const toggleSameTab = document.getElementById('toggle-same-tab');
const toggleNewTab = document.getElementById('toggle-new-tab');

export function applyOpenInNewTab(newTab) {
  state.openInNewTab = !!newTab;
  toggleSameTab.classList.toggle('active', !state.openInNewTab);
  toggleNewTab.classList.toggle('active', state.openInNewTab);
}

toggleSameTab.addEventListener('click', () => {
  applyOpenInNewTab(false);
  chrome.storage.local.set({ openInNewTab: false });
});
toggleNewTab.addEventListener('click', () => {
  applyOpenInNewTab(true);
  chrome.storage.local.set({ openInNewTab: true });
});

// ─── Animationen ──────────────────────────────────────────
const animToggle = document.getElementById('toggle-animations');

export function applyAnimations(enabled) {
  animToggle.checked = enabled !== false;
}

animToggle.addEventListener('change', e => {
  chrome.storage.local.set({ animationsEnabled: e.target.checked });
});

// ─── Zuletzt besucht ──────────────────────────────────────
const toggleRecent = document.getElementById('toggle-recent');

// Beim Start: nur aktiv, wenn gespeichert UND die Berechtigung noch vorhanden ist.
export async function applyShowRecent(enabled) {
  let active = false;
  try { active = !!enabled && await hasHistoryPermission(); } catch { active = false; }
  state.showRecent = active;
  toggleRecent.checked = active;
  if (active) await refreshRecent();
}

toggleRecent.addEventListener('change', async () => {
  if (toggleRecent.checked) {
    // request() muss direkt im Klick (User-Geste) aufgerufen werden
    const granted = await requestHistoryPermission();
    if (!granted) { toggleRecent.checked = false; return; }
    state.showRecent = true;
    await refreshRecent();
  } else {
    state.showRecent = false;
    state.recent = [];
    await removeHistoryPermission(); // Berechtigung wieder abgeben
  }
  chrome.storage.local.set({ showRecent: state.showRecent });
  render(state.currentFilter);
});

// ─── Standard-Ordner ──────────────────────────────────────
const defaultFolderSelect = document.getElementById('settings-default-folder');

export function applyDefaultFolder(id) {
  state.defaultFolder = id || state.rootIds.bar;
  // Beim Start nur diesen Ordner aufklappen
  state.sections.forEach(s => { s.collapsed = s.id !== state.defaultFolder; });
}

// Nur sichtbare Ordner anbieten; ein ausgeblendeter Standard-Ordner wäre sinnlos
function fillDefaultFolderSelect() {
  defaultFolderSelect.innerHTML = '';
  state.sections
    .filter(sec => !state.hiddenFolders.includes(sec.id))
    .forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = sectionLabel(sec);
      defaultFolderSelect.appendChild(opt);
    });
  defaultFolderSelect.value = state.defaultFolder;
  if (defaultFolderSelect.value !== state.defaultFolder) defaultFolderSelect.selectedIndex = -1;
}

defaultFolderSelect.addEventListener('change', () => {
  state.defaultFolder = defaultFolderSelect.value;
  chrome.storage.local.set({ defaultFolder: state.defaultFolder });
});

// ─── Ordner ausblenden ────────────────────────────────────
export function applyHiddenFolders(ids) {
  state.hiddenFolders = Array.isArray(ids) ? ids : [];
}

document.getElementById('settings-folder-list').addEventListener('change', e => {
  const input = e.target.closest('input[data-sec-id]');
  if (!input) return;
  const id = input.dataset.secId;
  const hidden = new Set(state.hiddenFolders);
  if (input.checked) hidden.add(id); else hidden.delete(id);
  state.hiddenFolders = [...hidden];
  chrome.storage.local.set({ hiddenFolders: state.hiddenFolders });
  fillDefaultFolderSelect();
  render(state.currentFilter);
});

// ─── Settings Modal ───────────────────────────────────────
const settingsOverlay = document.getElementById('settings-overlay');

function openSettings() {
  // Ordner-Liste befüllen
  const folderList = document.getElementById('settings-folder-list');
  folderList.innerHTML = '';
  state.sections.forEach(sec => {
    const row = document.createElement('div');
    row.className = 'settings-folder-row';

    const name = document.createElement('div');
    name.className = 'settings-folder-name';
    const dot = document.createElement('span');
    dot.className = 'settings-folder-dot';
    dot.style.background = sec.color;
    name.append(dot, document.createTextNode(' ' + sectionLabel(sec)));

    const label = document.createElement('label');
    label.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.secId = sec.id;
    input.checked = state.hiddenFolders.includes(sec.id); // an = ausgeblendet
    const slider = document.createElement('span');
    slider.className = 'slider';
    label.append(input, slider);

    row.append(name, label);
    folderList.appendChild(row);
  });

  fillDefaultFolderSelect();

  // Theme-Select synchronisieren
  themeSelect.value = document.documentElement.getAttribute('data-theme') || 'light';

  settingsOverlay.classList.add('visible');
}

export function closeSettings() {
  settingsOverlay.classList.remove('visible');
}

document.getElementById('btn-settings').addEventListener('click', openSettings);
document.getElementById('settings-close').addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', e => { if (e.target === settingsOverlay) closeSettings(); });
