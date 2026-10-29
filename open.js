// Öffnet eine Lesezeichen-URL. window.open() reicht nicht für alle Schemata:
//  - chrome://, about:, file:  werden aus einer Erweiterungsseite heraus blockiert
//                              (Umweg über die tabs-API, dafür ist keine Berechtigung nötig)
//  - javascript: (Bookmarklets) lassen sich auf dem neuen Tab nicht ausführen
//                              (Content-Security-Policy), wir tun bewusst nichts
const TABS_API_SCHEMES = /^(chrome|about|file):/i;

export function openUrl(url, { newTab = false } = {}) {
  if (/^javascript:/i.test(url)) return;

  if (TABS_API_SCHEMES.test(url)) {
    const op = newTab ? chrome.tabs.create({ url }) : chrome.tabs.update({ url });
    Promise.resolve(op).catch(err => console.warn('Jemals: konnte URL nicht öffnen:', url, err));
    return;
  }
  window.open(url, newTab ? '_blank' : '_self');
}
