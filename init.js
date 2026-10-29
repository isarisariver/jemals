import { state } from './state.js';
import { render } from './render.js';
import { initContextMenu } from './context-menu.js';
import { initDrag } from './drag.js';
import { transformTree, applySectionOrder, findRootFolders } from './tree.js';
import { applyTheme, applyLanguage, applyClockFormat, applyOpenInNewTab, applyHiddenFolders, applyDefaultFolder, applyShowRecent, applyAnimations } from './settings.js';
import './topbar.js'; // registriert Uhr, Suche, Shortcuts, Hilfe, "Neuer Ordner"

// render() an Module übergeben, die es brauchen (vermeidet zirkuläre Imports)
initContextMenu({ render });
initDrag({ render });

chrome.bookmarks.getTree(tree => {
  state.rootIds = findRootFolders(tree);
  state.sections = transformTree(tree);
  chrome.storage.local.get(
    ['sectionOrder', 'theme', 'language', 'customIcons', 'customColors', 'clockFormat', 'openInNewTab', 'hiddenFolders', 'defaultFolder', 'showRecent', 'animationsEnabled'],
    ({ sectionOrder, theme, language, customIcons, customColors, clockFormat, openInNewTab, hiddenFolders, defaultFolder, showRecent, animationsEnabled }) => {
      state.customIcons = customIcons || {};
      state.customColors = customColors || {};
      state.sections.forEach(s => {
        if (state.customColors[s.id]) s.color = state.customColors[s.id];
      });
      applySectionOrder(sectionOrder);

      const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'slate' : 'light';
      applyTheme(theme || defaultTheme);
      applyClockFormat(clockFormat);
      applyOpenInNewTab(openInNewTab);
      applyHiddenFolders(hiddenFolders);
      applyDefaultFolder(defaultFolder);
      applyAnimations(animationsEnabled);
      applyLanguage(language);
      applyShowRecent(showRecent).then(() => render());
    }
  );
});
