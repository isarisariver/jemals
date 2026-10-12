import { state } from './state.js';

export const COLORS = ['#c0392b','#e67e22','#27ae60','#2980b9','#8e44ad','#16a085','#d35400','#2c3e50','#e91e63','#00bcd4','#ff5722','#607d8b'];

// ─── Bookmark-Baum → Sections ─────────────────────────────
export function transformTree(tree) {
  const result = [];
  function collectBookmarks(nodes, out) {
    for (const node of nodes) {
      if (node.url) out.push({ id: node.id, label: node.title || node.url, url: node.url });
    }
  }

  function walk(nodes) {
    for (const node of nodes) {
      if (node.children) {
        const bookmarks = [];
        collectBookmarks(node.children, bookmarks);
        result.push({
          id: node.id,
          title: node.title || 'Lesezeichen',
          color: COLORS[Math.abs(node.id.split('').reduce((a,c) => a + c.charCodeAt(0), 0)) % COLORS.length],
          collapsed: true, // welcher Ordner offen startet, entscheidet state.defaultFolder (init.js)
          bookmarks
        });
        walk(node.children.filter(c => c.children));
      }
    }
  }

  for (const root of tree) {
    if (root.children) walk(root.children);
  }
  return result;
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
