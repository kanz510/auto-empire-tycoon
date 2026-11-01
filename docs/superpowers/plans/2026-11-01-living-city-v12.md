# V12 Living City Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate the empty grass outside the dealership with a compact commercial neighborhood without changing gameplay or saved state.

**Architecture:** New `src/city-v12.js` builds a separate non-interactive group, loads local Kenney GLBs via the existing GLTFLoader, and exports a lightweight `updateV12City(dt)` used by the render simulation. `tools/build.py` includes that file in the deterministic bundle; all imported assets are hashed and precached offline.

**Tech Stack:** Vanilla JS, Three.js r128, Kenney CC0 City Kit, Playwright, Python build, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-01-living-city-v12.md`

## Global Constraints
- Edit and commit directly to `main` without force-push, as the user requested.
- Keep `aet6` and all save/economy, AI paths and player controls unchanged.
- No joystick; preserve original cameras, buttons and UI.
- All new assets must be licensed CC0, locally stored and hash-versioned for offline.
- Test Chromium on 390×844 and 440×956, but do not assert real iPhone Safari testing.

## Review Focus
- Ensure building placement does not intersect showroom/garage, customer traffic, or car display.
- Ensure repeated GLB model clones reuse geometry/materials without per-frame allocations.
- Check visual traffic animation only changes decorative object positions, never S.
- Verify failed or unavailable GLBs leave an intact, playable game.
- Measure load behavior and verify offline-ready local asset paths.

### Task 1: Test first
**Files:** Create `tests/living-city-v12.cjs`.
- [ ] Write a Playwright test asserting city group, imported models, road markers, decorative cars, no keys and no S mutation.
- [ ] Run test against v11.2 to verify RED on missing city.

### Task 2: Import assets and create the city
**Files:** Create `src/city-v12.js`, `assets/city-*.glb`; modify `tools/build.py`, `src/main.js`.
- [ ] Import and record chosen CC0 assets in `docs/ASSET_LICENSES.md`.
- [ ] Build roads/sidewalks/park and place imported GLB façades behind showroom.
- [ ] Make two purely decorative ambient cars animate, with no new save fields.
- [ ] Add city to build and call visual-only tick; npm run build.

### Task 3: Verify and ship
**Files:** `tests/living-city-v12.cjs`, `docs/screenshots/v12-*.png`, `PROGRESS.md`, generated files.
- [ ] Run `npm ci && npx playwright install chromium && npm test`.
- [ ] Capture screenshots 390×844/440×956, validate city framing and quality.
- [ ] Check build reproducibility and generated PWA offline assets.
- [ ] Commit `src/`, assets, `index.html`, `release.json`, `sw.js`, new `dist/` while preserving old dist.
- [ ] Verify GitHub Pages deploy and no force-push.
