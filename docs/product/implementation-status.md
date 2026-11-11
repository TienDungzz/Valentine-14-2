# Trạng thái triển khai — 08/11/2026

## Đã thực hiện

Website local dùng Vite và Three.js với JavaScript ES modules. Stage ở trung tâm, logo/thiết lập hai góc; tiêu đề trên và lời dẫn/CTA dưới. Có cảnh sân thượng procedural, hai nhân vật từ nguồn người dùng, hộp hai nửa, 14 hình/14 lời riêng.

Trang phục theo lựa chọn “Ấm áp, tự nhiên”: nam cardigan yến mạch, nữ cardigan đỏ rượu với áo kem và jeans. Lưu bản chỉnh riêng, giữ master. Đã bake hoạt cảnh tay/head và xuất GLB có animation, tối ưu Meshopt/WebP. Hộp, nắp và camera được runtime điều khiển.

Đã có tiến độ, đọc lại, finale có CTA, replay giữ tiến độ, restart có xác nhận/xóa tiến độ, modal native, DOM picker, reduced motion và fallback dùng poster render từ asset thật. Skyline/trang trí được gộp mesh theo material để giảm draw calls.

## Kiểm tra và bằng chứng

- npm test: 23 test cho checker, domain, nội dung, preferences và hình học.
- npm run check: quy tắc tĩnh và integrity GLB.
- npm run build: tạo artifact dist/.
- GLB: giải nén/đọc lại geometry, joint, clip, accessor và số byte theo manifest.
- Blender: xem trang phục, strip frame 1/65/105/170/220, render toàn cảnh và góc khám phá.
- .qa/gift-explore.jpg là ảnh kiểm góc khám phá, không phải screenshot trình duyệt.

Số byte GLB thực ghi trong public/manifests/characters.json. Hai nhân vật tổng khoảng 4 MB sau tối ưu. Ngân sách fps/frame time trong tài liệu hiệu năng vẫn chưa có số đo thiết bị.

## Chưa xác minh

Computer Use không được cấp quyền cho Chrome; kết nối tab browser cũng không khả dụng. Chưa có QA trực tiếp về layout desktop/mobile, focus/trình đọc màn hình, hit target, GPU skin/material và toàn timeline trong trình duyệt. Các mục này vẫn là điều kiện cần kiểm trước phát hành.

Animation hiện là pass đầu, cần đánh giá cảm giác tự nhiên và tiếp xúc tay/hộp trong bản web. Chưa có hosting hoặc URL public. Không dùng kết quả build/check để tuyên bố hoàn thành nghiệm thu toàn sản phẩm.

## Quyết định triển khai khác đề xuất ban đầu

Bản đầu dùng JavaScript ES modules + Vite + Three.js thay cho React/TypeScript còn ở trạng thái đề xuất. Domain tách khỏi engine; UI DOM dùng native dialog. Nếu chuyển TypeScript, phải bổ sung compiler/strict config và cập nhật checker/toolchain, không thêm tsconfig giả.

## Chuẩn hóa 10/11/2026

Chuyển sang scripts/, tests/ và docs/product/; thêm bộ checker mẫu, token CSS/fallback, ESLint 60 dòng, Python AST, Knip và Khronos Validator. Hồ sơ hiện hành: [project](../project.md), [ADR migration](../decisions/001-standards-adoption.md). Số test ở phần lịch sử phía trên là thời điểm 08/11, không phải số test của migration. Chưa chạy lại browser QA hoặc chỉnh .blend trong đợt này.

## Phạm vi frontend sau tinh gọn

Test mặc định chỉ gồm 14 test sản phẩm. 77 regression test công cụ đặt ở tests/tooling, chạy riêng khi sửa checker. Docs được viết lại cho frontend 3D; không còn backend/template hoặc yêu cầu Python trong đường kiểm tra website hằng ngày.
