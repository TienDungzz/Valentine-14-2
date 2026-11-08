# Bộ kiểm tra dự án

Chạy tại thư mục gốc bằng Node.js 22.12 trở lên sau npm ci. Checker tĩnh script/check.mjs chỉ dùng Node; check-assets và test hình học cần devDependencies đã khóa. Trong Windows PowerShell nếu npm.ps1 bị execution policy chặn, dùng npm.cmd thay npm.

| Lệnh | Kiểm tra |
| --- | --- |
| npm run check | Kiểm tra tĩnh và integrity GLB |
| npm run check:format | UTF-8 hợp lệ, không BOM, LF, newline cuối, khoảng trắng cuối dòng, tab thụt đầu |
| npm run check:docs | Liên kết file cục bộ trong docs |
| npm run check:content | Bảng docs: c01–c14, 14 hình/lời riêng, đúng 7 + 7 |
| npm run check:code | JSON, cú pháp JS, ranh giới module và compiler khi có TS/JSX |
| npm run test:checkers | Regression tests của chính bộ checker |
| npm test | Checker, domain, nội dung, preferences và hình học |
| npm run check:assets | Giải mã GLB, joint/clip/accessor/byte count và file bắt buộc |
| npm run assets:optimize | Tối ưu raw GLB trong .qa thành bản web |
| npm run qa:geometry | Xuất hình học runtime cho Blender kiểm tham khảo |
| npm run check:release | Tất cả check và yêu cầu có mã ứng dụng/lệnh build |

Có thể dùng node script/check.mjs trực tiếp. Lệnh check không sửa file. Sai điều kiện trả exit code 1; tham số không hợp lệ trả 2.

## Giới hạn

Đã có ứng dụng local. check:release yêu cầu có src/build và kiểm asset, nhưng không tự build hoặc chứng minh sẵn sàng phát hành. UI/thiết bị vẫn cần QA trực tiếp theo báo cáo trạng thái.

Ranh giới module quét import/export tĩnh theo đường dẫn tương đối và alias @/. Đây là kiểm tra sơ bộ, không parser/đồ thị dependency hoàn chỉnh: chưa xử lý require, dynamic import, alias khác hoặc mọi trường hợp comment/string phức tạp. Không dùng nó thay kiểm tra kiến trúc bằng compiler/linter ở giai đoạn ứng dụng.

JavaScript .js/.mjs/.cjs dùng node --check. TypeScript/JSX dưới src yêu cầu tsconfig.json và TypeScript cục bộ; thiếu sẽ báo lỗi. Compiler kiểm cấu hình project thực tế, cần bảo đảm include và strict/checkJs phù hợp khi tạo toolchain. Không tự tải hoặc thực thi công cụ từ mạng.

Kiểm định dạng không tự suy luận mức thụt lề từng ngôn ngữ, không kiểm BEM hoặc AST Python/CSS/HTML. Liên kết kiểm file đích, chưa kiểm heading anchor/reference-style Markdown. check:content áp dụng bảng tài liệu. npm test đối chiếu runtime data với bảng; check:assets giải mã GLB và kiểm joint/clip/accessor. Các kiểm tra này chưa chứng minh hình ảnh hoặc tiếp xúc tay/hộp đúng.

Hình ảnh 3D, 14 silhouette, animation tay/hộp, focus modal, hit target, reduced motion và hiệu năng phải kiểm bằng test ứng dụng/QA thực tế theo docs.

Bỏ qua binary, symlink và thư mục generated/private như node_modules, dist, .git, .qa; không bỏ qua code nguồn thông thường.
