# Hiệu năng — Valentine Red

Profile quy chuẩn hiện hành theo [3D](../3d/README.md) và [bằng chứng](../3d/performance-report.md), cấu hình budget trong project-standards.json.

Giữ 5 MiB/file và 15 MiB tổng runtime roots; không tính art/. Mục tiêu render mobile mặc định 100.000 triangles/100 draw calls, 60fps bình thường hoặc 30fps low quality. Chưa đo runtime nên không báo đạt các mục tiêu FPS/GPU chỉ từ dung lượng file.

Ưu tiên chất lượng mặt/tay, silhouette 14 miếng và khả năng chọn. Đo production build trên thiết bị thật, ghi viewport/DPR/mode/mạng/cache và build ID. Kiểm bộ nhớ qua 10 lần replay. Các budget cũ trong đợt prototype được thay bởi profile này; thay profile phải có lý do, review và số đo.
