# Yêu cầu sản phẩm — Valentine Red

## Mục tiêu và biểu tượng

Món quà Valentine tương tác trên web: ngày 14 là 14 miếng chocolate đen; tháng 2 là hai người và hai nửa hộp trái tim. Mỗi nửa có 7 miếng với hình khác nhau, ghép thành một hộp trái tim duy nhất.

## Phạm vi bản đầu

Hai nhân vật nam–nữ trong khu vườn sân thượng lúc chạng vạng cùng đặt, ghép và mở hộp trên bàn. Camera tiến gần để khám phá 14 miếng. Mỗi hình gắn cố định một lời nhắn riêng, không chọn ngẫu nhiên.

Bố cục bắt buộc: tiêu đề trên, khung 3D lớn giữa, lời dẫn/tiến độ/CTA dưới; logo góc trên trái, thiết lập góc trên phải, không header ngang. Giữ bố cục trong toàn bộ trải nghiệm, chỉ đổi camera bên trong sân khấu.

Có hỗ trợ chuột, chạm, bàn phím, giảm chuyển động, tải lỗi và phương án không WebGL. Bản đầu không có tài khoản, backend, nhập ảnh, chỉnh nội dung trực tiếp, cá nhân hóa bằng URL, âm thanh hoặc xuất ảnh. Nội dung biên tập trong source.

## Quy tắc lời nhắn và tiến độ

- Đúng 14 ID, 14 hình, 14 lời nhắn khác nhau theo [hướng dẫn hộp](frame-authoring-guide.md).
- Đọc theo thứ tự bất kỳ; chọn lại luôn mở cùng lời nhắn.
- Chỉ một hộp thoại; nội dung không tự đổi hoặc tự đóng.
- Ghi đã đọc khi nội dung hợp lệ được hiển thị; đếm ID duy nhất, không đếm click.
- Sau đóng lời nhắn thứ 14 mới hiện “Xem lời kết”; người xem chủ động nhấn, không tự chạy camera.
- “Trở lại hộp quà” giữ tiến độ, hộp đã mở.
- “Xem lại hoạt cảnh” về đầu và giữ tiến độ; “Bắt đầu lại” về đầu và xóa tiến độ.
- Reload tạo phiên mới; chỉ lưu thiết lập giảm chuyển động nếu storage khả dụng.

## Nghiệm thu

Nhận ra hai người, hai nửa ghép một trái tim, đúng 7 + 7 miếng. Tay/hộp/nắp không xuyên nhau; 14 hình rõ ở góc khám phá trên mobile. Mỗi miếng mở đúng lời nhắn, đọc lặp không tăng tiến độ. Đủ 14/14 mới mở quyền xem kết. Đi hết luồng bằng bàn phím và reduced motion; không WebGL vẫn đọc đủ nội dung. Layout không cuộn ngang hoặc cắt CTA khi zoom; lỗi tải có retry.

Đây là đặc tả, chưa xác nhận website hoặc asset mới đã được triển khai.
