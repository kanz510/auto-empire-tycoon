# V12 Living City — Design Specification

Date: 2026-11-01. Platform: offline-capable Three.js r128, landscape-management-only Auto Empire Tycoon on iPhone Safari.

## Intent
Replace the empty grass surrounding Auto Empire Tycoon 3D with an active but lightweight stylized urban environment. Keep the showroom the visual focus; the new world is decorative and does not change buying, selling, NPC decision making, navigation, the saved state, or any player controls.

## Chosen approach
- Construct a separate `living-city-v12` scene group in `src/city-v12.js`.
- A new broad commercial boulevard and pavements occupy world z=-22 (behind the existing showroom at z=-11). A side road, street crossings, small garden areas and street markings make the neighborhood coherent.
- Import a small, curated set of CC0 Kenney City Kit Commercial/Suburban/Roads and Nature models as local `.glb` files; cache and clone their geometry/materials. Do not fetch from CDN at runtime.
- Preserve visibility of the business: main commercial façades stand at z<=-29 or outside x=±32. Avoid physical collision with customer paths or existing garage/test drive/parking.
- Two purely decorative cars move along the new boulevard at low cost. No changes to gameplay traffic or player controls.
- Give street lights and trees reusable, inexpensive geometry/materials; no dynamic point lights or live shadows on distant buildings.
- Build and cache through the existing tools/build.py; isolate broken model loads to visual fallback so business simulation remains playable.

## Done criteria
- On 440×956 and 390×844, real CC0 buildings, trees and road props are visible in the background of an intact showroom.
- At least two ambient visual cars move without changing economic state.
- The new scene contains no userData.key and is not included in pickable hit objects.
- GLB assets are fetched only from this game's own hashed dist paths, offline-capable after precache.
- Baseline visual regression, mobile screenshots, gameplay, save/offline tests all pass. No claim of physical Safari testing.
- Direct fast-forward-only updates to main; keep old dist bundles.
