# Điều kiện chất lượng — Valentine Red

## Tài liệu

Tất cả docs cùng phạm vi 2 người, 2 nửa hộp, 14 chocolate/14 lời nhắn cố định và sân khấu trung tâm. Liên kết tương đối hợp lệ, reset/tiến độ nhất quán. Không coi file/lệnh/clip dự kiến là đã tồn tại.

## Kiểm tra tự động hiện có

Chạy `npm run check` và `npm run test:tools`; phạm vi và giới hạn theo [hướng dẫn](../../scripts/README.md). `npm run check` gọi bộ check đầy đủ, có thực thi test/build và các quality gate; vẫn không xác nhận QA thủ công của sản phẩm. Không dùng kết quả checker tĩnh để tuyên bố các tiêu chí dưới đã đạt.

## Sản phẩm

- Đúng 7 + 7 miếng, 14 hình nhận diện được và 14 thông điệp riêng.
- Đặt/ghép/mở/khám phá/kết đúng storyboard.
- Tiêu đề trên stage, lời dẫn/CTA dưới; không header ngang.
- Tiến độ tính ID duy nhất; đủ 14/14 mới hiện CTA kết sau đóng modal.
- Replay giữ, restart xóa tiến độ theo luồng.
- Dùng được bằng chuột/chạm/bàn phím, reduced motion và fallback.
- Không cắt nút/scroll ngang trên mobile và zoom.

## Kỹ thuật và tài nguyên

Nguồn được giữ, asset có giấy phép/manifest node/clip và ảnh QA. Không xuyên tay/hộp, nắp không che miếng, pick đúng ID. Build/typecheck/test theo toolchain thật đạt, không lỗi console chặn luồng.

Đo hiệu năng thực tế, kiểm cleanup/retry/reset/context loss. Khi deploy kiểm asset path, cache, header và rollback.

## Báo cáo

Phân biệt docs hoàn thành, source đã viết, asset đã xuất, QA đã chạy và web đã triển khai. Nêu file thay đổi, lý do, bằng chứng và giới hạn. Kiểm tài liệu không chứng minh Blender/web hoạt động. Lỗi sai số lượng/ánh xạ/layout hoặc chặn đọc phải sửa trước phát hành.
