# DÀN Ý BÁO CÁO — 7 CHƯƠNG

**Đề tài:** Đánh giá và kiểm thử hệ thống quản lý tài chính cá nhân “Levi Finance”
**Môn:** Đánh giá và kiểm định chất lượng phần mềm (CSE703010) — ĐH Phenikaa
**Bài toán đối chiếu:** `docs/BaoCao_KiemThu_LeviFinance.md` (bản đầy đủ)

| Chương | Tên | Trang dự kiến | Người phụ trách |
|---|---|---|---|
| — | Bìa, mục lục, danh mục bảng/hình/từ viết tắt | 3–5 | Nhóm trưởng |
| Mở đầu | | 2 | Nhóm trưởng |
| 1 | Giới thiệu | 5 | TV1 |
| 2 | Phân tích và xây dựng hệ thống | 8 | TV1 |
| 3 | Kiểm thử hộp đen | 12 | TV2 |
| 4 | Kiểm thử hộp trắng | 8 | TV2 |
| 5 | Kiểm thử tự động | 10 | TV3, TV5 |
| 6 | Kiểm thử nâng cao | 8 | TV4, TV5 |
| 7 | Đánh giá và nhận xét | 6 | Nhóm trưởng |
| — | Kết luận | 2 | Nhóm trưởng |
| — | Phân công nhiệm vụ | 1 | Nhóm trưởng |
| — | Phụ lục A–C | 8 | Cả nhóm |
| | **Tổng** | **~73** | |

---

## PHẦN ĐẦU (bắt buộc, không đánh số chương)

### Bìa
- Đại học Phenikaa / Trường Công nghệ thông tin Phenikaa
- Tên môn + mã môn CSE703010
- Tên đề tài, lớp, số nhóm, danh sách thành viên (họ tên – MSV), giảng viên TS. Trương Đức Phương, năm học 2026–2027

### Mục lục, Danh mục bảng biểu, Danh mục hình vẽ, Danh mục từ viết tắt
- Từ viết tắt tối thiểu: AI, API, a11y, CI, CSV, E2E, i18n, JWT, PK/FK, RLS, SUT, UI/UX, WCAG, WBS

### MỞ ĐẦU (≈2 trang)
- Đặt vấn đề: vì sao chất lượng phần mềm tài chính cá nhân là điều kiện sống còn (sai số tiền, rò rỉ dữ liệu, vỡ giao diện trên di động)
- Giới thiệu SUT: Levi Finance (Next.js + Supabase + Gemini)
- Nêu **kết quả nổi bật dạng số**: 210 ca kiểm thử tự động, độ phủ 94,67 % dòng / 80,24 % nhánh, 9 lỗi phát hiện và khắc phục, 4 breakpoint, 13 ca bảo mật RLS
- Cấu trúc báo cáo: một đoạn giới thiệu lần lượt 7 chương

---

## CHƯƠNG 1 — GIỚI THIỆU (≈5 trang)

### 1.1 Giới thiệu bài toán
- Bốn nhu cầu của người dùng: nhập liệu nhanh · hiểu dòng tiền · kiểm soát chi tiêu · tự động hóa khoản cố định
- Đặc thù kỹ thuật: bài toán **nhiều người thuê** (multi-tenant) → tiêu chí số 1 là cách ly dữ liệu
- Rủi ro mới do AI: kết quả không tất định, phụ thuộc dịch vụ bên thứ ba → phải kiểm thử nhánh chịu lỗi

### 1.2 Mục tiêu đề tài
- MT1: Đánh giá hiện trạng chất lượng (chỉ ra điểm không kiểm thử được)
- MT2: Xây dựng hệ thống kiểm thử nhiều tầng, xuất phát từ 0 ca kiểm thử
- MT3: Kiểm chứng thuộc tính phi chức năng (RLS, WCAG AA, đáp ứng thiết bị)
- MT4: Phát hiện – phân tích – khắc phục lỗi, mỗi lỗi kèm ca hồi quy
- MT5: Thể chế hóa chất lượng vào CI

