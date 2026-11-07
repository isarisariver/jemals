# Datenschutzerklärung – Jemals

*Stand: Oktober 2026 · [English version below](#privacy-policy--jemals)*

## Kurzfassung

Jemals ist eine Browser-Erweiterung, die den neuen Tab durch ein Dashboard für deine Lesezeichen ersetzt. **Alles passiert lokal in deinem Browser.** Jemals hat kein Benutzerkonto, keine eigenen Server, keine Werbung, keine Analyse- oder Tracking-Werkzeuge. Es werden keine Daten an den Entwickler oder an Dritte übertragen.

## Welche Daten verarbeitet Jemals?

**Lesezeichen.** Jemals liest deine Lesezeichen über die Chrome-Schnittstelle `bookmarks`, um sie anzuzeigen. Lesezeichen werden nur dann geändert, wenn du es selbst auslöst, etwa durch Umbenennen, Verschieben, Löschen, Sortieren, das Anlegen eines Ordners oder das Ablegen eines Eintrags aus „Zuletzt besucht“. Die Lesezeichen verlassen dein Gerät nicht über Jemals.

**Einstellungen und Anpassungen.** Diese werden in `chrome.storage.local` auf deinem Gerät gespeichert:
- Theme, Sprache, Uhrzeitformat, Verhalten beim Öffnen von Links, Animationen
- Standard-Ordner, ausgeblendete Ordner, Reihenfolge und Farben der Ordner
- eigene Icons, die du einzelnen Lesezeichen zuweist (als kleines Bild lokal gespeichert)
- ob „Zuletzt besucht“ aktiviert ist

`chrome.storage.local` wird nicht mit anderen Geräten synchronisiert. Werden deine Lesezeichen selbst von Chrome synchronisiert, ist das eine Funktion von Chrome und unabhängig von Jemals.

**Browserverlauf (optional).** Nur wenn du „Zuletzt besucht“ aktivierst, fragt Chrome dich nach der Berechtigung `history`. Jemals liest dann Titel und Adressen deiner zuletzt besuchten Seiten, um die zehn jüngsten Websites anzuzeigen. Diese Daten werden nur im Arbeitsspeicher gehalten, **nicht gespeichert und nicht übertragen**. Schaltest du die Funktion aus, gibt Jemals die Berechtigung wieder ab.

**Website-Icons.** Die Icons der Lesezeichen lädt Jemals über Chromes eigene, lokale Favicon-Schnittstelle (`_favicon`) aus dem Icon-Speicher deines Browsers. Jemals selbst sendet dafür keine Anfragen an Server und gibt keine Adressen an Google oder andere Dritte weiter.

## Was Jemals nicht tut

- keine Erhebung personenbezogener Daten durch den Entwickler
- keine Übertragung an eigene oder fremde Server
- keine Cookies, keine Analyse, kein Tracking, keine Werbung
- kein Verkauf oder Weitergabe von Daten
- kein Nachladen von Code aus dem Internet

## Löschen deiner Daten

Deinstallierst du Jemals, entfernt Chrome alle von der Erweiterung gespeicherten Einstellungen und Icons. Eigene Icons kannst du jederzeit einzeln zurücksetzen (Rechtsklick auf das Lesezeichen). Deine Lesezeichen selbst bleiben in Chrome erhalten.

## Änderungen

Wird diese Erklärung geändert, steht das aktuelle Datum oben. Wesentliche Änderungen werden in den Versionshinweisen genannt.

## Kontakt

mrnbck@pm.me
Quellcode: https://github.com/isarisariver/jemals

---

# Privacy Policy – Jemals

*Last updated: October 2026*

## Summary

Jemals is a browser extension that replaces the new tab page with a dashboard for your bookmarks. **Everything happens locally in your browser.** Jemals has no user accounts, no servers of its own, no ads, and no analytics or tracking. No data is sent to the developer or to third parties.

## What data does Jemals process?

**Bookmarks.** Jemals reads your bookmarks through Chrome's `bookmarks` API in order to display them. Bookmarks are only modified when you trigger it yourself, for example by renaming, moving, deleting, sorting, creating a folder, or dropping an entry from "Recently visited". Jemals does not transmit your bookmarks anywhere.

**Settings and customizations.** These are stored in `chrome.storage.local` on your device:
- theme, language, clock format, link behavior, animations
- default folder, hidden folders, folder order and colors
- custom icons you assign to individual bookmarks (stored locally as a small image)
- whether "Recently visited" is enabled

`chrome.storage.local` is not synced to other devices. If Chrome syncs your bookmarks themselves, that is a Chrome feature and independent of Jemals.

**Browsing history (optional).** Only if you enable "Recently visited" does Chrome ask you for the `history` permission. Jemals then reads the titles and addresses of your most recently visited pages to show the ten latest websites. This data is kept in memory only; it is **not stored and not transmitted**. If you switch the feature off, Jemals gives the permission back.

**Website icons.** Jemals loads bookmark icons through Chrome's own local favicon interface (`_favicon`) from your browser's icon storage. Jemals itself sends no requests to any server for this and does not pass any addresses to Google or other third parties.

## What Jemals does not do

- no collection of personal data by the developer
- no transmission to the developer's or any third-party servers
- no cookies, analytics, tracking, or advertising
- no sale or sharing of data
- no loading of remote code

## Deleting your data

When you uninstall Jemals, Chrome removes all settings and icons the extension stored. You can also reset custom icons one by one (right-click the bookmark). Your bookmarks themselves remain in Chrome.

## Changes

If this policy changes, the date above is updated. Significant changes are mentioned in the release notes.

## Contact

mrnbck@pm.me
Sourcecode: https://github.com/isarisariver/jemals
