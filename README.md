# Jemals

Chrome-Erweiterung (Manifest V3), die den neuen Tab durch ein Dashboard für deine Lesezeichen ersetzt.
*„Alle Lesezeichen, die du jemals gespeichert hast.“*

## Funktionen

- Lesezeichen-Ordner als Sektionen, immer nur ein Ordner gleichzeitig offen (Accordion)
- Drag & Drop für Lesezeichen und Ordner, Rechtsklick-Menü (umbenennen, URL ändern, Icon ändern, sortieren, Farbe, alle öffnen, löschen)
- Suche (`/` fokussiert, `Esc` leert)
- Eigene Icons pro Lesezeichen, Fallback mit farbigen Initialen
- Optional: „Zuletzt besucht“ (zuletzt besuchte Websites)
- Themes: Light, Slate, Warm, Black
- Sprachen: Deutsch, Englisch, Französisch, Spanisch (automatisch oder manuell)
- Einstellungen: Uhrzeitformat, Links im gleichen/neuen Tab, Standard-Ordner, Ordner ausblenden, Animationen

## Installation (Entwicklung)

1. Dieses Repository klonen oder herunterladen.
2. In Chrome `chrome://extensions` öffnen und oben rechts den **Entwicklermodus** aktivieren.
3. **Entpackte Erweiterung laden** wählen und den Projektordner auswählen.
4. Nach Änderungen an `manifest.json` die Erweiterung in `chrome://extensions` neu laden (der Pfeil an der Karte).

## Datenschutz

Alles bleibt lokal im Browser.

- **Favicons** kommen aus Chromes eigenem Icon-Cache (`_favicon`-API). Es werden keine Domains an Google oder andere Dritte gesendet.
- **Einstellungen und eigene Icons** liegen in `chrome.storage.local`.
- **Verlauf** (`history`) ist eine *optionale* Berechtigung. Chrome fragt erst, wenn „Zuletzt besucht“ aktiviert wird, und die Berechtigung wird beim Ausschalten wieder abgegeben.

### Berechtigungen

| Berechtigung | Wofür |
|---|---|
| `bookmarks` | Lesezeichen lesen, verschieben, umbenennen, löschen |
| `storage` | Einstellungen, eigene Icons, Ordnerfarben und -reihenfolge |
| `favicon` | Website-Icons lokal aus Chrome laden |
| `history` (optional) | Nur für „Zuletzt besucht“ |

## Projektstruktur

Alle Skripte sind ES-Module, Einstiegspunkt ist `init.js`. `i18n.js` ist ein klassisches Script mit globalem `t()`.

| Datei | Inhalt |
|---|---|
| `manifest.json`, `newtab.html`, `newtab.css` | Manifest, Seite, Styles |
| `init.js` | Start: Lesezeichen und Einstellungen laden, Module verdrahten |
| `state.js` | geteilter Zustand (Sektionen, Filter, Icons, Einstellungen, Drag) |
| `render.js` | Aufbau der Oberfläche, Accordion-Animation |
| `drag.js` | Drag & Drop |
| `context-menu.js`, `modal.js` | Rechtsklick-Menü und Dialoge |
| `settings.js` | Einstellungsfenster |
| `topbar.js` | Uhr, Suche, „Neuer Ordner“, Hilfe, Tastenkürzel |
| `tree.js` | Lesezeichen-Baum → Sektionen, Sektionsreihenfolge |
| `icons.js` | Favicons und Initialen-Fallback |
| `recent.js` | „Zuletzt besucht“ und die optionale Berechtigung |
| `tooltip.js` | Hover-Info |
| `i18n.js` | Übersetzungen |

Icons der Erweiterung liegen unter `icons/` (16, 48, 128 px), das Tab-Icon ist `favicon.svg`.

## Geplantes

Siehe [TODO.md](TODO.md).
