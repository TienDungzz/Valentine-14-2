# Quy trình MCP Blender — Valentine Red

## Phạm vi và khởi đầu

Người dùng cho phép dùng MCP Blender để kiểm scene, dựng/sửa model, vật liệu, rig/animation và xuất GLB. MCP chỉ dùng lúc sản xuất, không trong runtime. Đã có tác vụ dựng trong bản triển khai hiện tại: wardrobe-studio.blend, gift-story.blend, GLB và poster; xem [trạng thái](implementation-status.md).

Khám phá công cụ Blender thực sự khả dụng và đọc mô tả; không giả định tên API phụ trợ. Kiểm kết nối, phiên bản, file đang mở, object/collection, đơn vị, rig, action và thay đổi chưa lưu trước chỉnh. Có thể dùng execute_blender_code với bpy trong Blender được kết nối.

Xác định asset/collection và đích trong workspace; lưu bản phiên bản mới trước thay đổi lớn. Không xóa scene hoặc ghi đè master. Nếu không kết nối được, chuẩn bị scripts/brief và ghi phần chưa thực hiện.

## Nhóm tài nguyên dự kiến

| Collection | Nội dung |
| --- | --- |
| ENV_RooftopGarden | Sàn, bàn, lan can, giàn hoa, skyline |
| CHAR_Male, CHAR_Female | Nhân vật và rig riêng |
| PROP_HeartBox | Hai nửa hộp, nắp, marker |
| PROP_Chocolates | 14 miếng, slot và pick proxies |
| REF_Cameras | Overview, explore, finale |

Nguồn hiện có male-cardigan.blend và female-grey-jeans.blend trong art/characters chỉ tái sử dụng sau kiểm scale, rig, texture và giấy phép; chưa xác nhận clip ghép hộp.

## Thứ tự sản xuất

1. Blockout sân thượng, bàn, hai người và hộp; kiểm desktop/mobile.
2. Hộp hai nửa, mỗi nửa 7 hốc, ghép thành một trái tim.
3. Đủ 14 silhouette theo hướng dẫn hộp, kiểm góc trên cao.
4. Vật liệu chocolate đen, hộp đỏ rượu, lót kem/vàng, đèn mềm.
5. Đồng bộ đặt/ghép/mở nắp, pose kết đứng cạnh nhau.
6. Camera, poster fallback, xuất và QA runtime.

## Quy chuẩn

Nguồn dùng mét, unit scale 1; exporter glTF chuyển trục, kiểm hướng/scale và không đổi hai lần. Node theo [hướng dẫn hộp](frame-authoring-guide.md). Clip dự kiến Idle, PlaceHalves, AssembleHeart, OpenLids, Finale; tên/mốc clip thực phải kiểm và ghi manifest. Clip riêng hai rig cần ghi offset/thời lượng đồng bộ.

Hộp đổi parent từ tay xuống bàn phải giữ world transform. Kiểm trước đặt, chạm bàn, ghép, nắp mở. Không apply transform/rest pose tùy tiện trên mesh skin. Vật liệu procedural cần bake/chuyển PBR phù hợp glTF; kiểm UV/normal/roughness, tóc alpha và màu trong web.

## Xuất và kiểm tra

Lưu .blend trong art theo nhóm, script trong scripts/blender, GLB thử trong .qa. Chọn đúng node/clip, không xuất vật ẩn/camera/đèn ngoài hợp đồng. Kiểm đủ 14 node, 7 mỗi nửa, pivot nắp, rig/texture/clip.

Nén chỉ khi loader có decoder và kiểm lại sau tối ưu. Preview các mốc trong Blender rồi kiểm trong loader web; render Blender không thay QA runtime. Bản đạt mới vào public kèm manifest và giấy phép; không thay nguồn master bằng bản nén.

Asset ngoài cần nguồn/giấy phép. Dịch vụ tạo 3D có phí chỉ dùng khi được phép trong phạm vi tương ứng. Bàn giao nêu nguồn/scripts/GLB/clip/QA và phần chưa kiểm chứng.
