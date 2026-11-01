# V11 Living Dealership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace boxy NPC visuals with licensed, animated GLB characters while preserving AI gameplay and providing a non-persistent iPhone visual preview.

**Architecture:** Append focused shared-scope modules after `src/assets-3d.js`. `characters-v11.js` wraps `person` and `anim` while retaining procedural fallback, AI root identity and dot markers. `preview-v11.js` adds a query-gated visual-only overlay, `showroom-v11.js` adds lightweight sculpted architecture. Versioned assets and vendored SkeletonUtils are delivered via existing deterministic build and Service Worker.

**Tech Stack:** Three.js r128, GLTFLoader r128, SkeletonUtils r128, Kenney Mini Characters CC0 GLBs, Playwright Chromium, GitHub Pages.

**Spec:** User-approved V11 Living Dealership direction in conversation: animated characters, improved showroom, visual sandbox on iPhone; direct commits to `main`, no branch or PR.

## Global Constraints
- No joystick, no direct character controls.
- Do not alter `S`, localStorage keys, save schema, sales or employee AI to implement preview visuals.
- GLB and JS dependencies must be same-origin and offline-cacheable; retain procedural fallback.
- Preserve existing click targets and staff/VIP markers when upgrading visuals.
- Test with Chromium/mobile, but do not claim real-device Safari coverage.

## Review Focus
- Late asset loads should replace only living actors.
- Broken GLB / absent SkeletonUtils must leave a playable procedural fallback.
- Preview tier controls must not change saved showroom upgrades or money.
- Animation transitions must follow existing `mv` and `act` flags without changing AI paths.
- Repeated demo crowd toggles must not leave orphaned actors.

### Task 1: Browser regression first
**Files:** `tests/characters-v11.cjs`, `package.json`.
- [x] Write new browser regression and wire to `npm test`.
- [x] Confirm test fails on missing `CHARACTERS_V11`.

### Task 2: Licensed character visuals
**Files:** `src/characters-v11.js`, `assets/kenney-npc-*.glb`, `vendor/SkeletonUtils-r128.js`, `docs/ASSET_LICENSES.md`.
- [ ] Load each rigged model once; derive actions idle/walk/interact-right.
- [ ] Use SkeletonUtils clones per NPC and retain root/procedural fallback.
- [ ] Verify sprite replacement and animation with Playwright.

### Task 3: Visual-only preview & showroom
**Files:** `src/preview-v11.js`, `src/showroom-v11.js`, `src/main.js`, `src/boot.js`, `tools/build.py`.
- [ ] Add preview panel at `?preview=1` for showroom tiers and crowd, without save changes.
- [ ] Add lightweight curved facade and locally generated sign.
- [ ] Rebuild hashed assets and recheck Service Worker offline.

### Task 4: Release & verify
- [ ] Full `npm test` and reproducible-build GitHub Action 0 failures.
- [ ] Inspect Chromium screenshot on a phone viewport; repair framing if needed.
- [ ] Confirm `main` Pages deploy and publish preview link for user Safari check.
