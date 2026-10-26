# TRSH Band Site — Project Guide

Static site for the band **TRSH** ("Trash from the Midwest"). No build step, no framework — plain HTML, CSS, and vanilla JS served directly from the repo root. All content is hard-coded into the HTML/JS files (no backend, no CMS).

## How to add a show to this site

When a new show/flyer is added, **two files must be updated together**, otherwise the shows list and the map will be out of sync:

1. **`www/Flyers/`** — drop the flyer image file here (this is the only folder for flyers).
2. **`www/shows.html`** — add the show listing (see "Shows page" below).
3. **`www/map-data.js`** — add the tour data so the map/geocoding knows about it (see "Tour map / geocoding" below).

Note: if the flyer is an image, the schedule may need to be read from the file. OCR (`tesseract`) can extract the text if the schedule can't be viewed directly.

## File structure

| File | Purpose |
|------|---------|
| `www/index.html` | Home page (logo, tagline, slideshow background). |
| `www/shows.html` | Shows/tour dates page. Each tour = one `.show-entry` block. |
| `www/gallery.html` | Photo gallery grid + fullscreen viewer (pan/zoom/pinch). |
| `www/map.html` | Leaflet tour map. Loaded with `?tour=<id>`. Geocodes each show and draws a driving route. |
| `www/map-data.js` | `tours` array — the single source of truth for tour dates used by the map. |
| `www/script.js` | Shared: background slideshow (Ken Burns + transition effects), mobile menu, noise overlays, anti burn-in pixel shift. |
| `www/style.css` | All styling. Pages reference it with a cache-buster query, e.g. `style.css?v=6`. |
| `www/Flyers/` | Show/tour flyer images (`.jpg`). |
| `www/TRSH-Gallery/` | Gallery photos. |
| `www/Logo/` | Brand/logo assets. |

## Shows page (`www/shows.html`)

Each tour is a `<div class="show-entry" data-tour="<id>">` block containing:

- One or more `<img class="flyer-thumb" data-flyer>` pointing into `www/Flyers/`. Clicking a thumb opens the full-size lightbox.
- A `<div class="shows-list">` of `<div class="show-item">` rows. Each row has exactly three spans:
  - `<span class="show-date">` — date as `M.D` (e.g. `11.4`). **Always two digits per part.** The status logic parses this as month/day in **year 2026**.
  - `<span class="show-venue">` — venue name.
  - `<span class="show-location">` — `City, ST` (e.g. `St. Louis, MO`).
- A `.eye-icon-wrap` with an eye SVG. Clicking it navigates to `map.html?tour=<id>` (the map/geocoding entry point). **Every show-entry must include one.**

Tour blocks are separated by `<div class="show-divider">` and ordered chronologically down the page.

### Date status (past / present / future)

The inline script in `www/shows.html` (and the same logic in `www/map.html`) runs `getShowStatus(dateStr)`. It treats all dates as year 2026 and colors dates:
- **past** = red (`show-date--past`, `#ff4455`)
- **today (present)** = cyan (`show-date--present`, `#00e5ff`)
- **future** = green (default, `#4ade80`)

The `--past` class is applied via the CSS/JS — the raw HTML only carries the plain `show-date` class; the script decides the color at runtime.

## Tour map / geocoding (`www/map.html` + `www/map-data.js`)

- `www/map-data.js` exports a global `tours` array. Each tour object:
  ```js
  {
    id: 'gone-fishin',                 // matches data-tour in shows.html
    name: 'Gone Fishin Tour',          // shown in the map header/sidebar
    flyer: 'Flyers/Gone Fishin Tour - 2026.jpg',  // shown in map sidebar
    dates: [
      { date: '11.4', venue: 'Wave', city: 'Wichita', state: 'KS' },
      ...
    ],
    start: { city: 'Springfield', state: 'MO' },  // home base (route start & end)
  }
  ```
- `map.html?tour=<id>` looks up the tour, then:
  1. **Geocoding**: builds a `query` per stop as `"<city>, <state>"` (start/end are Springfield, MO) and calls the Nominatim API (`https://nominatim.openstreetmap.org/search`). Rate-limited with an 800ms delay between calls. Results are cached in `localStorage` under `geo_<query>`.
  2. **Routing**: once all stops have coords, requests driving directions from OSRM (`https://router.project-osrm.org/route/v1/driving/...`), chunked at 25 waypoints. Cached under `osrm_<tourId>_<hash>`.
  3. **Rendering**: Leaflet + CARTO dark tiles. Markers are colored by show status (green/cyan/red); start/end are amber/orange. A red polyline traces the route, with a distance/time readout. Sidebar lists every stop; clicking one highlights it and flies the map.
- The whole map (locations + route) is cached in `localStorage` under `tourmap_<id>`, keyed by a content hash (`hashTourData`) so edits to `www/map-data.js` automatically invalidate the cache.

### Adding a new tour to the map
Append a new object to the `tours` array in `www/map-data.js` with a unique `id`, the flyer path, all `dates`, and the Springfield `start`. No other map code changes are needed.

## Flyers

- All flyers live in `www/Flyers/` and are referenced as `Flyers/<filename>` (case-sensitive paths, spaces allowed).
- Filenames are the display identity — e.g. `FreeThrow MBtW Tour 2026.jpg`, `Gone Fishin Tour - 2026.jpg`. Keep naming consistent (`<Tour Name> [Year].jpg`).
- A flyer is used in up to three places: the shows page thumbnail (lightbox on click), the map sidebar header image, and as the `<img data-flyer>` source.

## Gallery (`www/gallery.html` + `www/script.js`)

- `www/gallery.html` holds its own inline `images` array listing `TRSH-Gallery/...` files.
- `www/script.js` holds the same list (used by the home/shows background slideshow). **If you add/remove gallery photos, update both lists.**

## Conventions

- No comments in code unless explicitly asked.
- Keep hard-coded data in sync between `www/shows.html` and `www/map-data.js` (and the gallery image lists).
- Dates are formatted `M.D` with zero-padded months/days, interpreted as year 2026.
- CSS/JS assets use query-string cache busters (`style.css?v=N`) — bump `N` after editing styles.
- Maps depend on public API limits (Nominatim 1 req/sec, OSRM). localStorage caching exists to avoid hammering them.

## Sync rule

Whenever changes are made to the project, the agent/AI must explicitly ask the user which locations should be updated or synced (e.g., Gitea repo, backup folder, local project) before performing any sync or push.
