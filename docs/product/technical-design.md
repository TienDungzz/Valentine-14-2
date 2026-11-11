# Thiết kế kỹ thuật — Valentine Red

## Trạng thái và stack

Bản đầu đã dùng JavaScript ES modules, Vite và Three.js; UI DOM/native dialog, domain độc lập engine. React/TypeScript chưa được triển khai. Xem [trạng thái](implementation-status.md).

## State machine

Runtime hiện dùng loading → ready → assembling → exploring → finishing → completed. assembling bao gồm các đoạn đặt/ghép, mở nắp và tiến camera trong engine, chưa tách opening/focusing thành phase domain riêng.
Lỗi tải hiện hiển thị trong lớp status khi domain còn loading; retry tải lại engine. Modal là trạng thái con của exploring. Chỉ chuyển finishing khi đủ 14 ID đã đọc, modal đóng và có lệnh xem kết.

State gồm phase, selectedChocolateId hoặc null, readIds (tập ID), motionPreference, presentationMode (webgl/static), sessionToken và lỗi có kiểu.

Lệnh: startStory, selectChocolate, closeMessage, showFinale, returnToGift, replayStory, restartStory. returnToGift về exploring với hộp mở; replay về ready giữ readIds; restart về ready và xóa readIds. Reset hủy timeline/modal, đặt lại pose và bỏ callback async cũ.

## Dữ liệu

Theo [hướng dẫn hộp](frame-authoring-guide.md), validate trước ready. selectChocolate chỉ hợp lệ trong exploring khi modal đóng và ID tồn tại. Tra mapping cố định, lưu selectedChocolateId và mở modal; ghi ID khi nội dung mount thành công. Đánh dấu idempotent, không side effect trong render.

Chỉ hiện nút kết sau khi modal đóng và readIds.size === 14. Đọc lại, resize hoặc highlight không đổi nội dung hay tăng tiến độ. Không dùng random cho lời nhắn.

## Trách nhiệm

- App controller: phase, session, điều phối UI/engine.
- Domain: schema, validator, mapping, tiến độ; không import UI/Three.js.
- Engine: load/render, camera, mixer, picking, lifecycle.
- Features: stage, controls, picker DOM, modal, settings, fallback.
- Content: copy và 14 records; asset manifest riêng.

Engine API dự kiến gồm load, setViewport, playAssembly, playOpening, focusGift, playFinale, setPose, highlightChocolate, setMotionMode, pause, resume, dispose. Callback hoàn tất mang sessionToken để bỏ kết quả muộn.

## Animation và vòng đời

Một timeline sở hữu camera. Đồng bộ tay/hộp theo marker, giữ world transform khi đổi parent từ tay xuống bàn. Mốc event lấy từ clip thực đã QA, không đoán thời gian. Raycast chỉ 14 pick proxies, map qua ID trong manifest, không theo children index.

Reduced motion dùng pose đích và callback hoàn tất độc lập transitionend. Đổi tùy chọn giữa clip hoàn tất bước đang chạy hợp lệ. Pause mixer/timeline khi tab ẩn, resume không cộng thời gian ẩn.

Resize fit camera theo phase, giữ modal/tiến độ. Một owner quản renderer, listeners và GPU resources; retry không nhân đôi. Context loss giữ app state.

## Tải và fallback

Poster, schema và cảnh bắt buộc tải trước ready; báo tiến độ thật nếu đo được. Trang trí phụ lỗi cho phép cảnh giản lược. WebGL không dùng được chuyển poster + cùng domain/picker/modal, bỏ timeline bằng các bước chuyển phase hợp lệ; vẫn cần CTA bắt đầu và xem kết.

Chỉ lưu motionPreference theo tài liệu ngôn ngữ; readIds trong RAM. Website dùng asset đã xuất, không cần MCP Blender runtime.
