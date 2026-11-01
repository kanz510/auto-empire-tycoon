# Mobile Management Polish Implementation Plan
> **For agentic workers:** Execute inline with superpowers:executing-plans and TDD; user has authorized autonomous implementation/testing and direct-main publication after tests.

**Goal:** Ship a narrow management/visual/performance improvement using verified plugins.
**Architecture:** Existing ordered-source build and same save fields. A content-addressed local PNG is passed to graphics via generated ART mapping.
**Tech Stack:** HTML/CSS, Three.js r128, Python build, Playwright.
**Spec:** docs/superpowers/specs/2026-11-01-mobile-polish-design.md

## Global constraints
Keep save/offline/idle management; no canceled cache/session rewrite; no runtime external APIs.

## Review focus
- A ready order with exactly one imported car and empty displays must be delivered.
- A non-ready order must retain its wait time.
- Texture network failure must leave a playable scene.
- Offline reopening must include the local image.
- Summary cards must fit a 440px mobile panel and preserve all controls.

## Task 1: Fulfillment priority
- [x] Write a browser test: ready hatch order, empty display, buy exactly one hatch; order disappears and sold count increments.
- [x] Observe failure against main.
- [x] In src/economy.js invoke existing updateOrders(0) before fillSlots() after stock purchase.
- [x] Verify ready-order and non-ready-order cases.

## Task 2: Management and render polish
- [x] Browser checks: menu has net-profit and queue cards, actual labels remain readable at 440px; floor image loads; same-size boxes reuse geometry.
- [x] Observe failures against main.
- [x] Add cards in src/ui.js and responsive styles matching Figma; add shared geometry cache in src/graphics.js and a constant camera offset.
- [x] Build a hashed floor PNG mapping/precache in tools/build.py; draw it once into the existing floor canvas, retaining fallback.

## Task 3: Verification and publication
- [x] Run focused browser regression, project npm test, offline reload, and deterministic build checks; inspect mobile screenshots.
- [x] Review diff independently, preserve unrelated/canceled changes, document plugin status and limitations.
- [x] Commit/push main only after all checks pass; check Actions and deployed asset URLs.

Review: no Critical/Important production findings. Test fixture explicitly saves seeded profit and pauses the frame loop for an exact XP snapshot. Physical iPhone/Safari and deliberate texture-failure injection remain outside the observed checks.
