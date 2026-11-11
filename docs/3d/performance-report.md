# Bằng chứng 3D — Valentine Red

Ngày cập nhật: 10/11/2026. Nguồn: art/characters master và bản Valentine riêng; runtime: public/models/characters. Người nghiệm thu hình ảnh/hiệu năng: chủ dự án, chưa nghiệm thu.

## Kiểm tra có thể tái lập

npm run check:assets kiểm 5 MiB/file, 15 MiB tổng runtime roots, cấu trúc GLB/glTF và resource local. npm run check:characters giải mã Meshopt, joint, clip, byte count và kiểm manifest. npm run check:gltf chạy Khronos glTF Validator trên mọi GLB/GLTF trong roots.

Byte chính xác và clip ở public/manifests/characters.json; tổng hai nhân vật khoảng 4 MB. Poster garden.jpg tạo từ geometry và nhân vật thật của dự án. Blender runtime không cần chạy để website hoạt động.

Validator hiện có 0 errors trên cả hai model. Còn 18 warnings ở nam, 25 ở nữ:
- NODE_SKINNED_MESH_NON_ROOT: 16 nam/24 nữ; mesh skinned dưới hierarchy của rig được giữ khi export, cần QA skin trên loader web.
- MESH_PRIMITIVE_GENERATED_TANGENT_SPACE: 2 nam/1 nữ; normal-map tangent do renderer tạo, cần kiểm tóc/material giữa thiết bị.
- EXT_meshopt_compression chưa được Validator hỗ trợ được báo informational; checker character giải mã bằng Meshopt riêng.
- Hai UNUSED_OBJECT informational ở TEXCOORD_0 nữ, chưa dùng làm bằng chứng asset hoàn toàn sạch.

Không suppress warning. Full JSON được tạo tại .qa/gltf/. Chưa tái xuất model trong đợt chuẩn hóa; nguồn .blend giữ nguyên.

## Profile mục tiêu

Theo mẫu: 5 MiB/file, 15 MiB tổng runtime; tải 3D ban đầu mục tiêu 5 MiB; triangles 100.000, draw calls 100, texture tối đa 2048 và memory 64 MiB. 60fps/p95 <=20ms bình thường hoặc 30fps/p95 <=33.3ms low quality; cold ready mục tiêu 5 giây.

## Chưa đo và điều kiện nghiệm thu

Chưa có thiết bị/OS/browser/mạng tham chiếu, cold load 3 lần, FPS/p95, triangles/draw calls mọi pass, texture GPU memory hoặc vòng đời qua 10 lần replay. Không suy FPS từ byte GLB hoặc build thành công.

Cần ghi viewport/DPR/mode, cache/mạng, commit, số đo thật và ảnh/trạng thái trước phát hành. Browser QA không chạy trong đợt này; strip/render Blender trước đây chỉ là ảnh tham khảo. Các mục chưa đo vẫn là công việc mở, không là ngoại lệ tăng budget.
