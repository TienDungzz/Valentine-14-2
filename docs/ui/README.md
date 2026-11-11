# Giao diện Valentine Red

## Bố cục

Một cột căn giữa: tiêu đề phía trên, sân khấu 3D lớn ở giữa, lời dẫn/tiến độ/CTA dưới. Logo góc trên trái, thiết lập giảm chuyển động góc trên phải, không thanh header ngang.

Desktop giữ cảnh sân thượng rộng; mobile dùng khung 4:5 và fit camera theo phase. Trang được cuộn dọc khi màn hình thấp/zoom lớn; không cắt nút bằng khóa 100vh. Chừa safe area và tránh cuộn ngang.

## Điều khiển và khả năng truy cập

Canvas có mô tả, DOM picker cung cấp 14 lựa chọn tương đương. Đã đọc có dấu/chữ, không chỉ màu. Native dialog có tên/nội dung, Escape đóng và trả focus về điều khiển tương ứng; lời nhắn không tự đóng.

Nút chính mục tiêu 44 × 44 CSS px. Focus rõ, chữ thường tương phản tối thiểu 4.5:1; cần đo trên trạng thái thực tế. Kiểm bàn phím, zoom 200%, viewport 320/768/1440 và thiết bị đích. Không suy kết quả từ việc CSS parse được.

Theme là palette kem/đỏ rượu cố định; nội dung tiếng Việt. Thiết lập chỉ điều khiển chuyển động system/reduced/full. Reduced motion bỏ camera/timeline dài nhưng vẫn cho đọc đủ nội dung.

## CSS và QA

BEM theo block của trang, tokens tập trung tại [tokens.css](../../src/shared/styles/tokens.css); chi tiết [quy tắc CSS](css-variables.md). Không thêm theme/i18n selector ngoài phạm vi.

Trước phát hành, kiểm loading/retry, poster fallback, dialog, tiến độ, đủ 14/14, lời kết và reset trên browser/mobile. Các bước này còn mở trong [trạng thái sản phẩm](../product/implementation-status.md).
