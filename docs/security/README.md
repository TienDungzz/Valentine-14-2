# Bảo mật frontend Valentine Red

## Dữ liệu

14 lời nhắn nằm trong bundle và là dữ liệu công khai với người truy cập website. Không đặt thông tin nhạy cảm/secret trong content hoặc biến môi trường frontend. Tiến độ ở RAM, motion preference lưu localStorage theo version/allowlist; JSON sai hoặc storage bị chặn không làm khóa trải nghiệm.

Website không có auth, database, upload, payment hoặc API server. Không áp dụng checklist session/tenant/queue/rate limiter cho những thành phần không tồn tại.

## Điểm cần bảo vệ

- Nội dung lời nhắn render bằng textContent. Markup/icon nội bộ chỉ lấy từ source do tác giả kiểm soát; không đưa query người xem vào innerHTML hoặc shell.
- Không nhận URL model tùy ý qua query. Manifest phải đúng hai nhân vật, ID/URL/clip/bytes hợp lệ; path không thoát public/runtime roots hoặc qua symlink.
- Giữ lockfile và review script/dependency thay đổi. Không đưa .blend, .qa, công cụ tác giả, token hoặc .env vào dist/.
- CSP/HTTPS/cache và header phải kiểm trên hosting khi phát hành; hiện chưa có môi trường public để xác nhận.

## Kiểm tra phù hợp

npm test có các trường hợp từ chối dữ liệu/manifest/storage không hợp lệ. ESLint kiểm unused và một số API thực thi code nguy hiểm; không gọi kết quả này là SAST toàn diện.

Chạy npm run audit khi đổi dependency và trước phát hành; lỗi mạng không tính là đạt. npm run check:secrets chỉ tìm mẫu credential trong owned text source, không thay review history/binary. Không tạo gate auth/load server giả.

Finding và giới hạn hiện tại theo [đánh giá bảo mật](../security-review.md). Nếu có secret thật: thu hồi tại provider, review lịch sử/ảnh hưởng và thay credential; không chỉ xóa file.
