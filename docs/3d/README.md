# 3D trong Valentine Red

## Website đang dùng gì

Three.js tạo sân thượng, bàn, hộp hai nửa và 14 hình chocolate bằng code trong src/engine. Hai nhân vật tải từ GLB có rig/animation; không tải model sân thượng riêng hoặc kết nối Blender khi người xem mở trang.

Nguồn nhân vật ở art/characters và bản làm việc Valentine riêng. GLB web ở public/models/characters, poster ở public/posters, manifest ở public/manifests/characters.json. Không đưa .blend/backup vào public hoặc dist/.

## Luồng runtime

App lazy-load engine. Scene tải hai GLB, dùng MeshoptDecoder, mixer và timeline camera/hộp. Pose đầu cầm hai nửa; ghép/mở rồi camera tiến vào khám phá; đủ 14/14 mới cho người xem chọn đoạn kết.

ID chocolate ánh xạ cố định tới hình/nội dung. Renderer có 14 pick proxies; DOM picker là cách chọn tương đương bằng bàn phím. Giảm chuyển động chuyển tới pose đích, lỗi WebGL có poster/DOM. Domain giữ tiến độ độc lập renderer.

Renderer, RAF, listener, ResizeObserver, geometry/material/texture/skeleton có owner/dispose. Tab ẩn không chạy dồn animation; resize giữ phase. Cần kiểm lifecycle thật qua replay/context loss trước phát hành.

## Công cụ sản xuất, không phải điều kiện dev frontend

Chỉ khi chỉnh nguồn:
1. Mở bản làm việc nhân vật trong Blender, giữ nguyên master gốc.
2. Dùng scripts/blender để chỉnh style/bake/export raw vào .qa/characters.
3. Chạy npm run assets:optimize tạo GLB web và cập nhật manifest.
4. Chạy check:characters, check:assets và check:gltf; xem model trong web.
5. Nếu đổi script Python, chạy npm run check:blender với Python 3.

prepare_characters chỉ dùng studio mới, không chạy dựng lại khi đang chỉnh bản hiện có. Blender preview không thay browser QA.

## Ngân sách và bằng chứng

project-standards.json kiểm tối đa 5 MiB/file và 15 MiB tổng roots nhân vật/poster. Mục tiêu render mobile 100.000 triangles, 100 draw calls, texture tối đa 2048; các số này cần đo và review, không suy từ kích thước GLB.

npm run check:characters xác minh manifest, decoded geometry/joint/clip/bytes. Khronos check:gltf tạo report .qa/gltf; errors chặn gate, warnings cần review. Không suppress để làm báo cáo xanh.

Số đo hiện có, warning và phần còn thiếu ở [performance report](performance-report.md). Tiếp xúc tay/hộp, sắc độ tóc/alpha, animation, hit target mobile và FPS vẫn cần nghiệm thu trong browser.
