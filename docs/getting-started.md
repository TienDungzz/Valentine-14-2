# Chạy Valentine Red

Cần Node.js ^22.13.0 hoặc >=24 và npm. Windows PowerShell có thể dùng npm.cmd thay npm nếu execution policy chặn npm.ps1.

```sh
npm ci
npm run dev
```

Mở URL Local mà Vite in ra. Dev dùng cổng 5179 theo vite.config.js; preview bản production dùng cổng 4173. Không mở index.html trực tiếp bằng file://.

## Kiểm tra frontend

```sh
npm test
npm run check
```

npm test chỉ chạy test nghiệp vụ/hình học/manifest của website. npm run check kiểm docs, cấu trúc, CSS, asset và chạy lint, format, cú pháp/boundary, nội dung, character integrity, glTF, mã thừa, test sản phẩm và build. Lệnh này không cần Python hoặc mạng audit sau khi dependencies đã được cài.

```sh
npm run build
npm run preview
```

Build tạo dist/. Chưa có hosting được triển khai. Xem [nghiệm thu](quality/README.md) trước khi phát hành.

## Khi sửa công cụ hoặc nguồn nhân vật

- Sửa checker/config/lint: chạy npm run test:tools.
- Sửa scripts/blender: chạy npm run check:blender; cần Python 3 trên PATH hoặc PYTHON/BLENDER_PYTHON trỏ đến executable.
- Xuất raw GLB: dùng pipeline trong [3D](3d/README.md), rồi npm run assets:optimize.
- Trước phát hành hoặc khi đổi dependency: chạy npm run audit; lỗi mạng không được coi là đã audit.
- Quét credential text: npm run check:secrets; không thay review history/binary.

Không cần mở Blender để dev, test hoặc build website. Chỉ cần Blender khi chỉnh và xuất lại nhân vật.
