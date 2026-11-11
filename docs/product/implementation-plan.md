# Kế hoạch triển khai — Valentine Red

Đã có bản local của các mốc 1–5 cùng test domain/hình học, nguồn Blender và GLB. Chi tiết đạt/chưa đạt theo [trạng thái triển khai](implementation-status.md). Các tiêu chí QA thiết bị/trình duyệt và phát hành ở các mốc dưới vẫn cần xác minh.

## 1. Khóa đặc tả và kiểm nguồn

Giữ layout sân khấu trung tâm, bảng 14 hình/lời nhắn và hành vi đọc/xem lại/reset. Khi bắt đầu sản xuất, kiểm hai master nhân vật bằng MCP Blender, lập inventory rig/texture/giấy phép và hạn chế thực tế.

## 2. Prototype

Chốt stack sau prototype. Tạo shell logo/thiết lập, tiêu đề, stage, lời dẫn/CTA; blockout sân thượng, hộp 7 + 7 và camera desktop/mobile. Có DOM picker và poster fallback sớm. Đạt khi chọn đúng 14 vị trí trên điện thoại và layout không cắt nút.

## 3. Domain và nội dung

Tạo schema, 14 records, validator, mapping, state controller. Hoàn thiện modal, readIds, tiến độ, CTA kết; replay giữ tiến độ và restart xóa. Kiểm unit/integration trước khi phụ thuộc asset final.

## 4. Asset bằng Blender MCP

Dựng hộp/14 hình, hoàn thiện sân thượng/lighting, kiểm và chỉnh rig hai người. Tạo clip đặt/ghép/mở và pose kết; xuất GLB, poster, manifest sau QA. Placeholder không coi là asset final.

## 5. Tích hợp

Kết nối timeline/engine/controller; xử lý pause, resize, session token, retry/context loss. Hoàn thiện focus, reduced motion và 14 nút DOM. Đạt khi đi hết luồng bằng bàn phím và khi tắt WebGL.

## 6. Tối ưu và phát hành

Đo trên thiết bị tham chiếu, tối ưu GLB/texture/draw calls; QA nội dung, hình ảnh, truy cập, bảo mật. Build production, smoke test URL thật và rollback khi có yêu cầu phát hành. Bước chuẩn bị hiện tại không tạo hosting/triển khai.

## Bàn giao

Theo [quality checks](quality-checks.md); báo file thay đổi, bằng chứng test/đo, phần chưa kiểm. Mỗi mốc chỉ nâng trạng thái theo kết quả thực tế.