### 1.3 Phạm vi đề tài
- Bảng **trong phạm vi**: 7 nhóm chức năng (xác thực, giao dịch, ngân sách, báo cáo, AI, dữ liệu, giao diện)
- Bảng **ngoài phạm vi**: stress test, penetration test sâu, Safari/Firefox, tự động hóa OAuth Google
- Đối tượng kiểm thử: nhánh `master`, chạy dev tại `localhost:3000`, Supabase thật

### 1.4 Công nghệ sử dụng
- Bảng 1.1: công nghệ của SUT (Next.js 16, TypeScript 5, React 19, shadcn/Radix, Tailwind 4, Recharts 3, PostgreSQL/Supabase, Gemini qua AI SDK 6)
- Bảng 1.2: công nghệ kiểm thử (Vitest 3.2, Testing Library, coverage-v8, Playwright 1.63, axe-core, dotenv) + **lý do chọn**
- Bảng 1.3: ràng buộc phi chức năng NFR-01…08 (cách ly dữ liệu, toàn vẹn, a11y, đáp ứng, độ phủ ≥80 %, chịu lỗi AI, LCP/CLS, độ trễ API)

---

## CHƯƠNG 2 — PHÂN TÍCH VÀ XÂY DỰNG HỆ THỐNG (≈8 trang)

### 2.1 Mô tả hệ thống
- Mô tả Levi Finance và điểm đặc trưng: **AI tham gia cả khâu nhập liệu lẫn phân tích**
- Kiến trúc 4 khối (client · route handler · Supabase · dịch vụ ngoài) — Hình 1.1
- **Hai đặc điểm kiến trúc quyết định chiến lược kiểm thử:**
  - Client truy vấn DB **trực tiếp** bằng khóa công khai → bảo mật phụ thuộc hoàn toàn vào RLS
  - Bảo vệ trang nằm **phía trình duyệt** (`middleware.ts` rỗng) → HTML trang bảo vệ vẫn được trả cho người chưa đăng nhập

### 2.2 Các chức năng chính
- Bảng 2.1: ~24 chức năng theo 6 phân hệ, kèm quy tắc nghiệp vụ đáng chú ý
- Mục 2.2.1: **6 quy tắc nghiệp vụ rủi ro cao** (đây là phần quan trọng nhất của chương):
  1. Mẫu số trung bình = số tháng **có dữ liệu**, tối thiểu 1
  2. Ngưỡng cảnh báo ngân sách: `> 85 %` và `!isOver` → đúng 85 % **không** cảnh báo, đúng 100 % **có** cảnh báo
  3. Bề rộng thanh tiến độ `min(percent, 100)` nhưng nhãn vẫn hiện số thật
  4. Tỷ giá dự phòng `0,000039` khi API tỷ giá lỗi
  5. Chọn khóa Gemini ngẫu nhiên; hành vi khi danh sách rỗng là điểm yếu đã sửa
  6. Cộng ngày định kỳ: **quy tắc đã chứa lỗi thật** (31/01 + 1 tháng)

### 2.3 Thiết kế cơ sở dữ liệu
- Bảng 2.2–2.6: đặc tả 5 bảng (`profiles`, `categories`, `transactions`, `budgets`, `recurring_transactions`)
- Hình 2.1: sơ đồ quan hệ (dạng văn bản/ASCII)
- Bảng 2.7: ma trận quan hệ + chính sách RLS + hành vi ON DELETE
- **Ba ghi nhận trở thành mục tiêu kiểm thử:**
  - `profiles` không có policy DELETE
  - `FOR ALL` dùng `USING` làm `WITH CHECK` → phải **kiểm chứng bằng thực nghiệm**
  - `category_id` dùng SET NULL ở `transactions` nhưng CASCADE ở `budgets`

### 2.4 Giao diện chương trình
- Bảng 2.8: 11 màn hình + đường dẫn + yêu cầu đăng nhập
- Hình 2.2: luồng xác thực và phân quyền (ASCII) — nhấn mạnh trạng thái `role="status"` lúc kiểm tra phiên
- Ghi chú về hệ token trong `globals.css` (nền, chữ, viền, chart, và các cặp success/danger/warning)
- Ảnh chụp 6–7 màn hình chính (Hình 2.3–2.7)

