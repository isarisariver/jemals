# Jemals

Jemals is a Chrome extension (Manifest V3) that replaces the new tab page with a dashboard for your bookmarks. *"Jemals"* is German for *"ever"*: all the bookmarks you have ever saved, in one place.

It works with your regular Chrome bookmarks. There is nothing to import: add new bookmarks as usual (the star in the address bar or Ctrl/Cmd+D) and they show up in your next new tab. Whatever you rename, move, or delete in Jemals applies directly in Chrome.

## Features

- Bookmark folders as sections, one open at a time while the others stay collapsed; subfolders are shown with their path (for example "Development – Tools")
- Drag & drop for bookmarks and folders, with a clear drop indicator
- Fast search across all bookmarks (`/` focuses the search box, `Esc` clears it); the search bar stays visible while scrolling
- Right-click menu: rename, change URL, set a custom icon, sort a folder alphabetically, change the folder color, open all bookmarks of a folder, delete
- Custom icons per bookmark; colored initials when no icon is available
- Optional "Recently visited" section with your ten latest websites; drag one into a folder to save it as a bookmark
- Four themes: Light, Slate, Warm, and Black
- English, German, French, and Spanish, detected automatically or chosen manually
- Settings for clock format, opening links in the same or a new tab, default folder, hidden folders, and animations
- Tested with more than 5,000 bookmarks

## Privacy

Everything stays local in your browser. Jemals has no account, no servers of its own, no analytics, no tracking, and no ads, and it does not load remote code.

- **Bookmarks** are read through Chrome's `bookmarks` API and only modified when you trigger it yourself.
- **Settings and custom icons** are stored in `chrome.storage.local` on your device and are not synced.
- **Website icons** come from Chrome's own local favicon storage (`_favicon`). Jemals sends no requests to any server for this and passes no addresses to Google or other third parties.
- **Browsing history** is read only if you enable "Recently visited". The data stays in memory, is not stored or transmitted, and the permission is released when you switch the feature off.

The full policy is in [store/privacy-policy.md](store/privacy-policy.md).

## Permissions

| Permission | Why it is needed |
|---|---|
| `bookmarks` | Read your bookmark tree to display it, and rename, move, sort, create, and delete bookmarks and folders when you ask for it |
| `storage` | Store your settings, folder order and colors, and custom icons locally |
| `favicon` | Show website icons using Chrome's local favicon interface |
| `history` (optional) | Requested only when you enable "Recently visited" to show your latest websites |

Jemals also overrides the new tab page. That is its single purpose.
