# Frontend Valentine Red

## Luồng dữ liệu

index.html tải src/app/main.js. App tạo markup/controls, khởi tạo domain và lazy-load Three.js khi tải scene. Website có một trang, không router hoặc API client.

- Domain gift/story.js validate đúng 14 ID c01–c14, nội dung/hình riêng, 7 miếng mỗi nửa.
- Content chứa dữ liệu công khai; shapes.js ánh xạ theo ID, không theo thứ tự mảng.
- App chọn lời nhắn, mở dialog, cập nhật tiến độ sau khi nội dung hiển thị.
- Engine chỉ render/chạy timeline, nhận callback chọn chocolate; không giữ tiến độ nghiệp vụ.
- Preferences chỉ lưu system/reduced/full với version/allowlist, storage lỗi vẫn dùng được trong phiên.

State: loading → ready → assembling → exploring → finishing → completed. Đọc lại không tăng tiến độ; finale cần đủ 14/14, dialog đóng và người xem nhấn CTA. Replay giữ tiến độ, restart có xác nhận rồi xóa.

## Ranh giới và vòng đời

App kết nối domain và engine. Domain không import DOM/Three.js; engine không import app. Shared preferences không phụ thuộc nghiệp vụ. Cấu hình đường dẫn thật ở project-standards.json.

Load có generation token và AbortController để bỏ kết quả cũ. Engine sở hữu renderer, ResizeObserver, RAF, listener và tài nguyên GPU; dispose khi tháo scene. Ẩn tab không chạy dồn timeline; resize giữ state/modal. WebGL lỗi có poster và DOM picker để tiếp tục.

## Quy tắc code

JavaScript ES modules, camelCase cho hàm, tên file helper kebab-case. Tối đa 60 dòng/hàm qua ESLint, không dồn câu lệnh để né giới hạn. UI là một feature đơn; tách module theo trách nhiệm khi cần, không tạo lớp trống cho giống mẫu.

Chạy npm test cho domain/hình học/manifest, npm run check cho toàn frontend. Khi đổi công cụ lint/checker, chạy thêm npm run test:tools. Build/test source không thay QA browser.
