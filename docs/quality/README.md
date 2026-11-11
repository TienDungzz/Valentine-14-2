# Kiểm tra website Valentine Red

## Kiểm tra hằng ngày

npm run check là đường kiểm tra frontend chính:
1. Docs bắt buộc và liên kết file.
2. Cấu trúc entry/domain/content/styles, engine và test sản phẩm.
3. Byte budget và cấu trúc GLB/glTF trong roots runtime.
4. Token CSS tập trung, fallback và design values.
5. Lint, format, code, content, characters, gltf, unused, test, build.

Các gate chạy lệnh thật theo project-standards.json, không gọi ngược lại orchestrator. Có lỗi thì trả nonzero. npm run check:static chỉ chạy phần tĩnh; quality chưa chạy được báo incomplete, không là kết quả phát hành.

npm test chỉ gồm tests/*.test.mjs: story/progress, preferences, 14 geometry, nội dung và character manifest. Bộ test này kiểm sản phẩm, không trộn số lượng test framework chuẩn vào báo cáo nghiệm thu website.

## Khi sửa công cụ

npm run test:tools chạy tests/tooling/*.test.mjs: checker orchestration/config/structure/assets/CSS, giới hạn hàm và validator phụ trợ. Chạy khi sửa checker, ESLint/config hoặc policy; không bắt chạy bộ này mỗi lần sửa nội dung sản phẩm.

npm run check:blender kiểm cú pháp/Python AST và giới hạn 60 dòng cho script sản xuất. Chỉ cần Python khi sửa công cụ Blender. Nó không chạy bpy, thay model hoặc chứng minh animation đúng.

## Trước phát hành

- Chạy npm run check, npm run audit và npm run check:secrets; đọc cả warning và giới hạn scanner.
- Khronos report ghi tại .qa/gltf, error chặn gate; warning phải review, không tự coi là đã giải quyết.
- Kiểm bàn phím/focus, responsive/zoom, reduced motion, loading/retry, WebGL fallback và toàn luồng 14 lời nhắn.
- Kiểm tiếp xúc tay/hộp, texture/skin trên web và đo FPS/frame time/GPU theo [báo cáo 3D](../3d/performance-report.md).
- Test artifact dist/ trên môi trường hosting thật khi có triển khai.

Lint đạt không là chứng nhận SAST, secret scan không bao phủ Git history/binary, glTF parse đạt không là hình ảnh đạt. Chưa phát hành hoặc nghiệm thu browser trong đợt tinh gọn cấu hình.

## Công cụ

Các entry check-config/docs/structure/assets/css/quality và thư viện dùng chung được giữ vì phục vụ frontend. Cấu hình không khai báo scope backend hoặc buộc có bộ test của chính framework checker. Chi tiết CLI và các lệnh độc lập ở [scripts](../../scripts/README.md).
