# Bảo mật và dữ liệu — Valentine Red

## Phạm vi

Không tài khoản, camera, microphone, upload hoặc backend trong bản đầu. Lời nhắn trong frontend có thể đọc bởi người truy cập URL; không đưa dữ liệu nhạy cảm/secret vào bundle. Tiến độ trong RAM; chỉ thiết lập motion có thể lưu localStorage.

Không thêm analytics/gửi tương tác bên thứ ba ngoài phạm vi. Font/asset ưu tiên cùng nguồn, ghi giấy phép.

## Nội dung và dependency

Render lời nhắn dạng text, không HTML chưa kiểm soát. Validate schema/manifest/ID; URL asset do dự án quản lý, không tải URL tùy ý qua query. Lỗi không lộ stack, đường dẫn nội bộ hoặc credential.

Khi có app, khóa phiên bản dependency bằng lockfile và rà soát trước phát hành. Không đưa .env, token, .blend, script nội bộ, .qa vào artifact. Website không chứa địa chỉ/kênh điều khiển MCP Blender.

## Hosting

HTTPS; CSP theo loader/decoder/font thật, tránh wildcard rộng. Nếu worker/blob cần cho decoder phải ghi lý do và test. X-Content-Type-Options nosniff, Referrer-Policy phù hợp, frame-ancestors theo chính sách nhúng; Permissions-Policy chặn camera/microphone vì không dùng. HSTS theo domain kiểm soát được.

Kiểm MIME GLB/texture/JS, CORS đúng nguồn. Header không được chặn decoder/WebGL/fallback. Đây là yêu cầu triển khai, chưa khẳng định hosting đã cấu hình.

## Storage

Parse bằng schema version/allowlist và try/catch; lỗi không cản trải nghiệm. Không đọc/migrate key của dự án khác. Không lưu tiến độ dài hạn nếu chưa cập nhật phạm vi.
