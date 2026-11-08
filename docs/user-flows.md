# Luồng trải nghiệm — Valentine 14/2

## Luồng chính

1. Mở trang với bố cục sân khấu trung tâm, tải cảnh và validate 14 miếng.
2. Khi ready, nhấn “Ghép hai nửa trái tim”.
3. Hai người đặt hộp, ghép, mở nắp; camera tiến gần. Khóa chọn trong timeline.
4. Khi ổn định, hiện 0/14 và hướng dẫn. Chọn miếng qua canvas hoặc danh sách DOM.
5. Mở đúng lời nhắn cố định, ghi ID đã đọc khi nội dung hiển thị thành công.
6. Đóng bằng nút/Escape, trả focus. Chọn lại không tăng tiến độ.
7. Đóng lời nhắn làm đủ 14/14 thì hiện “Xem lời kết”; nhấn mới chạy camera lùi và hiện kết.

## Xem lại và reset

| Hành động | Điểm đến | Tiến độ |
| --- | --- | --- |
| Trở lại hộp quà | Camera khám phá, hộp mở | Giữ |
| Xem lại hoạt cảnh | Đầu cảnh, chờ CTA ghép | Giữ |
| Bắt đầu lại | Đầu cảnh, chờ CTA ghép | Xóa về 0/14 |
| Reload | Phiên mới, tải rồi chờ CTA | Xóa về 0/14 |

Bắt đầu lại có xác nhận ngắn vì xóa tiến độ; hủy giữ nguyên. Sau xem lại với 14/14 vẫn đọc lại được và tự chọn xem kết. Các hành động đóng modal, hủy timeline và bỏ callback cũ đúng phase.

## Gián đoạn

Modal mở khóa chọn nền và chuyển camera. Thiết lập không làm mất tiến độ; đổi reduced motion giữa clip hoàn tất đến pose đích hợp lệ.

Tải lỗi có retry, không tạo engine/timeline trùng. Schema sai không khám phá dữ liệu thiếu. Ẩn tab pause, trở lại không chạy dồn. Resize/xoay giữ phase/modal/readIds và fit lại camera. Storage lỗi vẫn dùng trong RAM.

WebGL lỗi thử phục hồi; nếu thất bại dùng poster + DOM giữ tiến độ. Trong fallback, CTA đầu vào khám phá trực tiếp không animation; đạt 14/14 vẫn chủ động xem kết tĩnh.
