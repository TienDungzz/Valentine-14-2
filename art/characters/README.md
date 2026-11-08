# Nhân vật Valentine Red

## Nguồn được giữ nguyên

- male-cardigan.blend: nhân vật nam, tóc side part, cardigan và quần suông.
- female-grey-jeans.blend: nhân vật nữ, tóc thẳng mái thưa, áo và jeans.
- textures/: texture nguồn đi kèm.

Theo thông tin nguồn được cung cấp trước đây, giải phẫu, skeleton và clip nền kế thừa Sam CC0; trang phục/tóc là các chỉnh sửa của dự án. Xem [ghi nhận nguồn](../../public/models/LICENSES.md). Không suy ra giấy phép của asset khác từ thông tin này.

## Bản Valentine

Theo lựa chọn người dùng: ấm áp, tự nhiên, cardigan và trang phục thường ngày.

- Nam: cardigan yến mạch, áo kem, quần nâu và giày tối.
- Nữ: cardigan đỏ rượu mới dựa theo garment rig hiện có, áo kem, jeans xanh, giày ngà; bỏ túi và các chi tiết fray khỏi export.
- Hai rig giữ cấu trúc, khuôn mặt, tóc và tỷ lệ nguồn; không thay rest pose.
- Cử chỉ hai tay nâng/đặt/ghép hộp, ngẩng/cúi đầu đã bake 220 frame ở 30fps.
- Timeline nắp và camera thuộc runtime; clip nhân vật không tự chứa hộp.

## File làm việc

| File | Vai trò |
| --- | --- |
| valentine/wardrobe-studio.blend | Bản trang phục |
| valentine/gift-story.blend | Hai nhân vật với hoạt cảnh đã bake |
| ../../public/models/characters/male-valentine.glb | Bản nam web |
| ../../public/models/characters/female-valentine.glb | Bản nữ web |
| ../../public/manifests/characters.json | URL, clip, frame, số byte |

Clip runtime: male_GiftStory và female_GiftStory. Các mesh có thể có skin riêng với cùng tập joint của một rig; không giả định chỉ có một skin record trong glTF.

## Tái tạo

Trong Blender mới, dùng MCP chạy script/blender/prepare_characters.py trong workspace. Script từ chối nếu CHAR_Male/CHAR_Female đã có để tránh ghi đè. Để sửa tiếp, mở gift-story.blend thay vì dựng lại.

Các script tại [script/blender](../../script/blender): style_characters.py chỉnh bản sao, export_characters.py bake/xuất raw vào .qa/characters, render_preview.py tạo ảnh tham khảo từ hình học runtime. Sau xuất chạy npm run assets:optimize rồi npm run check:assets.

Nguồn .blend không phục vụ lên web. Không coi render Blender là bằng chứng animation/skin đã được kiểm trên trình duyệt; cần xem cả source và bản web sau khi chỉnh.
