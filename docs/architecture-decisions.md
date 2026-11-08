# Quyết định kiến trúc — Valentine Red

| ID | Quyết định | Trạng thái |
| --- | --- | --- |
| ADR-001 | Sân khấu trung tâm, logo/thiết lập hai góc, không header ngang | Người dùng đã chọn |
| ADR-002 | Hai người, hai nửa hộp, 7 + 7 chocolate đen | Người dùng đã chọn |
| ADR-003 | 14 hình gắn cố định 14 lời nhắn khác nhau | Người dùng đã chọn |
| ADR-004 | Sân thượng chạng vạng, một không gian qua các góc camera | Thiết kế cơ sở theo trao đổi |
| ADR-005 | MCP Blender sản xuất; GLB chạy trên web | Người dùng cho phép |
| ADR-006 | JavaScript ES modules + Vite + Three.js, UI DOM | Đã triển khai bản đầu |
| ADR-007 | Domain/state độc lập engine | Thiết kế cơ sở |
| ADR-008 | Tiến độ trong RAM, chỉ lưu giảm chuyển động | Thiết kế cơ sở |
| ADR-009 | Đủ 14/14 thì chủ động nhấn xem kết | Thiết kế cơ sở |
| ADR-010 | Poster + DOM picker khi không có WebGL | Thiết kế cơ sở |

## Lý do và hệ quả

Một không gian giữ liền mạch và giảm asset/tải lại. Stage giữ vị trí trong trang dù camera đổi. Ánh xạ cố định tạo ý nghĩa cho từng hình và đếm tiến độ chính xác.

Tách domain giúp fallback dùng cùng nội dung/quy tắc. Không backend giúp phát hành đơn giản; nội dung frontend vẫn đọc được bởi người có URL, không phải dữ liệu bí mật.

Giữ nguồn .blend để biên tập; chỉ GLB/texture đạt QA vào runtime. Nguồn nhân vật phải kiểm rig và giấy phép trước tái sử dụng.

Bản đầu chọn DOM/native dialog và ES modules để giảm lớp điều phối; domain vẫn tách riêng và kiểm thử độc lập. TypeScript strict là yêu cầu nếu chuyển sang TypeScript, chưa có compiler/config trong bản JavaScript hiện tại. Tình trạng QA theo [báo cáo](implementation-status.md).

## Quyết định tiếp theo

Mỗi ADR cần vấn đề, phương án, lựa chọn, hệ quả, trạng thái và bằng chứng. Chốt stack phải cập nhật kỹ thuật, folder, build, test và hiệu năng. Ghi trong docs không đồng nghĩa đã triển khai.
