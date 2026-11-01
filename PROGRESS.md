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
