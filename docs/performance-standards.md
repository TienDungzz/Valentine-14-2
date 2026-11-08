# Hiệu năng — Valentine Red

## Mục tiêu khởi tạo

Chưa đo; chốt lại từ prototype trên thiết bị thật. Không coi là kết quả hoặc cam kết hiện tại.

| Hạng mục | Mục tiêu đề xuất |
| --- | --- |
| Tải cần cho tương tác 3D đầu | Không quá 12 MB truyền tải |
| Toàn bộ bản đầu | Không quá 20 MB, chưa có âm thanh |
| Mobile tham chiếu | Duy trì ít nhất 30 fps |
| Frame time p95 khi khám phá | Không quá 33 ms |
| Draw calls góc khám phá | Không quá 120 |
| Tam giác hiển thị | Khoảng 250.000 trở xuống |
| Texture | Chủ yếu 1K, tối đa 2K khi có lý do |
| DPR | Khoảng 1–1,5 mobile, tối đa 2 desktop |

Ưu tiên hình chocolate, tay/mặt và khả năng đọc; giảm skyline/hoa/bóng/hậu kỳ trước. Dùng mesh/material chia sẻ, bake ánh sáng nền khi phù hợp; hạn chế đèn động và phản chiếu thời gian thực.

## Tải và tài nguyên

Giữ chỗ kích thước stage tránh layout shift; poster/DOM xuất hiện sớm. Tải trang trí sau tài nguyên bắt buộc nếu cần. Compression cần decoder và QA lại node/skin/clip/màu. Không tải .blend/texture master xuống browser.

## Cách đo

Dùng production build; ghi thiết bị/OS/browser, mạng, viewport/DPR, cache lạnh/nóng, build ID. Ghi byte tải, thời gian ready, frame time p50/p95, draw calls, triangles và bộ nhớ qua 10 vòng replay. Tách thời gian mạng khỏi parse/compile GLB.

Chọn Android tầm trung và iPhone tham chiếu khi có máy thật; không suy mobile từ desktop. Báo số đo và tối ưu trước khi đổi mục tiêu. Máy yếu vẫn dùng poster/DOM để đọc đủ nội dung.
