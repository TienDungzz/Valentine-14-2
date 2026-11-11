# UI/UX — Sân khấu trung tâm

## Bố cục đã chọn

Một cột căn giữa, khung 3D lớn làm trọng tâm. Không hero chữ trái/cảnh phải, không màn cửa mở đầu, không header ngang.

```text
Logo nhỏ                                     Thiết lập

                  Hai nửa, một tình yêu
                      Valentine 14/2

          ┌─────────────────────────────────┐
          │                                 │
          │         KHUNG CẢNH 3D LỚN       │
          │                                 │
          └─────────────────────────────────┘

                Lời dẫn theo trạng thái
                    Đã mở 0/14
                  [ Nút hành động ]
```

Logo và thiết lập là hai phần tử độc lập ở góc trên, trong page grid, không có thanh nền chung và không đè lên chữ. Tiêu đề, stage và controls trong luồng trang. Camera thay đổi bên trong stage; không đổi sang trang khám phá khác.

## Responsive

Desktop: vùng nội dung tối đa khoảng 1200px, lề 32–48px, stage 16:9, bo 24px; tiêu đề 40–56px. Mobile: lề 16px, tiêu đề 28–36px, stage khoảng 4:5, bo 16px. Đây là giá trị khởi tạo để tinh chỉnh.

Fit camera theo bounding box từng phase và tỉ lệ stage; không chỉ crop desktop. Màn hình thấp/zoom 200% được cuộn dọc, không khóa body 100vh. Không cuộn ngang; chừa safe-area và không cắt CTA.

## Trạng thái và điều khiển dưới stage

| Trạng thái | Nội dung |
| --- | --- |
| Tải | “Đang chuẩn bị món quà…”; tiến độ thật nếu đo được |
| Sẵn sàng | Lời dẫn và “Ghép hai nửa trái tim” |
| Ghép/mở/chuyển | Mô tả ngắn, khóa kích hoạt lặp |
| Khám phá | Hướng dẫn, x/14 và “Chọn chocolate” |
| Đủ 14 sau đóng modal | “Xem lời kết” |
| Kết | Câu kết, “Trở lại hộp quà”, “Xem lại hoạt cảnh”, “Bắt đầu lại” |
| Lỗi | “Thử lại”, “Đọc lời nhắn không cần 3D” |

“Chọn chocolate” mở danh sách 14 nút DOM dưới sân khấu, có số, tên hình và trạng thái đã đọc; luôn dùng được bằng bàn phím. Dùng danh sách khi vùng chọn 3D quá nhỏ, không bắt người xem chạm chính xác vào mesh.

## Hộp thoại và truy cập

Modal có tên hình, “Điều thương số n”, lời nhắn và “Đóng”; nền kem, chữ nâu, tối đa khoảng 480px, mobile chừa lề 16px. Nội dung dài cuộn, nút đóng tiếp cận được.

Chỉ một modal; nền inert, trap focus, Escape đóng, trả focus về nút đã chọn hoặc “Chọn chocolate” nếu chọn canvas. Dùng aria-labelledby/aria-describedby, không live-announce trùng toàn nội dung. Không tự đóng/chuyển lời nhắn.

Vùng nhấn tối thiểu 44 × 44 CSS px, Enter/Space tương đương chạm, focus rõ. Trạng thái đã đọc có dấu/chữ, không chỉ màu. Chữ thường tương phản ít nhất 4.5:1, chữ lớn 3:1; kiểm cả focus và controls. Canvas có mô tả, DOM cung cấp nội dung tương đương.

## Thiết lập và fallback

Góc trên phải mở panel “Chuyển động”: Theo thiết bị / Giảm / Đầy đủ; Escape đóng và trả focus. Không có nút âm thanh hoặc theme chưa triển khai.

Tải lỗi giữ poster trong khung, không để trống. WebGL không khả dụng hoặc không phục hồi được dùng poster cùng 14 nút/modal và lời kết tĩnh; giữ tiến độ hiện có. Fallback giữ nguyên bố cục sân khấu trung tâm.
