# Cấu trúc thư mục — Valentine Red

## Hiện trạng và mục tiêu

Hiện có src/app, src/domain, src/engine, src/content, src/shared, public, tests, script và các bản nguồn Blender. src/features trong cây dưới là cách tách tiếp theo khi cần; UI bản đầu nằm tại src/app/main.js, chưa tạo thư mục rỗng. Giữ nguồn nhân vật hiện tại đến khi kiểm tra và di chuyển có chủ đích.

```text
docs/                         Đặc tả
art/characters/               Master nhân vật, texture nguồn
art/environment/              Sân thượng
art/props/                    Hộp và 14 chocolate
package.json                  Các lệnh check và test checker (đã có)
script/check.mjs              CLI kiểm tra (đã có)
script/lib/                   Logic kiểm tra (đã có)
script/test/                  Test hồi quy checker (đã có)
script/blender/               Chuẩn bị nhân vật, wardrobe, export, render preview
src/app/                      Khởi tạo, controller, adapter
src/domain/gift/              Schema, mapping, tiến độ, state thuần
src/features/stage/           Khung sân khấu, loading, lỗi
src/features/story-controls/  CTA, tiến độ, replay/reset
src/features/chocolate-picker/  14 nút DOM
src/features/message-dialog/  Modal
src/features/settings/        Giảm chuyển động
src/features/static-experience/  Fallback poster
src/engine/                   Loader, scene, camera, animation, picking
src/content/                  chocolates.json, shapes.js
src/shared/styles/            Tokens và style chung
src/shared/lib/               Tiện ích không phụ thuộc nghiệp vụ
public/models/characters/     GLB đạt QA
public/models/environment/    GLB sân thượng
public/models/props/          GLB hộp/chocolate
public/textures/              Texture runtime
public/posters/               Fallback
public/manifests/             Asset/node/clip/version
tests/                        Integration và hành trình chính
.qa/                          Xuất thử, preview, báo cáo
```

## Phụ thuộc và tài nguyên

app điều phối features/domain/engine qua adapter. features không truy cập scene nội bộ; engine không import React; domain không import UI/3D; shared không phụ thuộc nghiệp vụ. Validate content tại biên tải.

Không phục vụ .blend/texture master. Xuất thử vào .qa, bản đạt vào public; manifest giấy phép và script được quản lý phiên bản. Không commit dependency/cache/secret/build output. Chính sách GLB dung lượng lớn chốt theo kho thực tế.

Tên file kebab-case; node/clip theo hợp đồng hộp. Đổi tên node/nguồn phải cập nhật manifest và QA liên quan.
