import { state } from './state.js';

// ─── Favicon (Chromes lokale _favicon-API, keine Netzwerkanfrage) ──
// Braucht die Berechtigung "favicon". Liest aus Chromes eigenem Icon-Cache,
// ohne allowGoogleServerFallback, es wird also nichts an Dritte gesendet.
const REQUEST_SIZE = 128; // größtmögliche Auflösung anfragen; Chrome liefert die beste vorhandene
const SIG_SIZE = 32;      // Kantenlänge für den Fingerabdruck (nur Vergleich, nicht Anzeige)
const MAX_DISPLAY = 52;   // entspricht .item-icon img im CSS
const MIN_DISPLAY = 28;

export function getFavicon(pageUrl) {
  const u = new URL(chrome.runtime.getURL('/_favicon/'));
  u.searchParams.set('pageUrl', pageUrl);
  u.searchParams.set('size', String(REQUEST_SIZE));
  return u.toString();
}

// Chrome liefert für unbekannte Seiten KEINEN Fehler, sondern ein generisches
// Standard-Icon. Wir erkennen es per Pixel-Fingerabdruck im Vergleich zu einem
// garantiert unbekannten Referenz-Link und zeigen dann die Initialen.
function signature(img) {
  const c = document.createElement('canvas');
  c.width = c.height = SIG_SIZE;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, SIG_SIZE, SIG_SIZE);
  const d = ctx.getImageData(0, 0, SIG_SIZE, SIG_SIZE).data;
  let h = 2166136261;
  for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
}

let fallbackSig = null;
function getFallbackSignature() {
  fallbackSig ??= loadImage(getFavicon('https://jemals-fallback.invalid/'))
    .then(signature)
    .catch(() => null);
  return fallbackSig;
}

// pageUrl -> false (nur Standard-Icon) | Zahl (echtes Icon, Anzeigegröße in px).
// Verhindert Neuberechnung und Flackern bei jedem render().
const faviconState = new Map();

// ─── Favicon Fallback (farbige Initialen) ─────────────────
const INITIAL_COLORS = [
  '#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c',
  '#3498db','#9b59b6','#e91e63','#00bcd4','#ff5722'
];

function getInitialsColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return INITIAL_COLORS[Math.abs(hash) % INITIAL_COLORS.length];
}

function getInitials(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return host.slice(0, 2).toUpperCase();
  } catch { return '??'; }
}

function showInitials(parent, url) {
  const canvas = document.createElement('canvas');
  canvas.width = 52; canvas.height = 52;
  const ctx = canvas.getContext('2d');
  const color = getInitialsColor(url);
  const r = 10, w = 52, h = 52;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getInitials(url), 26, 27);
  parent.appendChild(canvas);
}

// Kleine Vorlagen (z. B. 16/32 px) nicht auf 52 px aufziehen, das wird pixelig.
// Max. ~1,75 Geräte-Pixel pro Vorlagen-Pixel; hochaufgelöste Icons nutzen die volle Größe.
function displaySize(naturalWidth) {
  if (!naturalWidth) return MAX_DISPLAY;
  const dpr = window.devicePixelRatio || 1;
  const px = Math.round(naturalWidth * 1.75 / dpr);
  return Math.max(MIN_DISPLAY, Math.min(MAX_DISPLAY, px));
}

function applySize(img, px) {
  img.style.width = img.style.height = px + 'px';
}

function toInitials(img, url) {
  if (!img.parentNode) return;
  img.style.display = 'none';
  showInitials(img.parentNode, url);
}

// img muss bereits im DOM-Container hängen (parentNode), bevor diese Funktion läuft.
export function setFaviconWithFallback(img, url, bmId) {
  if (bmId && state.customIcons[bmId]) {
    img.src = state.customIcons[bmId];
    return;
  }

  const known = faviconState.get(url);
  if (known === false) { toInitials(img, url); return; }
  if (typeof known === 'number') applySize(img, known); // bekannte Größe sofort, kein Springen

  img.loading = 'lazy'; // Icons in zugeklappten Ordnern erst beim Aufklappen laden
  if (known === undefined) img.style.visibility = 'hidden'; // kein kurzes Aufblitzen des Standard-Icons

  img.onerror = () => {
    img.onerror = null;
    faviconState.set(url, false);
    img.style.visibility = '';
    toInitials(img, url);
  };
  img.onload = async () => {
    img.onload = null;
    if (known === undefined) {
      let isDefault = false;
      try {
        const fb = await getFallbackSignature();
        isDefault = fb !== null && signature(img) === fb;
      } catch { /* im Zweifel das Icon zeigen */ }
      if (isDefault) {
        faviconState.set(url, false);
        img.style.visibility = '';
        toInitials(img, url);
        return;
      }
      const px = displaySize(img.naturalWidth);
      faviconState.set(url, px);
      applySize(img, px);
    }
    img.style.visibility = '';
  };
  img.src = getFavicon(url);
}
