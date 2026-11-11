# Hệ hình ảnh — Valentine Red

## Hướng thiết kế

Cảm hứng hộp chocolate cao cấp: nền kem ấm, đỏ rượu, chữ nâu và vàng champagne tiết chế. Cảnh 3D chạng vạng xanh tím, đèn vàng mềm. Một giao diện cố định, chưa có light/dark switch; thiết lập chỉ giảm chuyển động.

## Palette khởi tạo

| Vai trò | Màu |
| --- | --- |
| Nền | #FFF7F0 |
| Surface / modal | #FFFCF7 |
| Chữ chính | #35201D |
| Chữ phụ | #70534C |
| Accent | #8B2346 |
| Chữ trên accent | #FFFFFF |
| Vàng trang trí | #C69A58 |
| Viền | #DCC8BC |
| Focus | #6544A0 |
| Lỗi | #A12634 |

Vàng/viền sáng dành trang trí, không mặc định dùng cho chữ nhỏ. Đo tương phản tổ hợp thật và các trạng thái; bảng màu chưa là chứng nhận truy cập.

## Typography và bố cục

Tiêu đề serif đủ dấu Việt; nội dung sans dễ đọc, font hệ thống hoặc tự host có giấy phép. Tiêu đề co giãn bằng clamp; chữ nội dung khoảng 16px trở lên, line-height 1.5–1.7.

Stage bo 24px desktop/16px mobile, viền mảnh và bóng mềm. CTA bo vừa, logo nhỏ, thiết lập góc đối diện. Không rải tim/lấp lánh khắp trang. Sân khấu là trọng tâm, chữ/controls có khoảng thở.

## Trạng thái và token

Hover/focus chocolate gợi sáng nhẹ, selected có outline; đã đọc có dấu/chữ trong DOM. Không đổi chocolate đen sang nhiều màu theo tiến độ. Disabled vẫn đọc được, focus không bị overflow cắt.

Token dự kiến shared/styles/tokens.css: background, surface, text, text-muted, accent, on-accent, border, focus, error. Vật liệu 3D kiểm riêng trong runtime.

Chuyển động phục vụ ghép/mở/đổi camera/chọn miếng. Reduced motion dùng pose tĩnh và chuyển mờ ngắn; không chớp hoặc lặp hoạt cảnh tự động.
