# Auto Empire Tycoon — bàn giao visual-focus

- Nền tảng v8, chỉ quản lý tự động. Giữ nguyên save aet6 và offline.
- Main gốc: 42b73d4. Mười ba file dở dang của phiên Codex khác chưa push không truy cập được.
- Thay đổi: camera portrait focus (zoom 1.4), cảnh quan ngoài showroom bằng InstancedMesh và cờ trang trí.
- Kiểm thử tests/visual-focus.cjs + npm test; Safari iPhone thật chưa xác minh.
- Khi Codex cũ tiếp tục, đồng bộ main mới và hợp nhất thay đổi, tuyệt đối không force-push.

## V9 · Showroom Alive (2026-11-01)
- Thêm src/visual-v9.js vào build: kiến trúc showroom, bục đèn, trang trí theo cấp 2/3, gói chi tiết xe dạng InstancedMesh, xe giao hàng trang trí khi nhập kho.
- Không thay logic mua/bán, không sửa save key, không thêm API hay phụ thuộc mạng. UI vẫn quản lý tự động, không joystick.
- tests/showroom-alive.cjs kiểm tra hiệu ứng 3D, kích hoạt xe giao hàng, kinh tế giữ nguyên, các cấp nâng cấp và UI mobile.
- Tên hiển thị v9, mã nguồn nhiều file được giữ nguyên. Chưa test iPhone Safari thật.

## V10 · Kenney GLB Asset Remaster (2026-11-01)
- Tích hợp CC0 Kenney Cars (hatch/sedan/SUV/sport), xe giao hàng, sofa, bàn kính, chậu cây và bụi cây; thay mô hình hộp bằng GLB khi tải xong, có procedural fallback.
- GLTFLoader r128 lưu nội bộ, build tự hash .glb và precache cùng bundle khi offline; xem docs/ASSET_LICENSES.md.
- Không đổi logic giao dịch, save aet6, AI hay joystick. Chỉ chỉnh quay bánh xe GLB khi di chuyển.
- Tests: asset-models.cjs, showroom-alive.cjs, smoke/visual-focus/polish; chưa test Safari vật lý.
- Các asset và GLTF loader phải được phục vụ từ GitHub Pages, không phụ thuộc CDN.

## V11 · Living Dealership (2026-11-01)
- Replace procedural person visuals with locally bundled Kenney Mini Characters GLBs, including embedded idle/walk/interact-right animations (SkeletonUtils clone, AnimationMixer); procedural fallback retained.
- Decorative curved canopy, locally generated premium storefront sign, plus mobile-only visual demo at ?preview=1. Demo changes no S/localStorage/save data and resets visual tiers on exit.
- New regression: tests/characters-v11.cjs; title test updated. Build now bundles SkeletonUtils r128 and hashes character GLBs.
- Keep main-only development per owner; still require full GitHub Actions verification and user iPhone Safari check.

## Fix v11.1 (2026-11-01)
- Reset: chặn save() khi đang reset để pagehide không khôi phục tiến trình đã xóa; giữ nguyên save key aet6, aet6-backup, aet5, aet1.
- Tương tác: tìm userData.key từ mesh GLB lên các node cha trước khi mở panel, tránh panel trống/cũ khi chạm nhân viên.
- Đơn đặt xe: chọn ngẫu nhiên từ toàn bộ các loại xe đã mở khóa, gồm sport ở showroom cấp 3.
- Bổ sung tests/fix-v11-1.cjs kiểm tra reset qua reload, chạm GLB, orderCar. Không thay gameplay khác, UI hay cơ chế offline.
- Chưa kiểm thử trực tiếp trên Safari iPhone thật.

## V11.2 Visual fixes (2026-11-01)
- GLB vehicles: paint only the body colormap swatch with cached material/texture per model and requested color; preserve Kenney wheel, window and lamp colors, and retain the original v9 trim/sunroof group. Display cars use CARS[k].col; traffic retains its own colors.
- Premium Gallery: align level 2/3 wing geometry and wood with pale under-floor, add non-interactive independent décor (pedestals, plants, lamps) without userData.key.
- Portrait camera reframes entire showroom at 440x956 and 390x844 on initial load and when S.show upgrades. Existing pinch/drag code unchanged.
- Reduced pedestal/ring radius, grouped v9 fallback planters hidden on successful Kenney load, subtler grass, brighter/shapelier shrubs, 2.0-unit NPCs, thinner curved canopy.
- Baseline material inventory, before/after screenshots (tiers 1–3 and demo crowd on both viewports), and Playwright regression under docs/screenshots and tests.
- No changes to SP/slots, economics, gameplay, save key, or other UI. **Safari iPhone real-device testing has not been performed.**

## V12 · Living City (2026-11-01)
- New `src/city-v12.js` renders a separate decorative town around the dealership: behind-showroom avenue, pavements, road markings/crossings, a garden square and side street.
- Imported nine local CC0 Kenney GLBs (commercial facades, suburban house, trees, road lights and traffic signals), with geometry/material cloning and visual fallback on failed downloads.
- Two background cars move only as scenery, not added to gameplay traffic[] or save state. No changes to customer routes, money, inventory, save key aet6, UI or joystick controls.
- `tests/living-city-v12.cjs` verifies 390×844 / 440×956, non-interactivity, no economic mutation and same-origin asset paths.
- New hashed assets are precached by the existing PWA builder. Visual screenshots are stored in `docs/screenshots/`.
- **Safari on a physical iPhone has not been tested**; user can verify the published main deployment.

## V12.1 Premium Lighting & Vehicle Materials (2026-11-02)
- Renderer: retained Three.js r128 sRGB output and PCFSoftShadowMap, enabled ACES Filmic Tone Mapping with exposure 1.15. Quality 'eco' still disables shadows by existing user preference.
- Car paint: physical clearcoat (1.0, roughness 0.04) using MeshPhysicalMaterial for the GLB body with the V11.2 per-color colormap clone, no loss of wheels, lamp atlas, trim or showroom colors. Distinct glass/chrome meshes, if present in future GLBs, receive corresponding cached materials.
- Kenney current car body includes windows in the same atlas and has no standalone glass mesh. Physical transmission cannot be applied separately to those windows without splitting geometry; dark mapped windows remain visually intact.
- Existing showroom floor is in src/graphics.js rather than showroom-v11.js. Set mapped floor roughness 0.22, metalness 0.12, envMapIntensity 1.0. No environment map provided, so this is a specular floor, not a true mirror/reflection renderer.
- Added tests/physical-polish-v12.cjs to assert ACES/soft shadows, physical body materials, distinct car paint colors, wheel/map preservation, and save-safe changes in Chromium 440x956 / 390x844.
- No gameplay, income, customer AI, save key, or player UI changes. Real iPhone Safari remains untested.

## V13 Grand Dealership (2026-11-02)
- New `src/grand-v13.js` renders an independently grouped, tier-aware flagship showroom architecture.
- Level 1: entrance forecourt, planters and small illuminated pillars.
- Level 2: broad canopy, glass front, gold trim, entrance walkway and aligned Premium Gallery extension.
- Level 3: rooftop crown, signature arch, flagship gallery roof, rooftop gardens and subtly animated emblem.
- Tier architecture is strictly decorative: no hit keys, changes to customer routes, slot positions, economy, save schema, staff, controls or UI. Existing V12 city remains.
- `tests/grand-dealership-v13.cjs` checks all three tiers, economic state preservation and 390×844 / 440×956 screenshot capture.
- Physical Safari iPhone has not been tested.