---

## CHƯƠNG 3 — KIỂM THỬ HỘP ĐEN (≈12 trang)

### 3.1 Phân vùng tương đương và phân tích giá trị biên
- **3.1.1 Trường số tiền:** Bảng 8 vùng (V1–V8) + biểu diễn trục số + 6 giá trị biên
  - Ghi nhận: lọc ký tự khiến `-5000` → `5000` và `5000.5` → `50005` (hành vi gây nhầm lẫn, đưa vào hướng phát triển)
- **3.1.2 Trường ghi chú:** Bảng 7 vùng (rỗng → vượt giới hạn → ký tự đặc biệt → tiếng Việt có dấu)
- **3.1.3 Trường ngày:** 6 vùng, chú ý ngày cuối tháng và năm nhuận
- **3.1.4 Trường email:** 8 vùng theo biểu thức chính quy + email đã tồn tại
- **3.1.5 Cặp mật khẩu:** 4 vùng (hợp lệ, quá ngắn, không khớp, đúng biên 6 ký tự)

### 3.2 Bảng ca kiểm thử chức năng
Định dạng mỗi bảng: mã · tên ca · dữ liệu vào · kết quả mong đợi · ưu tiên · hình thức · trạng thái
- **3.2.1 Xác thực (AUTH-01…18):** đăng nhập, đăng ký, quên/đổi mật khẩu, đăng xuất, **6 trang bảo vệ chuyển hướng**
- **3.2.2 Giao dịch (TXN-01…28):** thêm/sửa/xóa, tìm kiếm, lọc kết hợp, xuất CSV (4 ca escape), hiển thị bảng vs danh sách, nhãn cho trình đọc màn hình, thứ tự sắp xếp 2 cấp
- **3.2.3 Ngân sách (BGT-01…26):** hạn mức, 5 ca ranh giới phần trăm, tổng hợp, giao dịch định kỳ, **9 ca cộng ngày (kể cả cuối tháng/năm nhuận)**
- **3.2.4 Báo cáo (RPT-01…12):** rỗng, xu hướng 6 tháng, phân bổ, màu dự phòng, mẫu số trung bình, chuyển thẻ
- **3.2.5 Trợ lý AI (AIA-01…20):** parse, quy đổi ngoại tệ, nhánh dự phòng tỷ giá, lỗi mô hình, khóa API (4 ca), quét hóa đơn, ngữ cảnh tóm tắt, timeout 10 giây

### 3.3 Kiểm thử luồng nghiệp vụ
- Bảng 14 luồng FLOW-01…14 (người dùng mới → ngân sách → vượt mức → sửa sai → xuất báo cáo → định kỳ tự động → hỏi AI → quét hóa đơn → đổi ngôn ngữ/tiền tệ → dark mode → đổi avatar → xóa dữ liệu → đăng xuất → hai người dùng song song)

### Kết chương
- Tổng 122 ca hộp đen; nêu rõ ca nào **đã phát hiện lỗi thật** và ca nào chỉ xác nhận logic đúng

---

## CHƯƠNG 4 — KIỂM THỬ HỘP TRẮNG (≈8 trang)

### 4.1 Phương pháp và tiêu chí phủ
- **4.1.1** Bảng 4 tiêu chí (statement, branch, function, line) + cách đo bằng V8 + **ngưỡng áp đặt và lý do ngưỡng nhánh thấp hơn**
- **4.1.2** Bảng ánh xạ **23 điểm quyết định D1–D23** (vị trí, điều kiện, hai nhánh cần phủ)
- **4.1.3** Phân tích đồ thị luồng điều khiển:
  - Hình 4.1 `advanceDate` **trước khi sửa** — chỉ rõ nhánh thiếu xử lý cuối tháng
  - Hình 4.2 `advanceDate` **sau khi sửa** — thêm nút `addUtcMonths` với `Math.min(day, lastDay)`

