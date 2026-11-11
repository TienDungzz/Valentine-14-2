# Hướng dẫn hộp trái tim và 14 chocolate

Tên file giữ để không đứt liên kết; nội dung dành riêng cho tài nguyên Valentine.

## Nội dung khởi tạo

Một hộp trái tim gồm hai nửa, mỗi nửa 7 hốc và 7 miếng chocolate đen. ID ổn định, không phụ thuộc thứ tự mesh. Có thể biên tập lời nhưng phải giữ 14 thông điệp riêng.

| ID | Nửa | Hình | Lời nhắn |
| --- | --- | --- | --- |
| c01 | trái | Trái tim | Anh yêu cách em khiến những điều giản dị trở nên đáng nhớ. |
| c02 | trái | Ngôi sao | Giữa bao điều rộng lớn, anh vẫn luôn muốn tìm thấy em. |
| c03 | trái | Mặt trăng | Mong mỗi đêm của em đều yên bình, và có anh trong lời chúc ngủ ngon. |
| c04 | trái | Mặt trời | Cảm ơn em đã mang đến những ngày ấm áp hơn. |
| c05 | trái | Bông hoa | Nụ cười của em là điều anh muốn được ngắm thêm mỗi ngày. |
| c06 | trái | Chiếc lá | Anh thương cả những điều nhỏ xíu mà đôi khi em chẳng để ý ở mình. |
| c07 | trái | Vỏ sò | Mình cùng dành một ngày ra biển, nghe sóng và chẳng cần vội nhé. |
| c08 | phải | Chiếc nơ | Hôm nay có một món quà, còn những ngày sau vẫn có anh bên cạnh. |
| c09 | phải | Chìa khóa | Có những điều anh chỉ muốn kể khi người lắng nghe là em. |
| c10 | phải | Ổ khóa | Anh hứa sẽ lắng nghe, kể cả những ngày mình chưa hiểu nhau. |
| c11 | phải | Kim cương | Những kỷ niệm có em là điều anh luôn muốn giữ gìn. |
| c12 | phải | Gấu nhỏ | Gửi em một cái ôm, để những ngày mỏi mệt dịu đi một chút. |
| c13 | phải | Phong thư | Buổi hẹn tiếp theo, mình lại dành thời gian thật trọn vẹn cho nhau nhé. |
| c14 | phải | Hai trái tim | Điều anh mong nhất là chúng mình vẫn chọn đồng hành cùng nhau. |

c14 là một miếng có hai tim nối liền, không thành hai miếng riêng.

## Hình học và vật liệu

Phân biệt silhouette ở góc trên cao, không chỉ thay hoa văn trên cùng khối. Chi tiết chìa khóa/nơ/lá không quá mảnh; bevel mềm, đế đủ dày như chocolate đúc. Hốc có khoảng trống cho vùng chọn, không chồng silhouette. Chocolate nâu đen, roughness vừa, nét vàng tiết chế.

Mỗi nửa có nắp riêng mở ra ngoài, không chạm bàn/nhân vật hoặc che các miếng. Có marker cầm, ghép và đặt.

## Hợp đồng node dự kiến

- heart_half_left, heart_half_right: gốc hai nửa.
- lid_left, lid_right: bản lề.
- grip_left/right, join_anchor_left/right: mốc cầm và ghép.
- chocolate_c01 đến chocolate_c14: root từng miếng.
- slot_c01 đến slot_c14: điểm nghỉ.
- camera_overview, camera_explore, camera_finale: góc tham khảo.

Tên trên phải được tạo và kiểm chứng, chưa khẳng định tồn tại trong nguồn hiện có. Pick proxy theo miếng nếu cần; không cho vùng chọn chồng nhau gây chọn nhầm.

## Manifest và validator

Record chocolate có id, half (left/right), shapeKey, nodeName, slotNodeName, messageId. Message có id và text; manifest asset riêng ghi URL, phiên bản, node/clip thật, đơn vị, nguồn và giấy phép.

Validate đúng 14 ID, shapeKey, messageId duy nhất; 14 text khác nhau sau trim/chuẩn hóa khoảng trắng; 7 record mỗi nửa; không text rỗng hoặc tham chiếu treo. Loader kiểm node đủ và duy nhất sau export. Dữ liệu sai báo lỗi, không random/thêm bớt để che lỗi.

## QA

Đếm trong Blender và runtime, thử từng hình tại viewport 390px; xác nhận pick đúng ID sau tối ưu. Lưu ảnh bố trí và báo cáo node/clip trong .qa. Trạng thái đã đọc do app quản lý, không bake vào texture hoặc mesh.
