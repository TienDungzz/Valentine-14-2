# Bối cảnh và storyboard — Hai nửa thành một

## Không gian

Khu vườn sân thượng riêng tư lúc chạng vạng. Bàn tròn nhỏ ở trung tâm; hai người đứng phía sau bàn và hơi xoay về nhau, nhìn rõ mặt và bàn tay. Giàn hoa hồng, dây đèn vàng, lan can và skyline thành phố giản lược tạo chiều sâu. Trời xanh tím, ánh sáng vàng mềm tập trung vào nhân vật và hộp.

“Sân khấu trung tâm” là bố cục website, không phải sân khấu biểu diễn vật lý. Cây lay và cánh hoa thưa chỉ là nền; tránh đồ trang trí gây nhầm với 14 chocolate tương tác.

## Diễn biến

| Nhịp | Hành động | Camera / UI |
| --- | --- | --- |
| Mở đầu | Mỗi người giữ một nửa hộp có nắp đóng | Góc rộng vừa, CTA ghép hộp |
| Đặt và ghép | Cùng đặt xuống bàn, đẩy nhẹ hai nửa vào giữa | Thấy tay và đường nối, viền sáng nhẹ một lần |
| Mở quà | Mở hai nắp ra ngoài | Nắp không che chocolate hoặc xuyên tay |
| Khám phá | Hộp mở, đủ 14 miếng | Camera tiến gần và nghiêng xuống, bật chọn sau ổn định |
| Lời kết | Sau 14/14 và CTA, hai người đứng cạnh nhau | Camera lùi, hộp còn trên bàn, hiện câu kết |

Thời lượng thử nghiệm: đặt/ghép 3–4 giây, mở 1–2 giây, camera 2–3 giây, kết 3–4 giây; tinh chỉnh sau dựng. Reduced motion dùng pose tĩnh/chuyển mờ ngắn, không bỏ bước đọc.

## Hộp và chocolate

Hai nửa tạo một đường bao trái tim, không phải hai hộp trái tim nhỏ. Mỗi nửa có 7 hốc, nắp riêng và marker điểm cầm/ghép/đặt. Hộp đỏ rượu, giấy lót kem/vàng, chocolate nâu đen có bevel và độ bóng vừa. Hình phải phân biệt bằng silhouette.

Khi chọn, miếng nâng nhẹ trong hốc, khi đóng trở về. Giữ đủ 14 miếng, không biến mất sau đọc; trạng thái đã đọc hiển thị bằng viền và dấu/chữ tương ứng trong DOM. Mobile dùng camera cao hơn và phối cảnh nhẹ hơn để thấy đủ các hình.

## Lời kết và QA

Câu khởi tạo: “14 điều muốn nói, 2 người cùng viết tiếp.” Hai người đứng sát, nhìn nhau; không bắt buộc animation ôm phức tạp trong bản đầu.

Lưu preview mở đầu, cầm hộp, chạm bàn, ghép, nắp mở, đủ 14 miếng, góc mobile và kết. Giữ cùng không gian/ánh sáng xuyên suốt. Render Blender không thay QA runtime.