### 4.2 Phân tích độ phủ theo mô-đun
- **4.2.1** Bảng độ phủ theo tệp (10 tệp) + bảng đối chiếu ngưỡng + ảnh báo cáo độ phủ
- **4.2.2** **Phân tích các dòng/nhánh chưa phủ — phần quan trọng nhất:**
  - `db.ts` nhánh 47,05 %: giải thích do nhiều mẫu `if (error) throw`, và nêu rõ hệ quả
  - Các dòng `catch` của `uploadAvatar`
  - `analytics.ts` dòng 205 và `translate.ts` dòng 16: nhận diện **dương tính giả** của công cụ
- **4.2.3** Luận điểm phương pháp luận: **độ phủ cao ≠ bộ kiểm thử tốt**; minh chứng bằng các ca biên được thiết kế trước, và việc **chấp nhận không phủ** hai nhánh vô nghĩa thay vì viết ca hình thức

### 4.3 Đối chiếu mã nguồn – ca kiểm thử
- Bảng truy vết đầy đủ: mỗi điểm quyết định ↔ ca phủ nhánh TRUE / nhánh FALSE
- Kết luận: mọi nhánh logic quan trọng đều có ít nhất 1 ca, các ca biên phủ cả hai phía

---

## CHƯƠNG 5 — KIỂM THỬ TỰ ĐỘNG (≈10 trang)

### 5.1 Kiến trúc hệ thống kiểm thử
- **5.1.1** Hình 5.1: mô hình kim tự tháp 5 tầng kèm số ca và thời gian từng tầng
- **5.1.2** Bảng 5.1: cấu trúc thư mục `tests/` + `scripts/` + file cấu hình
- **5.1.3** **Cổng an toàn dữ liệu:** vì sao chạy trên dự án thật; 4 quy tắc của `safety-guard` (opt-in `ALLOW_WRITES_TO_LIVE`, chỉ chạm tài khoản fixture, cảnh báo hiển thị, cấm thao tác phá hủy diện rộng)

### 5.2 Kiểm thử đơn vị và thành phần
- **5.2.1** Bảng mô-đun được **tách ra khỏi giao diện** (6 mô-đun) + lý do; nhấn mạnh nguyên tắc *không đổi hành vi*
- **5.2.2** Bảng kết quả 11 tệp kiểm thử (87 ca)
- **5.2.3** Ba ca tiêu biểu kèm mã: ranh giới ngân sách · ngày cuối tháng · hợp đồng nhãn trình đọc màn hình

### 5.3 Kiểm thử API
- Phương pháp gọi trực tiếp handler với `Request` tổng hợp
- Bảng 5.3: 13 ca của 3 route + điều được kiểm chứng
- Ghi nhận: `runtime = "edge"` không được kiểm chứng thật dưới Vitest

### 5.4 Kiểm thử đầu-cuối
- **5.4.1** Chiến lược đa breakpoint + Bảng 5.4 ma trận dự án Playwright + Hình 5.2 luồng thực thi (setup → 4 viewport)
- **5.4.2** Ba nhóm khẳng định cốt lõi kèm mã: chống cuộn ngang · chống tái phát cảnh báo biểu đồ · quét axe
- **5.4.3** Bảng 5.5 kết quả theo breakpoint (97 ca, 97 đạt, ~2 phút) + log lệnh chạy thật
- **5.4.4** **Vòng lặp khắc phục điển hình** (5 vòng đưa a11y từ 6 lỗi về 0) — rút ra bài học về **kiểm tra trạng thái môi trường** khi kết quả bất ngờ

### 5.5 Tích hợp liên tục
- Bảng 5.6: 5 job CI + nguồn bí mật + timeout
- Bốn cơ chế bảo vệ: ngưỡng độ phủ là điều kiện đỏ · suite bảo mật chạy mọi lần đẩy · E2E seed lại dữ liệu · lưu báo cáo khi lỗi

---

## CHƯƠNG 6 — KIỂM THỬ NÂNG CAO (≈8 trang)

