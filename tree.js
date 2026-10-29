import { state } from './state.js';

export const COLORS = ['#c0392b','#e67e22','#27ae60','#2980b9','#8e44ad','#16a085','#d35400','#2c3e50','#e91e63','#00bcd4','#ff5722','#607d8b'];

// ─── Bookmark-Baum → Sections ─────────────────────────────
// Jeder Ordner wird eine Sektion. `pathParentId` verweist auf den Elternordner, wenn
// dieser ein "echter" Ordner ist (für die Anzeige "Hauptordner – Unterordner").
// Unterhalb der Chrome-Wurzeln (Lesezeichenleiste, Weitere Lesezeichen, …) gibt es
// keinen Pfad-Präfix: dort ist pathParentId null.
export function transformTree(tree) {
  const result = [];
  function collectBookmarks(nodes, out) {
    for (const node of nodes) {
      if (node.url) out.push({ id: node.id, label: node.title || node.url, url: node.url });
    }
  }

  function walk(nodes, pathParentId, isRootLevel) {
    for (const node of nodes) {
      if (!node.children) continue;
      const bookmarks = [];
      collectBookmarks(node.children, bookmarks);
      result.push({
        id: node.id,
        title: node.title || 'Lesezeichen',
        pathParentId,
        color: COLORS[Math.abs(node.id.split('').reduce((a,c) => a + c.charCodeAt(0), 0)) % COLORS.length],
        collapsed: true, // welcher Ordner offen startet, entscheidet state.defaultFolder (init.js)
        bookmarks
      });
      // Kinder eines Wurzelordners starten ohne Präfix, alle anderen tragen den Pfad weiter
      walk(node.children.filter(c => c.children), isRootLevel ? null : node.id, false);
    }
  }

  for (const root of tree) {
    if (root.children) walk(root.children, null, true);
  }
  return result;
}

// Chromes Wurzelordner finden. Die IDs sind NICHT überall gleich ('1' = Leiste, '2' = Weitere
// Lesezeichen gilt nur für ältere Profile), deshalb über folderType bzw. die Reihenfolge.
export function findRootFolders(tree) {
  const roots = (tree && tree[0] && tree[0].children) || [];
  const bar = roots.find(r => r.folderType === 'bookmarks-bar') || roots[0];
  const other = roots.find(r => r.folderType === 'other') || roots[1] || roots[0];
  return { bar: bar ? bar.id : null, other: other ? other.id : null };
}

// Anzeigename mit Pfad, z. B. "Hauptordner – Unterordner". Der echte Chrome-Titel
// bleibt in sec.title (nur der wird beim Umbenennen bearbeitet).
export function sectionLabel(sec) {
  const parts = [sec.title];
  let cur = sec;
  const guard = new Set([sec.id]); // Schutz vor Zyklen
  while (cur.pathParentId) {
    const parent = state.sections.find(s => s.id === cur.pathParentId);
    if (!parent || guard.has(parent.id)) break;
    guard.add(parent.id);
    parts.unshift(parent.title);
    cur = parent;
  }
  return parts.join(' – ');
}

// Entfernt einen Ordner und alle seine Unterordner aus state.sections
// (Chromes removeTree löscht sie ebenfalls).
export function removeSectionTree(id) {
  const doomed = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const s of state.sections) {
      if (!doomed.has(s.id) && s.pathParentId && doomed.has(s.pathParentId)) {
        doomed.add(s.id);
        grew = true;
      }
    }
  }
  state.sections = state.sections.filter(s => !doomed.has(s.id));
}

// ─── Section Order ────────────────────────────────────────
export function saveSectionOrder() {
  chrome.storage.local.set({ sectionOrder: state.sections.map(s => s.id) });
}

export function applySectionOrder(order) {
  if (!order || !order.length) return;
  const map = Object.fromEntries(state.sections.map(s => [s.id, s]));
  const ordered = order.map(id => map[id]).filter(Boolean);
  const rest = state.sections.filter(s => !order.includes(s.id));
  state.sections = [...ordered, ...rest];
}
