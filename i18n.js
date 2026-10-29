// ─── i18n ─────────────────────────────────────────────────
const STRINGS = {
  de: {
    search_placeholder: 'Lesezeichen durchsuchen…',
    back_to_top: 'Nach oben',
    new_folder: '+ Neuer Ordner',
    loading: 'Lesezeichen werden geladen…',
    empty_folder: 'Leer — Lesezeichen hierher ziehen',
    ctx_rename: 'Umbenennen',
    ctx_edit_url: 'URL ändern',
    ctx_change_icon: 'Icon ändern…',
    ctx_reset_icon: 'Icon zurücksetzen',
    ctx_open_all: 'Alle öffnen',
    ctx_sort: 'Alphabetisch sortieren',
    ctx_color: 'Farbe ändern…',
    ctx_delete_bookmark: 'Löschen',
    ctx_delete_folder: 'Ordner löschen',
    modal_cancel: 'Abbrechen',
    modal_save: 'Speichern',
    modal_delete: 'Löschen',
    modal_rename_bookmark: 'Lesezeichen umbenennen',
    modal_rename_folder: 'Ordner umbenennen',
    modal_edit_url: 'URL ändern',
    modal_new_folder: 'Neuer Ordner',
    modal_delete_folder_title: (title) => `Ordner „${title}" löschen?`,
    modal_delete_folder_msg: (count) => `Alle ${count} Lesezeichen darin werden ebenfalls gelöscht.`,
    modal_delete_bookmark_title: (label) => `„${label}" löschen?`,
    field_name: 'Name',
    field_url: 'URL',
    theme_light: '☀️ Light',
    theme_slate: '🌙 Slate',
    theme_warm: '🟤 Warm',
    theme_black: '⬛ Black',
    help_title: 'Jemals — Übersicht',
    help_navigate_title: 'Navigieren',
    help_navigate_desc: 'Klick auf einen Ordner-Header öffnet ihn (alle anderen klappen zu). Nochmal klicken schließt ihn wieder.',
    help_drag_title: 'Drag & Drop',
    help_drag_desc: 'Bookmarks innerhalb und zwischen Ordnern verschieben. Ordner-Reihenfolge durch Ziehen am Header ändern.',
    help_ctx_bm_title: 'Rechtsklick auf Bookmark',
    help_ctx_bm_desc: 'Umbenennen · URL ändern · Icon ändern · Icon zurücksetzen · Löschen',
    help_ctx_folder_title: 'Rechtsklick auf Ordner',
    help_ctx_folder_desc: 'Umbenennen · Alle Bookmarks auf einmal öffnen · Alphabetisch sortieren · Farbe ändern · Löschen',
    help_keys_title: 'Keyboard Shortcuts',
    help_keys_desc: '/ Suche fokussieren · Esc Suche leeren',
    help_themes_title: 'Themes',
    help_themes_desc: 'Light · Slate · Warm · True Black — Auswahl oben rechts im Dropdown.',
    help_icons_title: 'Custom Icons',
    help_icons_desc: 'Rechtsklick auf ein Bookmark → "Icon ändern" — eigenes Bild hochladen. Wird lokal gespeichert.',
    settings_title: 'Einstellungen',
    st_appearance: 'Erscheinungsbild',
    st_theme: 'Theme',
    st_lang: 'Sprache',
    st_lang_auto: '🌐 Auto',
    st_clock_section: 'Uhrzeit',
    st_clock_format: 'Format',
    st_behavior: 'Verhalten',
    st_open_tab: 'Links öffnen',
    st_open_tab_hint: 'Im gleichen oder einem neuen Tab',
    st_same_tab: 'Gleicher Tab',
    st_new_tab: 'Neuer Tab',
    st_animations: 'Animationen',
    st_animations_hint: 'Ordner öffnen/schließen animieren',
    st_sections: 'Sektionen',
    st_recently_visited: 'Zuletzt besucht',
    st_recently_visited_hint: 'Zeigt kürzlich besuchte Seiten oben an',
    st_default_folder: 'Standard-Ordner',
    st_default_folder_hint: 'Standardmäßig aufgeklappter Ordner',
    st_hidden_folders: 'Ordner ausblenden',
    st_hidden_folders_hint: 'Ausgeblendete Ordner werden nicht angezeigt',
  },
  en: {
    search_placeholder: 'Search bookmarks…',
    back_to_top: 'Back to top',
    new_folder: '+ New Folder',
    loading: 'Loading bookmarks…',
    empty_folder: 'Empty — drag bookmarks here',
    ctx_rename: 'Rename',
    ctx_edit_url: 'Edit URL',
    ctx_change_icon: 'Change icon…',
    ctx_reset_icon: 'Reset icon',
    ctx_open_all: 'Open all',
    ctx_sort: 'Sort alphabetically',
    ctx_color: 'Change color…',
    ctx_delete_bookmark: 'Delete',
    ctx_delete_folder: 'Delete folder',
    modal_cancel: 'Cancel',
    modal_save: 'Save',
    modal_delete: 'Delete',
    modal_rename_bookmark: 'Rename bookmark',
    modal_rename_folder: 'Rename folder',
    modal_edit_url: 'Edit URL',
    modal_new_folder: 'New Folder',
    modal_delete_folder_title: (title) => `Delete folder "${title}"?`,
    modal_delete_folder_msg: (count) => `All ${count} bookmarks inside will also be deleted.`,
    modal_delete_bookmark_title: (label) => `Delete "${label}"?`,
    field_name: 'Name',
    field_url: 'URL',
    theme_light: '☀️ Light',
    theme_slate: '🌙 Slate',
    theme_warm: '🟤 Warm',
    theme_black: '⬛ Black',
    help_title: 'Jemals — Overview',
    help_navigate_title: 'Navigate',
    help_navigate_desc: 'Click a folder header to open it (all others collapse). Click again to close.',
    help_drag_title: 'Drag & Drop',
    help_drag_desc: 'Move bookmarks within and between folders. Reorder folders by dragging their header.',
    help_ctx_bm_title: 'Right-click on bookmark',
    help_ctx_bm_desc: 'Rename · Edit URL · Change icon · Reset icon · Delete',
    help_ctx_folder_title: 'Right-click on folder',
    help_ctx_folder_desc: 'Rename · Open all bookmarks · Sort alphabetically · Change color · Delete',
    help_keys_title: 'Keyboard Shortcuts',
    help_keys_desc: '/ Focus search · Esc Clear search',
    help_themes_title: 'Themes',
    help_themes_desc: 'Light · Slate · Warm · True Black — select in the top-right dropdown.',
    help_icons_title: 'Custom Icons',
    help_icons_desc: 'Right-click a bookmark → "Change icon" — upload your own image. Stored locally.',
    settings_title: 'Settings',
    st_appearance: 'Appearance',
    st_theme: 'Theme',
    st_lang: 'Language',
    st_lang_auto: '🌐 Auto',
    st_clock_section: 'Clock',
    st_clock_format: 'Format',
    st_behavior: 'Behavior',
    st_open_tab: 'Open links',
    st_open_tab_hint: 'In the same or a new tab',
    st_same_tab: 'Same tab',
    st_new_tab: 'New tab',
    st_animations: 'Animations',
    st_animations_hint: 'Animate opening and closing folders',
    st_sections: 'Sections',
    st_recently_visited: 'Recently visited',
    st_recently_visited_hint: 'Show recently visited pages at the top',
    st_default_folder: 'Default folder',
    st_default_folder_hint: 'Folder that is open by default',
    st_hidden_folders: 'Hide folders',
    st_hidden_folders_hint: 'Hidden folders will not be shown',
  },
  fr: {
    search_placeholder: 'Rechercher des favoris…',
    back_to_top: 'Haut de page',
    new_folder: '+ Nouveau dossier',
    loading: 'Chargement des favoris…',
    empty_folder: 'Vide — faites glisser des favoris ici',
    ctx_rename: 'Renommer',
    ctx_edit_url: 'Modifier l\'URL',
    ctx_change_icon: 'Changer l\'icône…',
    ctx_reset_icon: 'Réinitialiser l\'icône',
    ctx_open_all: 'Tout ouvrir',
    ctx_sort: 'Trier par ordre alphabétique',
    ctx_color: 'Changer la couleur…',
    ctx_delete_bookmark: 'Supprimer',
    ctx_delete_folder: 'Supprimer le dossier',
    modal_cancel: 'Annuler',
    modal_save: 'Enregistrer',
    modal_delete: 'Supprimer',
    modal_rename_bookmark: 'Renommer le favori',
    modal_rename_folder: 'Renommer le dossier',
    modal_edit_url: 'Modifier l\'URL',
    modal_new_folder: 'Nouveau dossier',
    modal_delete_folder_title: (title) => `Supprimer le dossier « ${title} » ?`,
    modal_delete_folder_msg: (count) => `Les ${count} favoris qu'il contient seront également supprimés.`,
    modal_delete_bookmark_title: (label) => `Supprimer « ${label} » ?`,
    field_name: 'Nom',
    field_url: 'URL',
    theme_light: '☀️ Clair',
    theme_slate: '🌙 Ardoise',
    theme_warm: '🟤 Chaud',
    theme_black: '⬛ Noir',
    help_title: 'Jemals — Aperçu',
    help_navigate_title: 'Navigation',
    help_navigate_desc: 'Cliquez sur un en-tête de dossier pour l\'ouvrir (les autres se ferment). Cliquez à nouveau pour le fermer.',
    help_drag_title: 'Glisser-déposer',
    help_drag_desc: 'Déplacez des favoris entre les dossiers. Réorganisez les dossiers en faisant glisser leur en-tête.',
    help_ctx_bm_title: 'Clic droit sur un favori',
    help_ctx_bm_desc: 'Renommer · Modifier l\'URL · Changer l\'icône · Réinitialiser l\'icône · Supprimer',
    help_ctx_folder_title: 'Clic droit sur un dossier',
    help_ctx_folder_desc: 'Renommer · Tout ouvrir · Trier alphabétiquement · Changer la couleur · Supprimer',
    help_keys_title: 'Raccourcis clavier',
    help_keys_desc: '/ Focuser la recherche · Esc Vider la recherche',
    help_themes_title: 'Thèmes',
    help_themes_desc: 'Clair · Ardoise · Chaud · Noir — sélectionnez en haut à droite.',
    help_icons_title: 'Icônes personnalisées',
    help_icons_desc: 'Clic droit sur un favori → "Changer l\'icône" — téléversez votre propre image. Stocké localement.',
    settings_title: 'Paramètres',
    st_appearance: 'Apparence',
    st_theme: 'Thème',
    st_lang: 'Langue',
    st_lang_auto: '🌐 Auto',
    st_clock_section: 'Horloge',
    st_clock_format: 'Format',
    st_behavior: 'Comportement',
    st_open_tab: 'Ouvrir les liens',
    st_open_tab_hint: 'Dans le même onglet ou un nouvel onglet',
    st_same_tab: 'Même onglet',
    st_new_tab: 'Nouvel onglet',
    st_animations: 'Animations',
    st_animations_hint: "Animer l'ouverture et la fermeture des dossiers",
    st_sections: 'Sections',
    st_recently_visited: 'Récemment visités',
    st_recently_visited_hint: 'Afficher les pages récemment visitées en haut',
    st_default_folder: 'Dossier par défaut',
    st_default_folder_hint: 'Dossier ouvert par défaut',
    st_hidden_folders: 'Masquer les dossiers',
    st_hidden_folders_hint: 'Les dossiers masqués ne seront pas affichés',
  },
  es: {
    search_placeholder: 'Buscar marcadores…',
    back_to_top: 'Volver arriba',
    new_folder: '+ Nueva carpeta',
    loading: 'Cargando marcadores…',
    empty_folder: 'Vacío — arrastra marcadores aquí',
    ctx_rename: 'Renombrar',
    ctx_edit_url: 'Editar URL',
    ctx_change_icon: 'Cambiar icono…',
    ctx_reset_icon: 'Restablecer icono',
    ctx_open_all: 'Abrir todo',
    ctx_sort: 'Ordenar alfabéticamente',
    ctx_color: 'Cambiar color…',
    ctx_delete_bookmark: 'Eliminar',
    ctx_delete_folder: 'Eliminar carpeta',
    modal_cancel: 'Cancelar',
    modal_save: 'Guardar',
    modal_delete: 'Eliminar',
    modal_rename_bookmark: 'Renombrar marcador',
    modal_rename_folder: 'Renombrar carpeta',
    modal_edit_url: 'Editar URL',
    modal_new_folder: 'Nueva carpeta',
    modal_delete_folder_title: (title) => `¿Eliminar carpeta "${title}"?`,
    modal_delete_folder_msg: (count) => `Los ${count} marcadores que contiene también serán eliminados.`,
    modal_delete_bookmark_title: (label) => `¿Eliminar "${label}"?`,
    field_name: 'Nombre',
    field_url: 'URL',
    theme_light: '☀️ Claro',
    theme_slate: '🌙 Pizarra',
    theme_warm: '🟤 Cálido',
    theme_black: '⬛ Negro',
    help_title: 'Jemals — Resumen',
    help_navigate_title: 'Navegar',
    help_navigate_desc: 'Haz clic en el encabezado de una carpeta para abrirla (las demás se cierran). Vuelve a hacer clic para cerrarla.',
    help_drag_title: 'Arrastrar y soltar',
    help_drag_desc: 'Mueve marcadores dentro y entre carpetas. Reordena las carpetas arrastrando su encabezado.',
    help_ctx_bm_title: 'Clic derecho en marcador',
    help_ctx_bm_desc: 'Renombrar · Editar URL · Cambiar icono · Restablecer icono · Eliminar',
    help_ctx_folder_title: 'Clic derecho en carpeta',
    help_ctx_folder_desc: 'Renombrar · Abrir todo · Ordenar alfabéticamente · Cambiar color · Eliminar',
    help_keys_title: 'Atajos de teclado',
    help_keys_desc: '/ Enfocar búsqueda · Esc Vaciar búsqueda',
    help_themes_title: 'Temas',
    help_themes_desc: 'Claro · Pizarra · Cálido · Negro — selecciona en la parte superior derecha.',
    help_icons_title: 'Iconos personalizados',
    help_icons_desc: 'Clic derecho en un marcador → "Cambiar icono" — sube tu propia imagen. Se almacena localmente.',
    settings_title: 'Configuración',
    st_appearance: 'Apariencia',
    st_theme: 'Tema',
    st_lang: 'Idioma',
    st_lang_auto: '🌐 Auto',
    st_clock_section: 'Reloj',
    st_clock_format: 'Formato',
    st_behavior: 'Comportamiento',
    st_open_tab: 'Abrir enlaces',
    st_open_tab_hint: 'En la misma pestaña o una nueva',
    st_same_tab: 'Misma pestaña',
    st_new_tab: 'Nueva pestaña',
    st_animations: 'Animaciones',
    st_animations_hint: 'Animar apertura y cierre de carpetas',
    st_sections: 'Secciones',
    st_recently_visited: 'Visitados recientemente',
    st_recently_visited_hint: 'Mostrar páginas visitadas recientemente arriba',
    st_default_folder: 'Carpeta predeterminada',
    st_default_folder_hint: 'Carpeta abierta por defecto',
    st_hidden_folders: 'Ocultar carpetas',
    st_hidden_folders_hint: 'Las carpetas ocultas no se mostrarán',
  }
};

