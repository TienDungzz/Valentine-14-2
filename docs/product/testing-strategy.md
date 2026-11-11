# Chiến lược kiểm thử — Valentine Red

Đây là kế hoạch, chưa phải báo cáo test runtime.

## Domain và nội dung

Đúng 14 ID/hình/messageId/text khác nhau, mỗi nửa 7. Phát hiện thiếu/trùng/rỗng, tham chiếu treo và thiếu node. Chọn từng ID trả đúng lời nhắn cố định; render/resize/chọn lại không đổi.

Đọc lặp không tăng, 14 ID đạt 14/14. Modal chưa hiển thị không ghi đã đọc; ID sai không mở nội dung rỗng. Đóng lời thứ 14 không tự chạy kết.

## State và timeline

Double click chỉ một timeline; không chọn lúc ghép/mở/camera hoặc modal mở. Finale chỉ chạy khi đủ 14 và có CTA. returnToGift giữ tiến độ/hộp mở; replay về đầu giữ tiến độ; restart sau xác nhận xóa, hủy xác nhận không đổi; reload phiên mới.

Bỏ callback cũ sau reset. Reduced motion tới đúng pose/phase không cần transitionend. Đổi thiết lập giữa clip không kẹt. Retry không thêm engine/listeners.

## Hình ảnh

Hai nửa ghép một trái tim, đúng 7 + 7, c14 là một miếng hai tim nối. Tay/bàn/hộp/nắp không xuyên, không nhảy transform. Đủ 14 silhouette rõ, màu đen nâu; tóc/alpha/normal/skin đúng sau export/tối ưu.

Góc đầu thấy hai người/bàn, khám phá thấy đủ miếng không bị nắp che, kết cùng không gian. Lưu ảnh các mốc và mobile; render Blender không thay kiểm web.

## UI và truy cập

Logo/thiết lập hai góc độc lập, không header ngang; tiêu đề trên stage, lời dẫn/CTA dưới. Test 320, 390, 768, 1440 CSS px, màn hình thấp, ngang, safe area, zoom 200%.

Hoàn thành bằng bàn phím: Tab, Enter/Space, 14 nút DOM, nhãn hình/trạng thái, modal focus, Escape/trả focus. Kiểm ít nhất một trình đọc màn hình, tránh đọc trùng. Chạm không phụ thuộc hover, hit target 44px, proxy không chọn nhầm. Kiểm tương phản chữ/controls/focus.

## Lỗi và ổn định

Mô phỏng GLB/texture/manifest 404, mạng chậm, schema sai, retry, storage bị chặn, WebGL không hỗ trợ/context loss. Fallback vẫn đủ 14 nội dung/kết, giữ tiến độ đang có; asset trang trí lỗi không khóa cảnh.

Ẩn tab giữa clip, resize khi đọc, lặp 10 vòng replay/chọn/đóng để phát hiện resource tăng vô hạn. Đo production theo ngân sách hiệu năng.

## Ma trận báo cáo

Chrome/Edge desktop, Safari iOS, Chrome Android. Ghi thiết bị, phiên bản, viewport, build/commit, bước, kỳ vọng, kết quả và ảnh/log. Phần chưa thử phải ghi chưa thử. Deploy smoke test kiểm hành trình và asset/header trên URL thật.
