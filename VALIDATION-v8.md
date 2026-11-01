# v8 observed validation
Chromium, 440×956 mobile/touch viewport, software WebGL; not physical Safari/iPhone.

- Full inherited smoke suite passes: used-car sales, orders, purchasing, training, upgrades, fractional XP/save reload, offline income, management taps, offline reload and second-tab ownership.
- Actual v7 HTML + v7-style active SW upgraded to v8 on the same origin. Waiting button appeared; clicking saved and activated the installed v8 worker, then reloaded.
- Seeded money $345,678 and XP 25.75 survived upgrade and offline reload. Second tab was read-only. Hidden/visible events completed without JS errors.
- Observed caches after migration: v7 plus current v8; cleanup deliberately retains one previous cache. No save keys were removed.
- v7 CSS is extracted unchanged. Game source is preserved and concatenated in the original order, except relocating the hoisted save function and adding one update lifecycle listener.
- Build is deterministic; no external runtime CDN.
- The original gameplay/visual limitations of v7 remain. No claim of exhaustive gameplay coverage, physical Safari cache validation, iPhone FPS or OS process-termination testing.
