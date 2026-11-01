# Auto Empire Tycoon 3D v6

Play: https://kanz510.github.io/auto-empire-tycoon/

Idle dealership management. No character controls, paid APIs, or runtime CDN dependencies. Three.js r128 and its MIT license remain embedded in index.html.

## v6
- Per-model price controls (85–120%), 10-minute market cycles with price/cost/demand changes, preference-weighted customers and locked quotes.
- Weighted inventory cost basis persisted on display vehicles; consignment pays only the margin.
- Twelve training levels, 30 seconds each, with growing costs and persistent progress.
- Profit by sales, garage, test drives and offline earnings; operating expenses and rolling 24-hour net profit.
- Recoverable v6 save snapshots, legacy v5/v1 migration without deleting their keys; ownership guard prevents another v6 tab from overwriting a live save.
- Chrome trim and rotating wheels, character eyes, showroom framing/lounge/brand signage, corrected material color space; geometry instancing and shared caches.
- Adaptive resolution plus Eco/High modes, 44px touch targets and stable live panel controls.
- Service worker caches the game for offline reopening after the first successful online visit. The HTML also contains the complete game for direct file use; service workers require HTTPS/localhost.

## Save compatibility
Use the same browser and site origin to retain localStorage. Renaming files on the same GitHub Pages origin does not change the save namespace. Changing domains/devices does not transfer saves automatically. Keep the original browser data. If storage is denied or full the game reports failure; do not assume the session is saved.

Income uses the saved rolling profit rate, 50% efficiency and a two-hour cap. A garage job interrupted by reload refunds its escrow. Active customer routes restart after reload, while cars, cost basis and money persist. Old v5 totals are retained; detailed category/history metrics begin in v6.

## Tests
Node.js 20+:
```sh
npm install
npx playwright install chromium
npm test
SOAK_SECONDS=600 npm test
```
For a system browser set BROWSER_BIN. Tests serve only the game assets on loopback and verify money, training, persistence, offline recovery, touch menus and two-tab protection. See VALIDATION.md for observed results and limits.

## v7
Adds an automatic used-car desk ($1800 purchase, $2600 resale after 40 seconds), up to three customer orders (45 seconds then warehouse fulfillment), near-budget negotiation and a visible premium showroom wing. Redesigned management panels and additional car/body/character details. Existing v6 save keys and all v6 management systems retained.

Limits: used-car inspection is a simplified fixed-margin workflow; orders are requested through the inventory panel; the premium wing is visual and existing display capacity remains governed by showroom level. Physical iPhone/Safari performance has not been verified.