### 6.1 Kiểm thử bảo mật và cách ly dữ liệu (RLS)
- **6.1.1** Vì sao là tầng quan trọng nhất (không có tầng máy chủ trung gian nào chặn hộ)
- **6.1.2** Phương pháp 6 bước + Hình 6.1 mô hình cách ly (ASCII)
- **6.1.3** Bảng 6.1: 13 ca (5 ca đọc cách ly, đọc đúng của mình, ẩn danh, 2 ca ghi trái phép, chèn giả mạo, cascade, dọn dẹp) + log chạy thật
- **6.1.4** **Ba phát hiện:** giả định `WITH CHECK` được kiểm chứng đúng · cổng bảo vệ trang là phía trình duyệt · `profiles` không có policy DELETE

### 6.2 Kiểm thử khả năng truy cập (a11y)
- **6.2.1** Phương pháp: axe-core, thẻ WCAG 2.1 A/AA, chỉ chặn `critical`/`serious` + 3 ca bàn phím
- **6.2.2** Bảng 6.2: 6 vi phạm tương phản phát hiện được **kèm tỉ lệ đo được**
- **6.2.3** Phân tích nguyên nhân gốc + log công cụ `color-contrast.mjs`
- **6.2.4** Bảng 5 thay đổi đã thực hiện (token + độ đục) + Hình 6.2 biểu đồ diễn biến 6 → 0
- **6.2.5** Bài học: **JSDOM không tính toán màu** → không thể thay thế tầng E2E

### 6.3 Kiểm thử đáp ứng đa thiết bị
- **6.3.1** Tiêu chí “không cuộn ngang” và cách đo `scrollWidth ≤ clientWidth`
- **6.3.2** Bảng 6.3: ma trận 6 trang × 4 breakpoint
- **6.3.3** Ba điểm co giãn đã kiểm chứng (hộp thông báo, ngăn kéo di động, thanh điều hướng) + quan sát: không trang nào **thất bại ngay từ đầu** → bộ kiểm thử đóng vai trò **chốt chặn hồi quy**

### 6.4 Kiểm thử hiệu năng và hồi quy hình ảnh
- Bảng 6.4: ngân sách LCP/CLS/TTFB/kích thước gói
- Giải thích vì sao hiệu năng chỉ ở mức “đo và ghi nhận” trong đợt này (môi trường dev)
- Cải tiến hiệu năng đã có: `ResponsiveChart` loại bỏ một vòng render lãng phí
- Vì sao hồi quy hình ảnh để ở chế độ **không chặn** (khác biệt render giữa OS)

---

## CHƯƠNG 7 — ĐÁNH GIÁ VÀ NHẬN XÉT (≈6 trang)

### 7.1 Đánh giá hiệu quả bộ test
- **7.1.1** Bảng 7.1: hiệu quả theo tầng (số ca, thời gian, chi phí bảo trì, khả năng phát hiện lỗi, số lỗi đã bắt)
- **7.1.2** **Phân tích then chốt: lỗi tập trung ở hai thái cực** (đơn vị bắt lỗi logic thuần; E2E bắt lỗi chỉ tồn tại khi có CSS/bố cục; tầng giữa không bắt lỗi mới nhưng **chốt hợp đồng a11y**)
- **7.1.3** Hiệu quả của phương pháp thiết kế ca kiểm thử: 3/9 lỗi nằm ở ranh giới đúng như lý thuyết dự đoán

### 7.2 Các lỗi phát hiện được
- Bảng 7.2: 9 lỗi (mã, mô tả, mức độ, tầng phát hiện, trạng thái) + Hình 7.1 phân bố theo mức độ
- **7.2.1 BUG-02** (giao dịch định kỳ): bằng chứng trước/sau, hệ quả thực tế, nguyên nhân gốc kèm yếu tố múi giờ, bản sửa `addUtcMonths`, ca hồi quy
- **7.2.2 BUG-03** (CSV): bằng chứng trước/sau, hệ quả (lệch cột không báo lỗi), bản sửa RFC 4180
- **7.2.3 BUG-06/07** (tương phản): phạm vi ảnh hưởng toàn bộ nút, bảng token trước/sau, ghi chú phương pháp “đo thay vì đoán”, phát hiện phụ `--success` 4,45:1
- **7.2.4 BUG-05** (biểu đồ): nguyên nhân gốc tìm bằng cách **đọc mã nguồn thư viện**, bản sửa kèm mã, kiểm chứng 3 biểu đồ
- **7.2.5** Bảng 6 phát hiện không phải lỗi (FIND-01…06)

