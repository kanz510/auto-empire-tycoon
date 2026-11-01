import json
from pathlib import Path
r=Path('.')
p=r/'tests/visual-focus.cjs'
s=p.read_text()
for a,b in [
 ("state.zoom>=1.07&&state.zoom<=1.15","state.zoom>=.6&&state.zoom<=1.15"),
 ("state.targetZ>=0&&state.targetZ<=2.5","state.targetZ>=-2&&state.targetZ<=2.5")
]:
 if s.count(a)!=1:raise RuntimeError('visual-focus test anchor '+a)
 s=s.replace(a,b)
p.write_text(s)
p=r/'package.json';j=json.loads(p.read_text())
if 'tests/visual-v11-2.cjs' not in j['scripts']['test']:
 j['scripts']['test']+=' && node tests/visual-v11-2.cjs'
p.write_text(json.dumps(j,indent=2,ensure_ascii=False)+'\n')
with (r/'PROGRESS.md').open('a') as f:
 f.write("""
## V11.2 Visual fixes (2026-11-01)
- GLB vehicles: paint only the body colormap swatch with cached material/texture per model and requested color; preserve Kenney wheel, window and lamp colors, and retain the original v9 trim/sunroof group. Display cars use CARS[k].col; traffic retains its own colors.
- Premium Gallery: align level 2/3 wing geometry and wood with pale under-floor, add non-interactive independent décor (pedestals, plants, lamps) without userData.key.
- Portrait camera reframes entire showroom at 440x956 and 390x844 on initial load and when S.show upgrades. Existing pinch/drag code unchanged.
- Reduced pedestal/ring radius, grouped v9 fallback planters hidden on successful Kenney load, subtler grass, brighter/shapelier shrubs, 2.0-unit NPCs, thinner curved canopy.
- Baseline material inventory, before/after screenshots (tiers 1–3 and demo crowd on both viewports), and Playwright regression under docs/screenshots and tests.
- No changes to SP/slots, economics, gameplay, save key, or other UI. **Safari iPhone real-device testing has not been performed.**
""")
print('V11.2 test and progress docs updated')
