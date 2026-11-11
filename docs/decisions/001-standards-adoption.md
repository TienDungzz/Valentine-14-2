# ADR-001 — Áp dụng example-standards

Ngày: 10/11/2026. Trạng thái: triển khai theo yêu cầu người dùng chuẩn hóa dự án bằng bộ mẫu. Không tự xác nhận nghiệm thu sản phẩm.

## Quyết định

Chuyển script/ thành scripts/, chuyển toàn bộ test vào tests/, đưa tài liệu sản phẩm cũ vào docs/product/. Giữ example-standards nguyên trạng. Áp dụng checker/config/ESLint/CSS policy và regression tests của mẫu; bổ sung gate riêng cho Valentine và Blender.

Giữ ES modules + Vite + Three.js và native DOM. Không dựng backend/React/theme/i18n khi không nằm trong phạm vi sản phẩm. Profile công bố đường dẫn thật, không thêm thư mục rỗng. Giới hạn vẫn là 60 dòng, không tăng hoặc suppress rule.

Tách các trách nhiệm scene lifecycle, environment construction và gift construction thành hàm nhỏ. Tokenize CSS nhưng giữ giá trị cũ. Hình chocolate gắn ID thay vì vị trí mảng; character manifest từ chối thiếu/trùng/path không hợp lệ.

## Hệ quả và bằng chứng

Các lệnh script cũ đổi sang scripts; import/test/docs được cập nhật. .gitattributes giữ LF trên Windows/Linux. Check tổng chạy toàn bộ gate thay vì preflight chỉ kiểm hiện diện src/build.

Báo cáo nằm trong .qa/ và không commit; thông tin có ý nghĩa lâu dài được lưu trong docs/3d/performance-report.md và docs/security-review.md. Browser QA chưa thực hiện trong migration này; refactor đạt kiểm tra source không chứng minh hình ảnh runtime không thay đổi.

Người duyệt nghiệp vụ: chủ dự án; review giao diện/animation vẫn đang chờ. Xem lại khi thêm backend, locale/theme mới, chuyển TypeScript hoặc trước phát hành.

## Điều chỉnh phạm vi frontend

Bỏ tài liệu backend, template chung, theme/i18n selector khỏi docs áp dụng; giữ nguồn mẫu ở example-standards. Chỉ khai báo frontend, WebGL và test sản phẩm trong structure. Test công cụ ở tests/tooling và chạy riêng. Check hằng ngày không yêu cầu Python/audit mạng, nhưng giữ các lệnh cần dùng khi sửa pipeline hoặc trước phát hành. Không thay model hoặc hành vi sản phẩm trong bước này.