### 7.3 Ưu điểm của hệ thống
- Kiến trúc dữ liệu · khả năng chịu lỗi AI · token giao diện · đa ngôn ngữ (kèm ca kiểm tra tương đương từ điển) · chất lượng mã nguồn sau khi tách mô-đun

### 7.4 Hạn chế của hệ thống
- Độ phủ nhánh `db.ts` · môi trường dev thay vì production · chỉ Chromium · chưa penetration test thật · chưa kiểm chứng AI thật và OAuth Google · chưa đo hiệu năng/gói · dữ liệu fixture lẫn với dữ liệu thật

### 7.5 Hướng phát triển
- 8 hạng mục theo thứ tự ưu tiên (nâng độ phủ nhánh → sửa FIND-01…06 → chuyển bảo vệ trang lên máy chủ → đo hiệu năng production → mở rộng Firefox/WebKit → tách dự án Supabase riêng → penetration test → hồi quy hình ảnh chạy đêm)

---

## KẾT LUẬN (≈2 trang)
- **Kết quả đạt được:** 210 ca / 6 tầng / 2,2 phút; 94,67 % dòng, 80,24 % nhánh; 9 lỗi (5 nghiêm trọng) đã khắc phục kèm ca hồi quy
- **Kiến thức học được:** 4 bài học — tách logic khỏi giao diện · giới hạn của từng tầng (JSDOM không tính màu) · đọc mã nguồn thư viện nhanh hơn thử mò · xác minh trạng thái môi trường trước khi kết luận
- **Kinh nghiệm nhóm:** 3 bài học — thiết kế ca kiểm thử trước khi viết mã · kiểm soát dữ liệu trước khi viết test chạm dữ liệu · cổng chất lượng phải tự động mới có giá trị

## PHÂN CÔNG NHIỆM VỤ (≈1 trang)
- Bảng 6 thành viên: họ tên, MSV, nhiệm vụ chính, sản phẩm bàn giao (điền tên/MSV thật khi nộp)

## PHỤ LỤC
- **A – Danh sách ca kiểm thử đầy đủ:** A.1 đơn vị logic (56) · A.2 truy cập dữ liệu (24) · A.3 API (13) · A.4 thành phần (11) · A.5 đầu-cuối (24 × 4)
- **B – Mã nguồn kiểm thử tiêu biểu:** mock Supabase · khẳng định cách ly RLS · cổng an toàn · hook đo kích thước · công cụ đo tương phản
- **C – Câu lệnh và cấu hình:** bảng lệnh · ngưỡng độ phủ · cấu hình Playwright · biến `.env.test` · **log kết quả tổng hợp 6 lệnh**

---

## GHI CHÚ KHI VIẾT

1. **Ảnh chụp màn hình cần bổ sung:** 6–7 màn hình chính (Hình 2.3–2.7), ảnh báo cáo độ phủ, ảnh console trống sau khi sửa BUG-05, ảnh trước/sau khi sửa tương phản.
2. **Số liệu phải khớp** giữa các chương: 210 ca tổng (87 đơn vị+thành phần, 13 API, 13 bảo mật, 97 E2E), 9 lỗi, độ phủ 94,67 %/80,24 %.
3. **Bảng biểu nên đánh số lại liên tục** theo chương (Bảng 3.x chỉ nằm trong Chương 3).
4. **Không đưa mã màu cứng vào báo cáo**: mọi giá trị màu trình bày kèm tỉ lệ tương phản đo được.
5. **Điền thông tin nhóm** ở bìa và bảng phân công trước khi nộp.
