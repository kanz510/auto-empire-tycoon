# Mobile management polish
Authorized goal: use actually callable integrations to improve the game, keep saved progress/offline/idle management, and push main only after passing tests.

Chosen bounded approach: keep Three.js r128 and the original save/cache implementation, use an editable Figma management reference, use a locally cached Canva floor texture, and fix ready-order fulfillment priority. A large engine rewrite or external runtime APIs would add risk and are outside this pass.

Deliverables:
- Preserve all existing v8 controls and economy formulas; show net profit and waiting customers as management summary cards.
- Fulfill a ready warehouse order before moving a newly purchased car onto an empty display.
- Reuse box geometries, avoid per-frame camera-vector allocation, and load the small Canva floor tile once into the existing GPU floor texture. Leave the original checkerboard as failure fallback.
- Hash/cache the image in the existing build pipeline so offline reopening needs no Canva/Figma API.
- Record real plugin availability, actual asset provenance and observed tests. Never import the abandoned ownership/cache rewrite.

Constraints: no joystick/character controls, no save-key migration, no new paid runtime API, no physical iPhone FPS claims.
