# Đánh giá bảo mật — Valentine Red

Ngày rà soát: 10/11/2026. Chủ sở hữu và người quyết định phát hành: người duy trì repository. Chưa nghiệm thu bảo mật triển khai.

## Dữ liệu và trust boundary

14 lời nhắn là nội dung công khai trong bundle, không phải dữ liệu mật. readIds chỉ ở RAM, motion preference lưu localStorage với version/allowlist và xử lý lỗi. Không có tài khoản, upload, payment, backend API hoặc telemetry.

Boundary: browser tải artifact tĩnh do dự án build; content/GLB do tác giả quản lý. Không nhận URL asset từ query người xem. Manifest công cụ phải đúng hai nhân vật, có byte/clip hợp lệ, URL nằm trong public/models/characters và không đi qua symlink/ra ngoài root.

## Kiểm soát và gate

- Tests từ chối ID/nội dung trùng, manifest rỗng/thiếu/trùng/path traversal và storage sai/hỏng.
- Secret scan giới hạn các mẫu credential có độ tin cậy cao trong source text do dự án sở hữu. Không scan lịch sử Git hoặc binary; không coi là chứng nhận không có secret.
- ESLint cấm eval, implied eval, Function constructor và script URL trong phạm vi JS, kết hợp unused rules. Đây là SAST giới hạn, không thay phân tích XSS/dataflow toàn diện.
- Dependency audit dùng npm audit --audit-level=high, bao gồm runtime/dev; lỗi mạng/scanner làm gate thất bại. Không dùng npm audit fix --force hoặc downgrade ngoài mẫu để che cảnh báo.
- Chỉ thực thi quality.commands của repo đã tin cậy. Child process có timeout 5 phút theo mẫu; không đưa nội dung người xem vào shell command.

## Finding đang theo dõi

Audit ngày 10/11 ghi nhận GHSA-g3hv-75wg-m249: minimatch 10.2.6 qua @eslint/config-array/ESLint 10.14.0, mức Moderate (3 package trong advisory tree). Đây là công cụ dev với glob repo đáng tin cậy, không ở runtime website. Giữ phiên bản ESLint đúng mẫu; policy chặn High/Critical, không đánh dấu Moderate là đã sửa. Chủ dự án review lại trước 24/11/2026 hoặc khi có bản tương thích. Không tự coi đây là ngoại lệ đã được người dùng phê duyệt cho finding High/Critical.

## Chưa áp dụng và chưa kiểm

Auth/role/object/tenant/session/rate-limit/queue không áp dụng cho website tĩnh này. Hosting chưa chọn nên HTTPS/CSP/cache/security headers và origin protection chưa kiểm. Khi deploy phải đánh giá theo docs/security/README.md và hồ sơ sản phẩm.

Chưa có DAST/pentest, browser security review, history/binary secret scan hoặc kiểm chứng nguồn license độc lập. Nếu phát hiện secret thật: thu hồi tại provider, giữ bằng chứng theo quyền, thay credential và review lịch sử; không chỉ xóa file rồi báo đạt.

## Luồng kiểm tra sau tinh gọn

Validation/manifest/preferences được kiểm trong npm test sản phẩm. Audit và secret scan là lệnh riêng khi đổi dependency hoặc trước phát hành; không còn gate security-tests trùng với test sản phẩm hoặc SAST trùng lint. Lint vẫn giữ các rule cấm API thực thi code nguy hiểm. Không coi việc bỏ gate trùng là đã giải quyết các finding/giới hạn nêu trên.
