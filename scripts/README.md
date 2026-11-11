# Công cụ Valentine Red

## Phát triển và kiểm tra frontend

```sh
npm run dev
npm test
npm run check
npm run build
npm run preview
```

Node ^22.13.0 hoặc >=24, cài dependency bằng npm ci. Không cần Python/Blender cho các lệnh trên.

| Lệnh hỗ trợ | Phạm vi |
| --- | --- |
| check:static | Docs/structure/assets/CSS; quality chưa chạy báo incomplete |
| check:config, check:docs, check:structure | Kiểm cấu hình và các đường dẫn thực |
| check:css | Token tổng và fallback bằng PostCSS |
| check:assets | Runtime budget và GLB/glTF resource |
| check:format, check:code | UTF-8/LF và cú pháp/boundary scan |
| check:content | 14 hình/lời nhắn trong bảng sản phẩm |
| check:characters | Manifest hai nhân vật, decoded geometry/joint/clip/bytes |
| check:gltf | Khronos semantic validation và report .qa/gltf |
| lint, unused | ESLint 60 dòng/unused vars; Knip cho file/export/dependency |

npm test chỉ chạy test sản phẩm ở tests/*.test.mjs. Khi sửa checker/config/lint, chạy thêm npm run test:tools cho tests/tooling/. Không đưa test framework mẫu vào luồng test sản phẩm mặc định.

## Công cụ tác giả và bảo mật riêng

| Lệnh | Khi dùng |
| --- | --- |
| test:tools | Sửa scripts/check-*, scripts/lib, ESLint hoặc policy |
| check:blender | Sửa scripts/blender; cần Python 3 hoặc PYTHON/BLENDER_PYTHON |
| assets:optimize | Sau xuất raw GLB .qa/characters; tạo bản web Meshopt/WebP |
| qa:geometry | Tạo JSON hình học để tham khảo trong Blender |
| audit | Đổi dependency hoặc trước phát hành; chặn High/Critical |
| check:secrets | Quét credential text trước phát hành |

Các script Blender giữ nguồn nhân vật ngoài public. Không tự chạy prepare chỉ để check chuẩn. Python AST không chạy bpy hoặc kiểm hình ảnh.

Checker tổng dùng project-standards.json; các scope chỉ dành cho frontend, WebGL và test sản phẩm. Checker con giữ CLI --root/--config/--json để chẩn đoán và test công cụ, không buộc website có những tầng kiến trúc của mẫu.

Mọi kết quả chỉ áp dụng phần đã chạy. CSS không chứng minh contrast, Knip không kiểm toàn asset/CSS, secret scan không bao phủ history/binary, validator không thay QA browser/mobile.
