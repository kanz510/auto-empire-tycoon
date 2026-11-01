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
