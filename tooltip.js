// ─── Tooltip ──────────────────────────────────────────────
const tooltip = document.createElement('div');
tooltip.id = 'bm-tooltip';
document.body.appendChild(tooltip);
let tooltipTimeout = null;

export function showTooltip(bm, e) {
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    // textContent statt innerHTML: Titel und URLs sind fremde Daten
    const title = document.createElement('div');
    title.className = 'tt-title';
    title.textContent = bm.label;
    const url = document.createElement('div');
    url.className = 'tt-url';
    url.textContent = bm.url;
    tooltip.replaceChildren(title, url);
    tooltip.classList.add('visible');
    positionTooltip(e);
  }, 300);
}

export function hideTooltip() {
  clearTimeout(tooltipTimeout);
  tooltipTimeout = null;
  tooltip.classList.remove('visible');
}

export function positionTooltip(e) {
  const margin = 12;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let x = e.clientX + margin;
  let y = e.clientY + margin;
  if (x + tw > window.innerWidth - 8) x = e.clientX - tw - margin;
  if (y + th > window.innerHeight - 8) y = e.clientY - th - margin;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}
