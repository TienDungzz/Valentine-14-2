# Build và triển khai — Valentine Red

## Hiện trạng

Đã có ứng dụng Vite/Three.js, package.json, build và bộ checker. `npm ci` cài đúng lockfile; `npm run dev` chạy local; `npm run build` tạo dist/; `npm run preview` phục vụ bản build. Chưa có hosting/CI hoặc URL public. Xem [giới hạn QA](implementation-status.md).

## Chuẩn bị và build

Chốt stack theo ADR, ghim Node/package manager, tạo lockfile và bổ sung lệnh cài/build/check thật khi có app. Ứng dụng tĩnh tải GLB/texture đã xuất, không cần Blender hoặc secret/backend.

1. Validate đủ 14 miếng, mapping 7 + 7 và manifest.
2. Chạy typecheck/test/check theo toolchain thực tế.
3. Xác nhận GLB/poster/texture có QA và giấy phép.
4. Build production, ghi commit/asset version.
5. Kiểm output không chứa .blend, secret, .qa hoặc nguồn nội bộ.

Output thực tế hiện là dist/, base tương đối trong vite.config.js. Không phục vụ .blend hoặc .qa trong artifact.

## Hosting, path và cache

Chọn HTTPS, MIME, security headers, versioned deploy và rollback. Nếu dùng Sites trong giai đoạn phát hành thì theo workflow/manifest công cụ thực tế; không tạo project_id hoặc hosting giả trong bước docs.

URL asset tôn trọng base path, thử subpath nếu hỗ trợ. GLB/texture/decoder/font phải trả đúng MIME; file thiếu trả lỗi thật, không rewrite HTML.

HTML/manifest chưa version cần revalidate; asset hash/version cache immutable. Đổi nội dung đổi URL. Deploy asset/manifest đồng bộ, giữ bản cũ đủ rollback và phiên đang mở. Bản đầu chưa có offline/PWA.

## Kiểm trước/sau phát hành

Trên staging production build, kiểm ghép → đọc 14 → kết → replay/reset, cả mobile/bàn phím/reduced motion và fallback. Kiểm console/network, CSP/CORS/header, asset và cache trên URL thật.

Chỉ phát hành khi có yêu cầu triển khai và quality checks đạt. Ưu tiên promote cùng artifact; rebuild phải kiểm lại cấu hình/output. Báo URL/version, smoke test và phần chưa kiểm.

## Rollback

Giữ bản trước cùng asset tương ứng. Lỗi chặn đọc/chọn sai ID/sai layout thì rollback bản hoạt động, kiểm entry/asset/hành trình chính. Không chỉ hoàn tác HTML nếu asset cũ bị xóa; ghi nguyên nhân trước phát hành tiếp.
