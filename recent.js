import { state } from './state.js';

// "history" ist eine optionale Berechtigung: Chrome fragt erst, wenn der Nutzer
// "Zuletzt besucht" aktiviert, und nicht schon bei der Installation.
const HISTORY = { permissions: ['history'] };

// Liest chrome.runtime.lastError aus (sonst: "Unchecked runtime.lastError" in der Konsole)
// und gibt bei einem Fehler false zurück.
function permissionCall(method) {
  return new Promise(resolve => {
    chrome.permissions[method](HISTORY, result => {
      if (chrome.runtime.lastError) {
        console.warn(`Jemals: permissions.${method} fehlgeschlagen:`, chrome.runtime.lastError.message);
        resolve(false);
        return;
      }
      resolve(!!result);
    });
  });
}

export const hasHistoryPermission = () => permissionCall('contains');
export const requestHistoryPermission = () => permissionCall('request');
export const removeHistoryPermission = () => permissionCall('remove');

// Letzte besuchte Seiten, pro Website nur die jüngste (wie Chromes eigene Kacheln).
export function loadRecent(limit = 10) {
  return new Promise(resolve => {
    if (!chrome.history) return resolve([]);
    chrome.history.search({ text: '', maxResults: 300, startTime: 0 }, results => {
      if (chrome.runtime.lastError) {
        console.warn('Jemals: history.search fehlgeschlagen:', chrome.runtime.lastError.message);
        return resolve([]);
      }
      const seen = new Set();
      const items = [];
      for (const r of results || []) {
        let u;
        try { u = new URL(r.url); } catch { continue; }
        if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
        if (seen.has(u.hostname)) continue;
        seen.add(u.hostname);
        items.push({
          id: 'recent:' + u.hostname,
          label: r.title || u.hostname,
          url: r.url
        });
        if (items.length >= limit) break;
      }
      resolve(items);
    });
  });
}

export async function refreshRecent() {
  try { state.recent = await loadRecent(); }
  catch { state.recent = []; }
}
