# v6 validation — 2026-11-01

Actual Chromium with software WebGL, mobile/touch viewport 440×956. This is not Safari or physical iPhone hardware.

Passed:
- Embedded script syntax and committed smoke suite: purchases deduct the live import price, upgrades, paid training completes and survives reload, offline credit occurs once, per-model pricing controls and live management buttons respond to touch.
- Offline reopening after service-worker installation: network disabled and page reloaded successfully.
- Legacy v5 migration retains levels, staff, cars and sold count; old aet5 remains unchanged. Garage escrow is refunded; mission rewards may be applied during startup.
- A customer's quoted price remains locked when prices/reputation change. Test-drive bonus remains 3%.
- A second v6 tab cannot save over the live owner.
- Controlled hidden-document timer test for 11 seconds preserves the saved $600/min rate. After a simulated 120-second absence plus the wait, resuming credits $655 once. This tests the timer/visibility handlers, not iOS process suspension.
- Separate accelerated 3,600-second logic run in Chromium: sold counter 367 including 20 seeded legacy sales, 193 test drives, 96 garage jobs, no orphan reservations or runtime errors. This is a simulation, not an hour of real play.
- HTML payload in the GitHub blob matches the locally tested file byte for byte.

The category ledger starts in v6; inherited v5 aggregate profit is retained. Expense history covers advertising/training. Construction and inventory are capital investment rather than operating expenses. Offline uses 50% of the recent profit rate, capped at two hours, without consuming physical showroom cars.

Not verified: physical iPhone 16 Pro Max FPS, thermal/battery behavior, Safari storage limits, opening HTML through iOS Files, real audio output, long-term multi-day balance, or all possible OS termination/clock-change cases. Software-rendered FPS is not a prediction of phone performance.

Continuous real-time session completed: **606.608 seconds**, 20 samples, **no JavaScript errors**, negative money or orphan reservations. Final counters: 40 cars, 16 test drives, 13 garage jobs (the setup seeds funds/upgrades and sets a sold count for the offline test). Geometry count stabilized at 125 after warm-up; final draw calls 264. These figures are not a memory-leak proof or physical-device FPS result. A separate final smoke test also confirms fractional legacy XP (25.75) survives reload.

The long session covers the final gameplay loop. The fractional-XP load normalization and app-icon cache addition were validated separately by the final smoke suite. iOS/Safari and a physical iPhone remain untested.
