# Auto Empire Tycoon — v8 delivery architecture

Play: https://kanz510.github.io/auto-empire-tycoon/

V8 changes packaging and updates only. The v7 CSS, UI, 3D renderer and game rules remain intact. The one new UI element is a waiting-release “Cập nhật game” button.

## Source layout
- src/models.js and graphics.js: original geometry, materials, scene and camera
- src/ai.js: original customers, staff and garage behavior
- src/gameplay.js and main.js: original inventory, missions, simulation and lifecycle
- src/economy.js: original transactions and income
- src/save-state.js: original state/compatibility and persistence
- src/ui.js: original management panels
- src/lifecycle.js: save-before-update bridge
- src/boot.js: delivery, release discovery and update button
- styles/game.css: byte-for-byte v7 stylesheet
- assets/: app metadata/icon; vendor/: embedded Three.js r128 extracted with its license

These are ordered source modules, compiled into a shared-scope classic bundle. This deliberately preserves v7 lexical scope, function hoisting and behavior; they are not independently imported ES modules. Runtime loads vendor once, CSS once and one game bundle, avoiding eight module network round trips.

## Build/version
Run `npm run build` (Python 3, no package install needed for building). The build ID hashes source, styles, vendor, assets and build tooling. It is automatically derived, not a manually edited v8 number. CSS/game/icon/manifest filenames are content addressed; the vendor URL includes its content hash. The generated index embeds the exact release mapping.

Commit source **and generated** index.html, release.json, sw.js and dist/. The workflow checks these are reproducible. Old immutable dist files are retained intentionally: stale CDN HTML must still be able to request its original bundle. They can be archived only after the supported stale-client period. Build identity does not use the resulting commit SHA, avoiding a self-referential commit hash.

## Updates, GitHub Pages and offline
The shell embeds its bundle URLs so it can boot even when release discovery is offline. It requests release.json with a unique URL/no-store; the SW never serves a stale online release response. SW URLs contain the build ID, bypassing the GitHub Pages CDN's stable-URL TTL. Registration uses updateViaCache:none and checks again each minute and on visibility return.

Installation precaches the complete release and fails without replacing the active worker if any asset fails. New workers wait for approval; the button first calls the existing save function. A failed save cancels the reload. Activation happens only after approval, and only the requesting tab reloads. Other tabs retain the existing owner protection.

The active SW serves assets from its own cache, and navigation uses the shell belonging to its active release; a new shell is adopted only after approved activation. Activation keeps the current cache and one previous application cache, removing older application caches only. It never deletes localStorage, unrelated caches or player saves. Existing aet6/aet6-backup/aet5/aet1 names and migration logic are unchanged.

First successful online installation is required for offline reopening. Storage eviction by iOS or private-browsing restrictions cannot be prevented. HTTPS/localhost is required; modular v8 is no longer a directly opened single-file HTML.

## Tests
`npm install && npx playwright install chromium && npm test`.
Optional `BROWSER_BIN=/usr/bin/chromium`, `SOAK_SECONDS=600`.
See VALIDATION-v8.md. Physical Safari/iPhone testing remains necessary for platform-specific storage/termination behavior.