// Detect browser language, fallback to English
function detectLang() {
  const lang = navigator.language || navigator.userLanguage || 'en';
  const code = lang.slice(0, 2).toLowerCase();
  return STRINGS[code] ? code : 'en';
}

let currentLang = detectLang();

// pref: 'auto' | 'de' | 'en' | 'fr' | 'es' (alles Unbekannte → Auto)
function setLang(pref) {
  currentLang = (pref && pref !== 'auto' && STRINGS[pref]) ? pref : detectLang();
  document.documentElement.lang = currentLang;
}

function t(key, ...args) {
  const val = STRINGS[currentLang]?.[key] ?? STRINGS['en'][key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

function applyTranslations() {
  document.getElementById('search').placeholder = t('search_placeholder');
  const btnTop = document.getElementById('btn-top');
  if (btnTop) { btnTop.title = t('back_to_top'); btnTop.setAttribute('aria-label', t('back_to_top')); }
  document.getElementById('btn-new-folder').textContent = t('new_folder');
  document.getElementById('ctx-rename').textContent = t('ctx_rename');
  document.getElementById('ctx-edit-url').textContent = t('ctx_edit_url');
  document.getElementById('ctx-change-icon').textContent = t('ctx_change_icon');
  document.getElementById('ctx-reset-icon').textContent = t('ctx_reset_icon');
  document.getElementById('ctx-open-all').textContent = t('ctx_open_all');
  document.getElementById('ctx-sort').textContent = t('ctx_sort');
  document.getElementById('ctx-color').textContent = t('ctx_color');
  document.getElementById('modal-cancel').textContent = t('modal_cancel');
  const themeSelect = document.getElementById('settings-theme');
  if (themeSelect) {
    themeSelect.options[0].text = t('theme_light');
    themeSelect.options[1].text = t('theme_slate');
    themeSelect.options[2].text = t('theme_warm');
    themeSelect.options[3].text = t('theme_black');
  }
  const helpTitleEl = document.querySelector('#help-header h3');
  if (helpTitleEl) helpTitleEl.textContent = t('help_title');
  const helpSections = document.querySelectorAll('.help-section');
  const keys = [
    ['help_navigate_title', 'help_navigate_desc'],
    ['help_drag_title', 'help_drag_desc'],
    ['help_ctx_bm_title', 'help_ctx_bm_desc'],
    ['help_ctx_folder_title', 'help_ctx_folder_desc'],
    ['help_keys_title', 'help_keys_desc'],
    ['help_themes_title', 'help_themes_desc'],
    ['help_icons_title', 'help_icons_desc'],
  ];
  helpSections.forEach((sec, i) => {
    if (keys[i]) {
      sec.querySelector('.help-title').textContent = t(keys[i][0]);
      sec.querySelector('.help-desc').textContent = t(keys[i][1]);
    }
  });
  // Settings modal
  const settingsTitleEl = document.getElementById('settings-title');
  if (settingsTitleEl) settingsTitleEl.textContent = t('settings_title');
  const ids = {
    'st-appearance': 'st_appearance', 'st-theme': 'st_theme', 'st-lang': 'st_lang',
    'st-clock-section': 'st_clock_section', 'st-clock-format': 'st_clock_format',
    'st-behavior': 'st_behavior', 'st-open-tab': 'st_open_tab',
    'st-open-tab-hint': 'st_open_tab_hint', 'st-animations': 'st_animations',
    'st-animations-hint': 'st_animations_hint', 'st-sections': 'st_sections',
    'st-recently-visited': 'st_recently_visited',
    'st-recently-visited-hint': 'st_recently_visited_hint',
    'st-default-folder': 'st_default_folder',
    'st-default-folder-hint': 'st_default_folder_hint',
    'st-hidden-folders': 'st_hidden_folders',
    'st-hidden-folders-hint': 'st_hidden_folders_hint',
  };
  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const toggleSame = document.getElementById('toggle-same-tab');
  const toggleNew = document.getElementById('toggle-new-tab');
  if (toggleSame) toggleSame.textContent = t('st_same_tab');
  if (toggleNew) toggleNew.textContent = t('st_new_tab');
  const langAuto = document.querySelector('#settings-lang option[value="auto"]');
  if (langAuto) langAuto.textContent = t('st_lang_auto');
}
