# Ngôn ngữ, nội dung và thiết lập — Valentine Red

## Phạm vi

Tiếng Việt, lang="vi", UTF-8, font đủ dấu; chưa có bản tiếng Anh/bộ chọn ngôn ngữ. Copy tách khỏi engine, không bake chữ vào texture.

Thống nhất “chocolate đen”, “lời nhắn”, “hai nửa trái tim”; “điều thương” dùng trong copy cảm xúc. Xưng anh–em là nội dung khởi tạo có thể biên tập trong source, không có form cá nhân hóa bản đầu.

## Copy khởi tạo

| Vị trí | Nội dung |
| --- | --- |
| Tiêu đề | Hai nửa, một tình yêu |
| Nhãn | Valentine 14/2 |
| Lời dẫn | Có một món quà chỉ trọn vẹn khi có cả hai. |
| CTA đầu | Ghép hai nửa trái tim |
| Tải | Đang chuẩn bị món quà… |
| Khám phá | Chạm vào từng miếng chocolate để mở một điều thương. |
| Tiến độ | Đã mở {count}/14 lời nhắn |
| Danh sách | Chọn chocolate |
| Modal | Điều thương số {number} |
| Đóng | Đóng |
| Đủ 14 | Bạn đã mở đủ 14 điều thương. |
| CTA kết | Xem lời kết |
| Kết | 14 điều muốn nói, 2 người cùng viết tiếp. |
| Sau kết | Trở lại hộp quà · Xem lại hoạt cảnh · Bắt đầu lại |
| Lỗi | Chưa thể tải món quà. Bạn có thể thử lại hoặc đọc lời nhắn không cần 3D. |
| Phục hồi | Thử lại · Đọc lời nhắn không cần 3D |

14 lời nhắn theo [hướng dẫn hộp](frame-authoring-guide.md); source dự kiến messages.vi.ts. Chữ dài xuống dòng, không cắt dấu. Nhãn DOM như “Chocolate 01, Trái tim, đã đọc”. Tiến độ aria-live polite khi đổi; modal không đọc trùng.

## Lưu thiết lập

Key mới: valentine-red.preferences.v1. Schema: { version: 1, motion: "system" | "reduced" | "full" }. Mặc định system đọc prefers-reduced-motion; reduced luôn giảm, full ghi đè hệ thống. Chỉ theo dõi thay đổi OS khi system.

Validate JSON/version/giá trị, try/catch storage. Lỗi dùng mặc định và vẫn chỉnh được trong RAM. Chỉ ghi khi người dùng đổi. Không lưu readIds/locale/theme hoặc người nhận. Reload reset tiến độ, giữ thiết lập hợp lệ.
