# Hồ sơ kỹ thuật — Valentine Red

## Phạm vi

Frontend tĩnh có 3D: một trang, không server API, không tài khoản/database. Ngày 14 là 14 chocolate đen; tháng 2 là hai người và hai nửa hộp trái tim. Yêu cầu nghiệp vụ ở [product](product/product-requirements.md).

JavaScript ES modules, Vite 8.3.6, Three.js 0.187.0. Node ^22.13.0 hoặc >=24. Phiên bản công cụ khóa trong package-lock.json; không dùng TypeScript hoặc React.

## Cấu trúc thực tế

| Đường dẫn | Trách nhiệm |
| --- | --- |
| index.html và src/app/main.js | Entry, markup DOM, điều khiển và kết nối domain/engine |
| src/domain/gift/story.js | Validation, state machine và tiến độ ID duy nhất |
| src/content/chocolates.json | 14 record nội dung |
| src/content/shapes.js | Hình gắn cố định theo ID chocolate |
| src/engine/ | Scene lifecycle, camera, hình học hộp và sân thượng |
| src/shared/lib/preferences.js | Allowlist và persistence giảm chuyển động |
| src/shared/styles/ | Token tổng và CSS của một trang |
| public/models/characters, public/posters | GLB đã tối ưu và ảnh dự phòng |
| art/ | File nguồn để chỉnh trong Blender, không deploy |
| tests/*.test.mjs | Test sản phẩm |
| tests/tooling/ | Regression test của checker, chạy riêng khi sửa công cụ |
| scripts/ | Check website và công cụ sản xuất asset |

UI hiện có một feature, không tạo thư mục components/hooks/routes rỗng. App điều phối domain và engine; domain không import UI/Three.js; engine không import app. Không có scope backend hoặc checker framework trong cấu hình cấu trúc sản phẩm.

## Quy tắc áp dụng

ESLint: tối đa 60 dòng/hàm, gồm dòng trống/comment, không inline disable; kiểm unused vars/imports và một số API thực thi code nguy hiểm. Knip kiểm các entry của app, scripts và tests để tránh xóa nhầm dynamic import.

Một file tokens.css chứa toàn bộ custom properties. main.css dùng var() có fallback; PostCSS checker kiểm các thuộc tính thiết kế trong config. Giữ BEM và palette kem/đỏ rượu cố định. Chỉ có tiếng Việt và tùy chọn giảm chuyển động; không triển khai theme/locale selector.

Python dùng snake_case theo convention. Kiểm AST/60 dòng cho scripts/blender là công cụ sản xuất tùy chọn, không là điều kiện để chạy frontend.

## Kiểm tra và triển khai

npm run check điều phối: docs, structure, runtime budgets, CSS và 9 gate frontend: lint, format, code, content, characters, gltf, unused, test, build. npm run check:static không chạy gate và báo incomplete; không dùng kết quả đó thay full check.

npm run test:tools chỉ dùng khi thay checker/lint/config. npm run check:blender dùng khi sửa script Blender; npm run audit và check:secrets là bước bảo mật riêng trước phát hành hoặc khi đổi dependency. Không lặp lại test sản phẩm dưới tên security-tests hoặc lặp lint dưới tên SAST riêng.

Dev 5179, preview 4173, output dist/ và base tương đối. Không cần biến môi trường frontend hoặc secret. CI Windows/Linux cài Node rồi chạy cùng npm run check; không yêu cầu Python cho website.

## Asset và nghiệm thu

Runtime budget: 5 MiB/file, 15 MiB tổng các roots GLB/poster. Giới hạn này không thay số đo GPU/FPS. [Báo cáo 3D](3d/performance-report.md) vẫn ghi rõ các warning và số đo chưa có.

Nguồn nhân vật được giữ nguyên; không chỉnh .blend trong đợt tinh gọn này. Browser/mobile QA, tiếp xúc tay/hộp, accessibility và hiệu năng chưa nghiệm thu. Xem [chất lượng](quality/README.md) và [đánh giá bảo mật](security-review.md) trước khi phát hành.
