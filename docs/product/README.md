# Valentine Red — Tài liệu dự án

## Định hướng

**2 người · 2 nửa trái tim · 14 miếng chocolate đen · 14 lời nhắn khác nhau.** Mỗi người giữ một nửa hộp có 7 miếng; hai nửa ghép thành một trái tim hoàn chỉnh.

Bối cảnh: khu vườn sân thượng lúc chạng vạng. Website dùng **sân khấu trung tâm**: tiêu đề căn giữa phía trên, khung 3D lớn ở giữa, lời dẫn và CTA phía dưới. Logo góc trên trái, thiết lập góc trên phải; không có thanh header ngang.

## Hiện trạng

Đã có bản ứng dụng local Vite/Three.js, hai nhân vật chỉnh trang phục/hoạt cảnh, GLB tối ưu, dữ liệu 14 lời nhắn và bộ checker/test. Chưa triển khai hosting hoặc xác minh UI/hiệu năng trên trình duyệt. Xem [trạng thái và giới hạn](implementation-status.md) để phân biệt kết quả thực tế với mục tiêu trong đặc tả.

Toàn bộ docs hiện dành cho Valentine Red, thay thế yêu cầu dự án trước. Người dùng cho phép dùng MCP Blender để sản xuất tài nguyên. Đã dùng MCP Blender chỉnh bản sao model, bake animation và render ảnh tham khảo; giữ nguyên hai master.

## Kiểm tra tự động

Chạy `npm run check`, `npm test` và `npm run build` sau `npm ci` (PowerShell có thể dùng `npm.cmd`). Xem [hướng dẫn checker](../../scripts/README.md). `check` chạy các gate frontend và build, không thay QA 3D, UI hoặc kiểm thử thiết bị.

## Mục lục

| Tài liệu | Nội dung |
| --- | --- |
| [Yêu cầu sản phẩm](product-requirements.md) | Phạm vi và nghiệm thu |
| [Storyboard](scene-design.md) | Không gian, ghép hộp, camera, lời kết |
| [UI/UX](ui-ux-spec.md) | Sân khấu trung tâm, responsive, truy cập |
| [Luồng trải nghiệm](user-flows.md) | Đọc, hoàn thành, xem lại, lỗi |
| [Hộp và chocolate](frame-authoring-guide.md) | 14 hình, lời nhắn, manifest |
| [Kỹ thuật](technical-design.md) | State machine, engine và dữ liệu |
| [ADR](architecture-decisions.md) | Quyết định và đề xuất |
| [Thư mục](folder-structure.md) | Nguồn, runtime và QA |
| [Quy chuẩn code](coding-standards.md) | JavaScript, CSS, Python |
| [Blender MCP](blender-workflow.md) | Dựng, rig, xuất, kiểm tra |
| [Kế hoạch](implementation-plan.md) | Mốc triển khai |
| [Kiểm thử](testing-strategy.md) | Domain, UI, thiết bị, lỗi |
| [Chất lượng](quality-checks.md) | Điều kiện bàn giao |
| [Hiệu năng](performance-standards.md) | Mục tiêu và cách đo |
| [Bảo mật](security-standards.md) | Nội dung, asset, hosting |
| [Ngôn ngữ](localization.md) | Copy và thiết lập |
| [Hình ảnh](theme.md) | Màu sắc, chữ, chuyển động |
| [Triển khai](deployment-guide.md) | Build, deploy, rollback |

Yêu cầu sản phẩm là nguồn chính về phạm vi; UI/UX quyết định bố cục; storyboard quyết định diễn biến; hướng dẫn hộp quyết định ánh xạ. Khi thay đổi phải cập nhật đồng thời tài liệu và kiểm thử liên quan. Lời nhắn là nội dung khởi tạo, có thể biên tập nhưng phải giữ 14 thông điệp riêng.
