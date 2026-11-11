# CSS của Valentine Red

File tổng: src/shared/styles/tokens.css. File dùng: src/shared/styles/main.css, import token một lần ở đầu.

- Chỉ file tổng khai báo custom properties; mỗi tên có giá trị gốc trong :root.
- Mọi var() đều có fallback không rỗng, kể cả biến lồng nhau.
- Màu, spacing, font, radius, shadow và các shorthand thiết kế dùng token.
- Giá trị layout như display/grid hoặc transform không tự động trở thành token bắt buộc.
- Không đặt custom property ở file con để né kiểm tra.

Ví dụ dùng token đang có:

```css
.message-dialog {
  color: var(--text, #35201d);
}
```

npm run check:css dùng PostCSS và value parser, scan toàn bộ src và file token. Danh sách properties trong project-standards.json bao gồm các thuộc tính mặc định đã chọn cùng font/background/border/outline.

Checker không tính cascade, computed values, contrast hoặc chứng minh stylesheet đã tải trong browser. Sau đổi token phải build và kiểm các trạng thái liên quan trên trình duyệt. Vật liệu Three.js có hệ màu riêng trong engine/asset; CSS token không đổi màu model tự động.

Không có dark/light mode; không giữ tài liệu triển khai theme chung cho một tính năng chưa dùng.
