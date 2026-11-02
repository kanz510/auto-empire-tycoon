# Quy tắc Phát triển & Triển khai Tự động (Auto Build, Test & Push)

Khi thực hiện bất kỳ thay đổi mã nguồn, sửa lỗi hoặc nâng cấp tính năng nào trong dự án:

1. **Chuẩn hóa & Đóng gói (`build`):**
   - Đảm bảo các file mã nguồn sử dụng chuẩn UTF-8 và ký tự xuống dòng LF (`\n`).
   - Luôn chạy `npm run build` để cập nhật gói phân phối trong `dist/`, `index.html`, `release.json` và `sw.js`.

2. **Kiểm thử Tự động Bắt buộc (`test`):**
   - Luôn chạy đầy đủ `npm test` sau khi sửa code để xác minh tất cả các bộ test tự động đều `PASS` (exit code `0`).
   - Dọn dẹp các tệp ảnh chụp tạm thời sinh ra trong quá trình test (`test-results/`, `docs/screenshots/`) và chạy lại `npm run build` nếu cần để giữ mã băm (build hash) đồng nhất với CI.

3. **Tự động Commit & Push lên `main`:**
   - Ngay sau khi `npm test` hoàn tất thành công (100% PASS), tự động thực hiện `git add -A`, `git commit` với thông điệp rõ ràng và `git push origin main` mà không cần chờ người dùng nhắc lại.
