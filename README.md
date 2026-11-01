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

## Mobile polish and verified integrations
This small follow-up uses an editable Figma management reference and a 200×200 Canva-generated limestone tile, stored locally and copied to a content-addressed PNG. The game does not call those providers at runtime. Native system typography is retained; the Figma prototype uses Inter because its SF Pro renderer returned zero-width glyphs.

Ready orders now consume newly imported warehouse stock before empty display slots. Price formulas, timers, save names, offline calculations and automatic management remain unchanged. Same-size static box meshes share geometry; the camera offset is reused rather than allocated each frame.

See PLUGIN-VALIDATION.md for provenance, availability and observed browser checks. The canceled cache/session rewrite is not included in this release.

## V10 art upgrade
Five Kenney vehicle GLBs and four prop GLBs ship locally and are cache-versioned in the service worker. The r128 GLTFLoader is vendored alongside Three.js; procedural cars remain the fail-safe if a GLB cannot load. All assets are from Kenney CC0 packs; see [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md). No save migration or gameplay input change.

## V11 Living Dealership
Animated CC0 Mini Characters are loaded on demand from local, content-hashed GLB files and cloned with the vendored Three.js r128 SkeletonUtils. Use `?preview=1` to open the **TEST CẢNH** panel, cycle the three visual showroom tiers and display extra NPCs without modifying saved money, staff, progress or upgrades. `Cảnh thật` clears preview actors and restores the real level. The original procedural people remain as a graceful fallback if optional assets fail.

## V12 Living City
An entirely decorative urban neighborhood now surrounds the dealership: local CC0 Kenney commercial/suburban GLBs, boulevard, sidewalks, garden, street furniture, and two background traffic cars. No gameplay or save migration, and existing management-only controls remain unchanged. City assets are local/offline-cached and shared on model clones. See `docs/ASSET_LICENSES.md` and `docs/screenshots/v12-*.png` for sources and phone viewport screenshots.
