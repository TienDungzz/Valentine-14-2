# Quy chuẩn code — Valentine Red

## Định dạng

UTF-8, LF, newline cuối file; TypeScript/CSS 2 spaces, Python 4 spaces. Bản đầu dùng JavaScript ES modules, dữ liệu được validate ở domain. Nếu chuyển TypeScript phải bật strict, nhận dữ liệu ngoài module bằng unknown rồi validate, không dùng any để bỏ kiểm tra. Hàm camelCase, component/type PascalCase, folder kebab-case. Thời gian có đơn vị như elapsedMs, durationSeconds.

Tên nghiệp vụ dự kiến: assembleHeart, selectChocolate, markMessageRead, replayStory, restartStory; không coi là hàm đã tồn tại.

## Logic

State machine theo thiết kế kỹ thuật, không nhiều boolean mâu thuẫn. Dữ liệu 14 miếng bất biến; readIds là tập duy nhất, không mutate React state. Mapping theo ID cố định, không random hoặc children index.

Controller chặn double activation/sai phase; async có token/abort. Ghi đã đọc khi modal hiển thị thành công, idempotent; không side effect trong render. Copy tập trung content, không hardcode trong engine.

## Engine

Một owner vòng render/timeline, cập nhật delta có giới hạn. Không đưa transform mỗi frame vào UI state. Một hệ ghi camera và một owner đạo cụ ở mỗi phase; đổi parent giữ world transform.

Dispose tài nguyên đúng ownership, không dispose shared resource còn dùng. Chỉ pick 14 proxies, không tạo geometry/material mỗi frame. Pause tab ẩn, resume không nhảy thời gian; retry/reset không tạo listeners/engine trùng.

## UI/CSS

CSS BEM; bản một trang dùng main.css cho các block của trang, token tập trung tại tokens.css với fallback cho mọi var(). Khi tách component độc lập, style theo phạm vi của component. Ví dụ stage__canvas, message-dialog__text, chocolate-picker__item--read. ARIA/disabled dùng semantic thật, không chỉ modifier.

Mobile-first, không khóa chiều cao cắt CTA. DOM picker tương đương canvas; modal quản focus/Escape. Đã đọc có dấu/chữ, vùng nhấn 44px, reduced motion cả CSS và timeline.

## Python Blender

Script có entry point, tham số đường dẫn workspace và collection sở hữu. Tách build/validate/export. Kiểm API/enum phiên bản thực; tìm shader node theo type. Không xóa toàn scene, sửa rest pose hoặc ghi đè master ngoài phạm vi. Nếu random trang trí thì ghi seed, không random nội dung.

## Kiểm tra

Đã có `npm run check`, các nhóm check:format/docs/content/code, `npm run test:tools` và `npm run check`; xem [hướng dẫn checker](../../scripts/README.md). Bản hiện tại đã có ESLint, Knip, PostCSS checker và build; typecheck không áp dụng cho ES modules. Checker hiện tại không thay compiler, kiểm thử hành vi hoặc QA 3D. Test schema, mapping, tiến độ, state, reset/async và truy cập; không test chỉ sao chép CSS. Báo kiểm tra đã chạy và giới hạn thực tế.
