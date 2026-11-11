# Valentine Red

Trải nghiệm Valentine: **2 người, 2 nửa trái tim, 14 chocolate đen và 14 lời nhắn riêng**. Sân khấu 3D ở giữa trang, tiêu đề phía trên và điều khiển phía dưới; không header ngang.

## Chạy tại máy

Cần Node.js ^22.13.0 hoặc >=24. Python/Blender chỉ cần khi chỉnh công cụ hoặc xuất lại nhân vật. Trong PowerShell dùng npm.cmd nếu npm.ps1 bị chặn.

```powershell
npm.cmd ci
npm.cmd run dev
```

Mở URL Local được Vite in ra (vite.config.js cấu hình cổng 5179). Không mở index.html trực tiếp từ ổ đĩa.

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

Build ở dist/. Chưa triển khai hosting. base tương đối hỗ trợ đặt bản build dưới subpath.

## Đã có

- Giao diện nền kem/đỏ rượu, sân thượng 3D, camera toàn cảnh và khám phá.
- Hai nhân vật có sẵn được chỉnh cardigan: nam yến mạch/quần nâu, nữ đỏ rượu/áo kem/jeans.
- Hoạt cảnh tay/head đã bake, chuyển động hộp/nắp/camera đồng bộ bằng timeline.
- 14 silhouette, 14 lời nhắn cố định, tiến độ ID duy nhất, đọc lại, kết và reset.
- Danh sách DOM, modal native, thiết lập giảm chuyển động và fallback poster.
- Nguồn Blender riêng, GLB Meshopt/WebP và script sản xuất/tối ưu.

## Tài nguyên và kiểm tra

Nguồn gốc tại art/characters/male-cardigan.blend và female-grey-jeans.blend được giữ nguyên. Bản chỉnh ở art/characters/valentine/, GLB web ở public/models/characters/. Xem [nguồn nhân vật](art/characters/README.md), [checker](scripts/README.md) và [tài liệu dự án](docs/README.md).

Đã kiểm logic, hình học, asset integrity và render tham khảo Blender. **Chưa kiểm trực tiếp giao diện, focus, animation và hiệu năng trên trình duyệt/điện thoại** vì Computer Use cho Chrome chưa được cấp quyền. Build/test thành công không thay cho các kiểm tra này. Xem [trạng thái triển khai](docs/product/implementation-status.md).

## Kiểm tra theo phạm vi frontend

[Hồ sơ dự án](docs/project.md) mô tả đúng cấu trúc website. npm test chạy 14 test sản phẩm; npm run check kiểm frontend/3D và build. Test checker nằm riêng trong tests/tooling, chạy bằng npm run test:tools khi sửa công cụ. Python AST, audit và secret scan là lệnh riêng theo công việc, không là điều kiện để dev website. Xem [hướng dẫn](scripts/README.md).
