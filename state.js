// Zentraler, geteilter Zustand für alle Module.
// Immer über state.xyz lesen/schreiben (importierte Bindings sind schreibgeschützt,
// Objekt-Properties nicht).
const state = {
  sections: [],        // [{ id, title, color, collapsed, bookmarks: [...] }]
  currentFilter: null, // aktueller Suchbegriff oder null
  customIcons: {},     // bmId  -> base64-PNG
  customColors: {},    // secId -> Hex-Farbe
  openInNewTab: false, // Links im neuen Tab öffnen (Setting)
  hiddenFolders: [],   // ids der ausgeblendeten Ordner (Setting)
  showRecent: false,   // Sektion "Zuletzt besucht" anzeigen (Setting)
  recent: [],          // [{ id, label, url }] aus chrome.history
  defaultFolder: '1',  // id des Ordners, der beim Start aufgeklappt ist ('1' = Bookmarks Bar)
  drag: {
    itemId: null,      // id des gerade gezogenen Bookmarks
    secId: null        // id der gerade gezogenen Sektion
  }
};

export { state };
