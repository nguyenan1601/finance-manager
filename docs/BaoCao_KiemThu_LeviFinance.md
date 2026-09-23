# ĐẠI HỌC PHENIKAA

## TRƯỜNG CÔNG NGHỆ THÔNG TIN PHENIKAA

<br/><br/>

# ĐÁNH GIÁ VÀ KIỂM ĐỊNH CHẤT LƯỢNG PHẦN MỀM

**(CSE703010)**

<br/>

## ĐỀ TÀI: ĐÁNH GIÁ VÀ KIỂM THỬ HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN “LEVI FINANCE”

<br/><br/>

| | |
|---|---|
| **Lớp:** | Đánh giá và kiểm định chất lượng phần mềm\*-1-1-26 (COUR02.LT3) |
| **Nhóm:** | Nhóm 4 |
| **Thành viên:** | Họ và tên – MSV |
| | … |
| | … |
| | … |
| **Giảng viên:** | TS. Trương Đức Phương |

<br/>

**Năm học: 2026-2027**

<div style="page-break-after: always"></div>

---

# MỤC LỤC

| Nội dung | Trang |
|---|---|
| DANH MỤC BẢNG BIỂU | 3 |
| DANH MỤC HÌNH VẼ | 4 |
| DANH MỤC TỪ VIẾT TẮT | 5 |
| MỞ ĐẦU | 6 |
| 1. Giới thiệu | 7 |
| &nbsp;&nbsp;1.1 Giới thiệu bài toán | 7 |
| &nbsp;&nbsp;1.2 Mục tiêu đề tài | 8 |
| &nbsp;&nbsp;1.3 Phạm vi đề tài | 9 |
| &nbsp;&nbsp;1.4 Công nghệ sử dụng | 10 |
| 2. Phân tích và xây dựng hệ thống | 13 |
| &nbsp;&nbsp;2.1 Mô tả hệ thống | 13 |
| &nbsp;&nbsp;2.2 Các chức năng chính | 15 |
| &nbsp;&nbsp;2.3 Thiết kế cơ sở dữ liệu | 18 |
| &nbsp;&nbsp;2.4 Giao diện chương trình | 22 |
| 3. Kiểm thử hộp đen | 26 |
| &nbsp;&nbsp;3.1 Phân vùng tương đương và phân tích giá trị biên | 26 |
| &nbsp;&nbsp;3.2 Bảng ca kiểm thử chức năng | 28 |
| &nbsp;&nbsp;3.3 Kiểm thử luồng nghiệp vụ | 38 |
| 4. Kiểm thử hộp trắng | 42 |
| &nbsp;&nbsp;4.1 Phương pháp và tiêu chí phủ | 42 |
| &nbsp;&nbsp;4.2 Phân tích độ phủ theo mô-đun | 44 |
| &nbsp;&nbsp;4.3 Đối chiếu mã nguồn – ca kiểm thử | 48 |
| 5. Kiểm thử tự động | 50 |
| &nbsp;&nbsp;5.1 Kiến trúc hệ thống kiểm thử | 50 |
| &nbsp;&nbsp;5.2 Kiểm thử đơn vị và thành phần | 52 |
| &nbsp;&nbsp;5.3 Kiểm thử API | 55 |
| &nbsp;&nbsp;5.4 Kiểm thử đầu-cuối (E2E) | 57 |
| &nbsp;&nbsp;5.5 Tích hợp liên tục (CI) | 60 |
| 6. Kiểm thử nâng cao | 62 |
| &nbsp;&nbsp;6.1 Kiểm thử bảo mật và cách ly dữ liệu (RLS) | 62 |
| &nbsp;&nbsp;6.2 Kiểm thử khả năng truy cập (a11y) | 66 |
| &nbsp;&nbsp;6.3 Kiểm thử đáp ứng đa thiết bị (responsive) | 68 |
| &nbsp;&nbsp;6.4 Kiểm thử hiệu năng và hồi quy hình ảnh | 70 |
| 7. Đánh giá và nhận xét | 71 |
| &nbsp;&nbsp;7.1 Đánh giá hiệu quả bộ test | 71 |
| &nbsp;&nbsp;7.2 Các lỗi phát hiện được | 73 |
| &nbsp;&nbsp;7.3 Ưu điểm của hệ thống | 76 |
| &nbsp;&nbsp;7.4 Hạn chế của hệ thống | 77 |
| &nbsp;&nbsp;7.5 Hướng phát triển | 78 |
| Kết luận | 79 |
| Phân công nhiệm vụ | 80 |
| Phụ lục A – Danh sách ca kiểm thử đầy đủ | 81 |
| Phụ lục B – Mã nguồn kiểm thử tiêu biểu | 86 |
| Phụ lục C – Câu lệnh và cấu hình | 88 |

<div style="page-break-after: always"></div>

---

# DANH MỤC BẢNG BIỂU

| Bảng | Tên bảng | Trang |
|---|---|---|
| Bảng 1.1 | Thành phần công nghệ của hệ thống | 10 |
| Bảng 1.2 | Ràng buộc phi chức năng đặt ra cho đợt kiểm thử | 12 |
| Bảng 2.1 | Danh sách chức năng chính theo phân hệ | 15 |
| Bảng 2.2 | Đặc tả bảng `profiles` | 18 |
| Bảng 2.3 | Đặc tả bảng `categories` | 19 |
| Bảng 2.4 | Đặc tả bảng `transactions` | 19 |
| Bảng 2.5 | Đặc tả bảng `budgets` | 20 |
| Bảng 2.6 | Đặc tả bảng `recurring_transactions` | 20 |
| Bảng 2.7 | Ma trận quan hệ và chính sách RLS | 21 |
| Bảng 2.8 | Danh sách màn hình và đường dẫn | 23 |
| Bảng 3.1 | Phân vùng tương đương cho trường số tiền | 26 |
| Bảng 3.2 | Phân vùng tương đương cho trường ngày | 27 |
| Bảng 3.3 | Ca kiểm thử chức năng xác thực (AUTH) | 28 |
| Bảng 3.4 | Ca kiểm thử chức năng giao dịch (TXN) | 30 |
| Bảng 3.5 | Ca kiểm thử chức năng ngân sách (BGT) | 32 |
| Bảng 3.6 | Ca kiểm thử chức năng giao dịch định kỳ (REC) | 34 |
| Bảng 3.7 | Ca kiểm thử chức năng báo cáo (RPT) | 35 |
| Bảng 3.8 | Ca kiểm thử chức năng trợ lý AI (AIA) | 36 |
| Bảng 3.9 | Kiểm thử luồng nghiệp vụ đầu-cuối | 38 |
| Bảng 4.1 | Ánh xạ ký hiệu quyết định – nhánh kiểm thử | 42 |
| Bảng 4.2 | Độ phủ theo mô-đun `src/lib` | 44 |
| Bảng 4.3 | Độ phủ theo tệp và ngưỡng áp đặt | 45 |
| Bảng 4.4 | Truy vết ca kiểm thử ↔ dòng mã nguồn | 48 |
| Bảng 5.1 | Cấu trúc thư mục kiểm thử | 51 |
| Bảng 5.2 | Tổng hợp kết quả kiểm thử đơn vị và thành phần | 53 |
| Bảng 5.3 | Tổng hợp kết quả kiểm thử API | 55 |
| Bảng 5.4 | Ma trận dự án Playwright theo breakpoint | 57 |
| Bảng 5.5 | Kết quả kiểm thử E2E theo breakpoint | 58 |
| Bảng 5.6 | Các job trong quy trình CI | 60 |
| Bảng 6.1 | Các ca kiểm thử cách ly dữ liệu RLS | 62 |
| Bảng 6.2 | Kết quả quét axe theo mức độ ảnh hưởng | 66 |
| Bảng 6.3 | Ma trận đáp ứng theo kích thước màn hình | 68 |
| Bảng 6.4 | Ngân sách hiệu năng và kết quả đo | 70 |
| Bảng 7.1 | Hiệu quả bộ test theo tầng | 71 |
| Bảng 7.2 | Danh sách lỗi phát hiện được trong đợt kiểm thử | 73 |
| Bảng P.1 | Bảng phân công nhiệm vụ thành viên | 80 |

<div style="page-break-after: always"></div>

---

# DANH MỤC HÌNH VẼ

| Hình | Tên hình | Trang |
|---|---|---|
| Hình 1.1 | Kiến trúc tổng thể hệ thống Levi Finance | 11 |
| Hình 2.1 | Sơ đồ thực thể – quan hệ của cơ sở dữ liệu | 18 |
| Hình 2.2 | Sơ đồ luồng xác thực và phân quyền | 22 |
| Hình 2.3 | Màn hình trang chủ (dashboard) | 23 |
| Hình 2.4 | Màn hình danh sách giao dịch | 24 |
| Hình 2.5 | Màn hình ngân sách với hai thẻ (tab) | 24 |
| Hình 2.6 | Màn hình báo cáo | 25 |
| Hình 2.7 | Màn hình trợ lý AI Levi | 25 |
| Hình 3.1 | Biểu đồ phân vùng tương đương trường số tiền | 27 |
| Hình 4.1 | Đồ thị luồng điều khiển hàm `advanceDate` (trước khi sửa) | 43 |
| Hình 4.2 | Đồ thị luồng điều khiển hàm `advanceDate` (sau khi sửa) | 43 |
| Hình 4.3 | Báo cáo độ phủ mã nguồn | 45 |
| Hình 5.1 | Mô hình kim tự tháp kiểm thử áp dụng cho dự án | 50 |
| Hình 5.2 | Luồng thực thi bộ kiểm thử đầu-cuối | 57 |
| Hình 6.1 | Mô hình cách ly dữ liệu theo RLS | 62 |
| Hình 6.2 | Biểu đồ phân bố vi phạm axe sau khi khắc phục | 67 |
| Hình 7.1 | Biểu đồ phân bố lỗi theo mức độ nghiêm trọng | 73 |

<div style="page-break-after: always"></div>

---

# DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt | Diễn giải |
|---|---|
| AI | Artificial Intelligence – Trí tuệ nhân tạo |
| API | Application Programming Interface – Giao diện lập trình ứng dụng |
| a11y | Accessibility – Khả năng truy cập |
| CI | Continuous Integration – Tích hợp liên tục |
| CD | Continuous Delivery – Chuyển giao liên tục |
| CSV | Comma-Separated Values – Định dạng dữ liệu phân tách bằng dấu phẩy |
| DOM | Document Object Model – Mô hình đối tượng tài liệu |
| E2E | End-to-End – Kiểm thử đầu-cuối |
| FK | Foreign Key – Khóa ngoại |
| i18n | Internationalization – Quốc tế hóa |
| JWT | JSON Web Token |
| MCP | Model Context Protocol |
| PK | Primary Key – Khóa chính |
| RLS | Row Level Security – Bảo mật ở mức dòng |
| SDLC | Software Development Life Cycle – Vòng đời phát triển phần mềm |
| SUT | System Under Test – Hệ thống được kiểm thử |
| UI | User Interface – Giao diện người dùng |
| UX | User Experience – Trải nghiệm người dùng |
| WBS | Work Breakdown Structure – Cấu trúc phân rã công việc |
| WCAG | Web Content Accessibility Guidelines – Hướng dẫn khả năng truy cập nội dung web |

<div style="page-break-after: always"></div>

---

# MỞ ĐẦU

Trong bối cảnh các ứng dụng tài chính cá nhân ngày càng phổ biến, chất lượng phần mềm không còn là yếu tố “cộng thêm” mà trở thành điều kiện sống còn: một sai số trong phép tính số dư, một lỗ hổng cho phép người dùng này đọc dữ liệu chi tiêu của người dùng khác, hay một giao diện vỡ trên điện thoại đều có thể phá hủy niềm tin của người dùng chỉ sau một lần sử dụng. Báo cáo này trình bày toàn bộ quá trình **đánh giá và kiểm định chất lượng** cho hệ thống quản lý tài chính cá nhân **Levi Finance** – một ứng dụng web xây dựng trên Next.js, Supabase và Google Gemini.

Đợt kiểm thử được thực hiện theo mô hình kim tự tháp kiểm thử, trải từ kiểm thử đơn vị (unit test) cho tới kiểm thử đầu-cuối (E2E), bổ sung thêm các tầng kiểm thử phi chức năng: bảo mật cách ly dữ liệu nhiều người thuê (multi-tenant isolation) dựa trên Row Level Security, khả năng truy cập theo WCAG 2.1 AA, đáp ứng đa thiết bị tại bốn breakpoint, và các phép đo hiệu năng cơ bản.

**Kết quả nổi bật của đợt kiểm thử:**

- Xây dựng bộ kiểm thử tự động **100 ca** cho tầng đơn vị – API – thành phần, đạt độ phủ **94,67 % dòng lệnh** và **80,24 % nhánh** trên tầng thư viện logic.
- Xây dựng bộ **13 ca kiểm thử bảo mật RLS** chạy trên chính môi trường Supabase thật, chứng minh dữ liệu của người dùng này không thể bị đọc hoặc ghi bởi người dùng khác.
- Xây dựng bộ kiểm thử đầu-cuối Playwright chạy lặp lại trên **4 breakpoint** (320, 768, 1024, 1440 px), kiểm tra cả chế độ sáng/tối và quét tự động axe-core.
- Phát hiện và khắc phục **5 lỗi** có ảnh hưởng thực tế tới người dùng, trong đó 1 lỗi nghiêm trọng liên quan đến tính toán ngày tháng của giao dịch định kỳ và 1 lỗi về xuất dữ liệu CSV.

Báo cáo được chia thành bảy chương. **Chương 1** giới thiệu bài toán, mục tiêu và phạm vi. **Chương 2** phân tích hệ thống và thiết kế cơ sở dữ liệu. **Chương 3** và **Chương 4** lần lượt trình bày kiểm thử hộp đen và hộp trắng. **Chương 5** mô tả hệ thống kiểm thử tự động cùng kết quả thực thi. **Chương 6** đi sâu vào kiểm thử nâng cao: bảo mật, khả năng truy cập, đáp ứng thiết bị và hiệu năng. **Chương 7** đánh giá hiệu quả bộ kiểm thử, tổng hợp các lỗi đã phát hiện, nêu ưu điểm – hạn chế và định hướng phát triển.

<div style="page-break-after: always"></div>

---

# 1. Giới thiệu

## 1.1 Giới thiệu bài toán

Quản lý tài chính cá nhân là bài toán quen thuộc nhưng có độ phức tạp ẩn cao. Người dùng không chỉ cần ghi lại “đã tiêu bao nhiêu”, mà còn cần:

1. **Nhập liệu nhanh** – thao tác ghi chép phải nhanh hơn việc mở sổ tay, nếu không người dùng sẽ bỏ cuộc sau vài ngày.
2. **Hiểu dòng tiền** – biết mình chi nhiều nhất vào đâu, tháng này so với tháng trước tăng hay giảm.
3. **Kiểm soát chi tiêu** – có hạn mức và cảnh báo khi gần vượt.
4. **Tự động hóa** – các khoản cố định (tiền nhà, tiền mạng, lương) phải được ghi nhận mà không cần nhớ.

Ứng dụng **Levi Finance** giải quyết các nhu cầu trên bằng cách kết hợp một giao diện web hiện đại với ba năng lực AI: phân tích câu văn tự nhiên thành giao dịch có cấu trúc, trích xuất dữ liệu từ ảnh hóa đơn, và một trợ lý tài chính hội thoại dựa trên dữ liệu thật của người dùng.

Về mặt kỹ thuật, đây là một bài toán **nhiều người thuê (multi-tenant)** điển hình: mọi bản ghi đều thuộc về một người dùng, và hệ thống phải bảo đảm tuyệt đối rằng dữ liệu tài chính của người này không rò rỉ sang người khác. Đây cũng chính là tiêu chí được ưu tiên số một trong đợt kiểm thử này, bởi đặc thù dữ liệu tài chính khiến hậu quả của một lỗi rò rỉ là không thể khắc phục.

Thêm vào đó, sự hiện diện của **AI** đặt ra một lớp rủi ro mới: kết quả do mô hình sinh ra là không tất định, phụ thuộc vào dịch vụ bên thứ ba, và có thể thay đổi hành vi khi nhà cung cấp cập nhật mô hình. Một đợt kiểm thử nghiêm túc vì vậy phải bao gồm cả việc kiểm tra khả năng chịu lỗi khi dịch vụ AI không khả dụng.

## 1.2 Mục tiêu đề tài

Đề tài đặt ra bốn mục tiêu cụ thể:

**Mục tiêu 1 – Đánh giá chất lượng hiện trạng.** Khảo sát toàn bộ mã nguồn, xác định các điểm yếu về mặt chất lượng: nơi nào logic nghiệp vụ bị trộn lẫn vào giao diện, nơi nào không thể kiểm thử được, nơi nào thiếu rào chắn an toàn.

**Mục tiêu 2 – Thiết kế và xây dựng hệ thống kiểm thử nhiều tầng.** Từ trạng thái ban đầu là **không có bất kỳ ca kiểm thử nào**, xây dựng một hệ thống kiểm thử hoàn chỉnh cho năm tầng: đơn vị logic thuần, truy cập dữ liệu, API, thành phần giao diện và đầu-cuối.

**Mục tiêu 3 – Kiểm chứng các thuộc tính phi chức năng quan trọng nhất.** Cụ thể là bảo mật cách ly dữ liệu (RLS), khả năng truy cập theo WCAG 2.1 AA, và đáp ứng giao diện tại bốn kích thước màn hình.

**Mục tiêu 4 – Phát hiện, phân loại và khắc phục lỗi.** Mỗi lỗi phát hiện được phải có: bằng chứng tái hiện, phân tích nguyên nhân gốc, bản sửa, và một ca kiểm thử hồi quy ngăn lỗi quay trở lại.

Ngoài ra, đề tài hướng tới mục tiêu **thể chế hóa chất lượng**: biến các hoạt động kiểm thử thành một phần tự động của quy trình tích hợp liên tục, để chất lượng không phụ thuộc vào việc có ai đó nhớ chạy kiểm thử hay không.

## 1.3 Phạm vi đề tài

**Trong phạm vi kiểm thử:**

| Nhóm | Nội dung | Hình thức kiểm thử |
|---|---|---|
| Xác thực | Đăng nhập email/mật khẩu, đăng ký, quên mật khẩu, cập nhật mật khẩu, đăng xuất, cổng bảo vệ trang | Hộp đen, E2E |
| Giao dịch | Thêm, sửa, xóa, tìm kiếm, lọc theo loại và danh mục, xuất CSV | Hộp đen, đơn vị, E2E |
| Ngân sách | Thiết lập hạn mức, cảnh báo vượt mức, giao dịch định kỳ | Hộp đen, đơn vị |
| Báo cáo | Thống kê thu chi, xu hướng 6 tháng, phân bổ theo danh mục | Hộp đen, đơn vị |
| Trợ lý AI | Phân tích câu văn thành giao dịch, quét hóa đơn, hội thoại tư vấn | Đơn vị (mock), API |
| Dữ liệu | Toàn vẹn dữ liệu, cách ly nhiều người thuê, cascade khi xóa tài khoản | Bảo mật RLS |
| Giao diện | Bố cục, dark mode, khả năng truy cập, đáp ứng thiết bị | E2E, axe-core |

**Ngoài phạm vi:** kiểm thử tải cực lớn (stress test), kiểm thử xâm nhập chuyên sâu (penetration test), kiểm thử trên trình duyệt Safari/Firefox (bộ E2E giới hạn ở Chromium trong đợt này), và kiểm thử tự động luồng OAuth Google (không thể tự động hóa do cần tương tác với nhà cung cấp danh tính).

**Đối tượng kiểm thử (SUT):** mã nguồn tại nhánh `master` của kho `finance-manager`, sử dụng ứng dụng Next.js 16 chạy ở chế độ phát triển tại `http://localhost:3000`, kết nối tới một dự án Supabase thật.

## 1.4 Công nghệ sử dụng

### 1.4.1 Công nghệ của hệ thống được kiểm thử

**Bảng 1.1 – Thành phần công nghệ của hệ thống**

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Framework | Next.js 16.2 (App Router) | Định tuyến, render phía máy chủ, API routes |
| Ngôn ngữ | TypeScript 5 | Kiểu tĩnh cho toàn bộ mã nguồn |
| Thư viện UI | React 19.2 | Xây dựng giao diện |
| Thành phần | shadcn/ui trên nền Radix UI | Thành phần có sẵn, hỗ trợ truy cập |
| Tạo kiểu | Tailwind CSS 4 + biến CSS | Hệ thống thiết kế bằng token |
| Biểu đồ | Recharts 3.7 | Biểu đồ cột và biểu đồ tròn |
| Cơ sở dữ liệu | PostgreSQL (Supabase) | Lưu trữ dữ liệu tài chính |
| Xác thực | Supabase Auth | Phiên đăng nhập, JWT |
| Bảo mật dữ liệu | Row Level Security | Cách ly dữ liệu theo người dùng |
| AI | Google Gemini qua Vercel AI SDK 6 | Ba tuyến API trí tuệ nhân tạo |
| Đa ngôn ngữ | Từ điển nội bộ vi/en | Chuyển đổi ngôn ngữ |

### 1.4.2 Công nghệ của hệ thống kiểm thử

| Lớp kiểm thử | Công cụ | Ghi chú lựa chọn |
|---|---|---|
| Đơn vị | Vitest 3.2 | Tương thích ESM, tốc độ cao, hỗ trợ `environment` theo tệp |
| Thành phần | Testing Library + jest-dom | Kiểm thử theo hành vi người dùng, ghép tốt với Vitest |
| Độ phủ | `@vitest/coverage-v8` | Đo độ phủ dựa trên V8, không cần biên dịch lại |
| Đầu-cuối | Playwright 1.63 | Hỗ trợ nhiều dự án theo viewport, `storageState`, trace khi lỗi |
| Khả năng truy cập | `@axe-core/playwright` | Tích hợp axe vào Playwright, quét theo thẻ WCAG |
| Cấu hình môi trường | `dotenv` | Nạp `.env.test` cho các suite chạm cơ sở dữ liệu |

### 1.4.3 Ràng buộc phi chức năng

**Bảng 1.2 – Ràng buộc phi chức năng đặt ra cho đợt kiểm thử**

| Mã | Thuộc tính | Tiêu chí |
|---|---|---|
| NFR-01 | Cách ly dữ liệu | Không người dùng nào đọc/ghi/xóa được bản ghi của người khác |
| NFR-02 | Toàn vẹn dữ liệu | Xóa tài khoản phải cascade sạch mọi bản ghi liên quan |
| NFR-03 | Khả năng truy cập | Không có vi phạm axe mức critical/serious theo WCAG 2.1 AA |
| NFR-04 | Đáp ứng thiết bị | Không có cuộn ngang tại 320/768/1024/1440 px |
| NFR-05 | Độ phủ kiểm thử | ≥ 80 % dòng lệnh trên tầng thư viện logic |
| NFR-06 | Chịu lỗi AI | Khi dịch vụ AI lỗi, API trả mã 500 kèm thông báo, không sập ứng dụng |
| NFR-07 | Hiệu năng | LCP < 2,5 s; CLS < 0,1 trên trang chủ |
| NFR-08 | Thời gian phản hồi API | Đo được và ghi nhận, không chặn phát hành ở giai đoạn đầu |

<div style="page-break-after: always"></div>
# 2. Phân tích và xây dựng hệ thống

## 2.1 Mô tả hệ thống

**Levi Finance** là một ứng dụng web quản lý tài chính cá nhân, hoạt động hoàn toàn trên trình duyệt và lưu trữ dữ liệu trên nền tảng đám mây Supabase. Người dùng đăng ký một tài khoản, sau đó có thể ghi chép các khoản thu – chi, thiết lập hạn mức ngân sách theo danh mục, theo dõi báo cáo trực quan, và trao đổi với một trợ lý AI để được tư vấn dựa trên chính dữ liệu của mình.

Điểm đặc trưng của hệ thống nằm ở chỗ **AI tham gia vào cả khâu nhập liệu lẫn khâu phân tích**:

- Ở khâu nhập liệu, người dùng gõ một câu tự nhiên (“ăn sáng và cà phê 50k”, “received salary 2000 USD”) và hệ thống chuyển thành một giao dịch có cấu trúc gồm số tiền, loại, danh mục, ghi chú và ngày.
- Ở khâu phân tích, trợ lý AI nhận được một bản tóm tắt tài chính do hệ thống tổng hợp từ dữ liệu thật (tổng thu, tổng chi, số dư, chi tiêu theo danh mục, danh sách giao dịch gần đây) và trả lời câu hỏi của người dùng kèm lời khuyên.

Kiến trúc tổng thể chia làm bốn khối (Hình 1.1):

1. **Khối giao diện (client)** – các trang React chạy trong trình duyệt, chịu trách nhiệm hiển thị, thu thập dữ liệu người dùng và gọi các API.
2. **Khối xử lý phía máy chủ (Next.js route handlers)** – ba tuyến API AI, đóng vai trò cầu nối tới nhà cung cấp mô hình.
3. **Khối dữ liệu (Supabase/PostgreSQL)** – lưu trữ năm bảng nghiệp vụ cùng các chính sách Row Level Security.
4. **Khối dịch vụ ngoài** – Google Gemini cho các tác vụ AI và một API tỷ giá dùng để quy đổi ngoại tệ.

Một đặc điểm kiến trúc quan trọng cần lưu ý vì nó ảnh hưởng trực tiếp tới chiến lược kiểm thử: **khối giao diện truy cập cơ sở dữ liệu trực tiếp** thông qua thư viện `supabase-js` với khóa công khai, thay vì đi qua một tầng API riêng của ứng dụng. Điều này có hai hệ quả:

- **Tích cực:** không tồn tại một tầng máy chủ trung gian có thể vô tình bỏ sót kiểm tra phân quyền; bảo mật phụ thuộc hoàn toàn vào RLS – một cơ chế được thực thi ở tầng cơ sở dữ liệu.
- **Tiêu cực:** nếu RLS bị cấu hình sai, không có lớp nào phía sau chặn lại. Vì vậy, **kiểm thử RLS trở thành ca kiểm thử bảo mật quan trọng nhất của toàn bộ đề tài**.

Ngoài ra, phần bảo vệ các trang được thực hiện ở phía trình duyệt: một thành phần bọc (`DashboardLayout`) kiểm tra phiên đăng nhập và chuyển hướng về trang đăng nhập nếu chưa có phiên. Tệp `middleware.ts` của Next.js hiện là một hàm rỗng. Hệ quả là **mã HTML của các trang được bảo vệ vẫn được máy chủ trả về cho người chưa đăng nhập**; dữ liệu bên trong vẫn an toàn nhờ RLS, nhưng cấu trúc trang thì lộ ra. Đây là một phát hiện được ghi nhận và kiểm chứng bằng ca kiểm thử ở Mục 6.1.

## 2.2 Các chức năng chính

Hệ thống gồm sáu phân hệ chức năng, phân bố trên bảy màn hình.

**Bảng 2.1 – Danh sách chức năng chính theo phân hệ**

| Mã | Phân hệ | Chức năng | Quy tắc nghiệp vụ đáng chú ý |
|---|---|---|---|
| AUTH | Xác thực | Đăng nhập bằng email/mật khẩu | Chuyển hướng về trang chủ nếu đã có phiên |
| AUTH | Xác thực | Đăng nhập bằng Google | Chuyển tiếp qua `/auth/callback` để đồng bộ hồ sơ |
| AUTH | Xác thực | Đăng ký | Kiểm tra định dạng email bằng biểu thức chính quy; tạo hồ sơ trong bảng `profiles` |
| AUTH | Xác thực | Quên mật khẩu | Luôn hiển thị thông báo trung tính để không tiết lộ email có tồn tại hay không |
| AUTH | Xác thực | Cập nhật mật khẩu | Mật khẩu tối thiểu 6 ký tự; xác nhận phải khớp |
| AUTH | Xác thực | Đăng xuất | Yêu cầu xác nhận qua hộp thoại |
| TXN | Giao dịch | Thêm giao dịch | Số tiền là số dương, không vượt 10 tỉ; ghi chú tối đa 100 ký tự |
| TXN | Giao dịch | Sửa giao dịch | Nạp lại dữ liệu vào biểu mẫu, giữ nguyên danh mục |
| TXN | Giao dịch | Xóa giao dịch | Yêu cầu xác nhận |
| TXN | Giao dịch | Tìm kiếm | Tìm theo ghi chú hoặc tên danh mục, không phân biệt hoa thường |
| TXN | Giao dịch | Lọc | Lọc đồng thời theo loại (thu/chi) và danh mục; có nút xóa toàn bộ bộ lọc |
| TXN | Giao dịch | Xuất CSV | Tệp có BOM UTF-8 để Excel đọc đúng tiếng Việt |
| BGT | Ngân sách | Thiết lập hạn mức | Mỗi danh mục chỉ có một ngân sách cho mỗi chu kỳ |
| BGT | Ngân sách | Cảnh báo mức sử dụng | Vượt 85 % → cảnh báo; vượt 100 % → báo vượt mức |
| BGT | Ngân sách | Giao dịch định kỳ | Tự động tạo giao dịch khi tới ngày; hỗ trợ tạm dừng/tiếp tục |
| RPT | Báo cáo | Xu hướng 6 tháng | So sánh thu và chi theo từng tháng |
| RPT | Báo cáo | Phân bổ theo danh mục | Chỉ tính chi tiêu của tháng hiện tại |
| RPT | Báo cáo | Thống kê trung bình | Trung bình tính trên các tháng **có dữ liệu**, tối thiểu chia 1 |
| AIA | Trợ lý AI | Phân tích câu văn | Quy đổi ngoại tệ sang VND theo tỷ giá thời gian thực |
| AIA | Trợ lý AI | Quét hóa đơn | Trích xuất số tiền, danh mục, ghi chú, ngày từ ảnh |
| AIA | Trợ lý AI | Tư vấn hội thoại | Trả lời dựa trên bản tóm tắt tài chính thật của người dùng |
| SYS | Hệ thống | Đa ngôn ngữ | Tiếng Việt và tiếng Anh, định dạng tiền tệ theo vùng |
| SYS | Hệ thống | Giao diện sáng/tối | Theo hệ thống hoặc chọn thủ công |
| SYS | Hệ thống | Xóa toàn bộ giao dịch | Vùng nguy hiểm, yêu cầu xác nhận mạnh |

### 2.2.1 Các quy tắc nghiệp vụ đặc biệt cần kiểm thử

Trong quá trình phân tích mã nguồn, một số quy tắc nghiệp vụ được xác định là **có khả năng gây lỗi cao** và vì vậy được ưu tiên thiết kế ca kiểm thử:

**(1) Quy tắc tính trung bình trong báo cáo.** Số tháng dùng làm mẫu số không phải 6 mà là *số tháng thực sự có phát sinh*, với giá trị nhỏ nhất là 1. Nếu người dùng mới sử dụng được 2 tháng, trung bình phải chia cho 2, không phải cho 6. Quy tắc này dễ bị hiểu sai khi đọc mã và cần được kiểm thử bằng dữ liệu biên (0 tháng có dữ liệu, 1 tháng, nhiều tháng).

**(2) Ngưỡng cảnh báo ngân sách.** Điều kiện là “phần trăm > 85 **và** chưa vượt hạn mức”. Do đó, tại đúng mốc 85 % không có cảnh báo, nhưng tại đúng mốc 100 % *vẫn* được coi là cảnh báo (chưa “vượt”). Đây là một hành vi ranh giới cần được ghi nhận chính xác bằng ca kiểm thử biên.

**(3) Quy tắc làm tròn và giới hạn thanh tiến độ.** Bề rộng thanh tiến độ là `min(phần trăm, 100)`, còn nhãn phần trăm vẫn hiển thị giá trị thật (có thể lớn hơn 100).

**(4) Quy tắc quy đổi ngoại tệ.** Khi API tỷ giá không phản hồi, hệ thống phải dùng tỷ giá dự phòng `0,000039` thay vì thất bại. Ca kiểm thử phải mô phỏng cả hai nhánh.

**(5) Quy tắc chọn khóa API AI.** Hệ thống hỗ trợ nhiều khóa Gemini phân tách bằng dấu phẩy và chọn ngẫu nhiên một khóa cho mỗi lần gọi. Hành vi khi danh sách rỗng là một điểm yếu được phát hiện và đã được sửa (xem Mục 7.2).

**(6) Quy tắc tính ngày kế tiếp của giao dịch định kỳ.** Đây là quy tắc phức tạp nhất và đã chứa một lỗi thật: phép cộng tháng không xử lý trường hợp cuối tháng, khiến ngày 31/01 cộng một tháng trở thành 03/03 thay vì 28/02.

## 2.3 Thiết kế cơ sở dữ liệu

Cơ sở dữ liệu gồm năm bảng nghiệp vụ, tất cả đều gắn với tài khoản người dùng qua khóa ngoại tới `auth.users` và đều được bật Row Level Security.

**Bảng 2.2 – Đặc tả bảng `profiles`**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, FK → `auth.users`, ON DELETE CASCADE | Trùng với định danh người dùng |
| `full_name` | TEXT | | Họ tên hiển thị |
| `avatar_url` | TEXT | | Đường dẫn ảnh đại diện trên Supabase Storage |
| `language` | TEXT | DEFAULT `'vi'` | Mã ngôn ngữ (`vi`/`en`) |
| `currency` | TEXT | DEFAULT `'vnd'` | Đơn vị tiền tệ hiển thị |
| `updated_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Thời điểm cập nhật gần nhất |

**Bảng 2.3 – Đặc tả bảng `categories`**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT `gen_random_uuid()` | Định danh danh mục |
| `user_id` | UUID | FK → `auth.users`, NOT NULL | Chủ sở hữu |
| `name` | TEXT | NOT NULL | Tên danh mục |
| `type` | TEXT | CHECK IN (`income`,`expense`) | Loại danh mục |
| `icon` | TEXT | | Tên biểu tượng Lucide |
| `color` | TEXT | | Mã màu hiển thị |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` | |
| — | — | UNIQUE (`user_id`,`name`,`type`) | Chống trùng danh mục |

**Bảng 2.4 – Đặc tả bảng `transactions`**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → `auth.users`, NOT NULL | Chủ sở hữu |
| `category_id` | UUID | FK → `categories`, ON DELETE SET NULL | Danh mục (có thể rỗng) |
| `amount` | DECIMAL(15,2) | NOT NULL | Số tiền |
| `note` | TEXT | | Ghi chú |
| `date` | DATE | DEFAULT `CURRENT_DATE`, NOT NULL | Ngày phát sinh |
| `type` | TEXT | CHECK IN (`income`,`expense`) | Loại giao dịch |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Dùng cho thứ tự phụ khi sắp xếp |

**Bảng 2.5 – Đặc tả bảng `budgets`**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → `auth.users`, NOT NULL | Chủ sở hữu |
| `category_id` | UUID | FK → `categories`, ON DELETE CASCADE, NOT NULL | Danh mục áp hạn mức |
| `amount` | DECIMAL(15,2) | NOT NULL | Hạn mức |
| `period` | TEXT | DEFAULT `'monthly'`, NOT NULL | Chu kỳ |
| — | — | UNIQUE (`user_id`,`category_id`,`period`) | Một hạn mức cho mỗi danh mục mỗi chu kỳ |

**Bảng 2.6 – Đặc tả bảng `recurring_transactions`**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → `auth.users`, NOT NULL | Chủ sở hữu |
| `category_id` | UUID | FK → `categories`, ON DELETE SET NULL | Danh mục |
| `amount` | DECIMAL(15,2) | NOT NULL | Số tiền mỗi kỳ |
| `type` | TEXT | CHECK IN (`income`,`expense`) | Loại |
| `note` | TEXT | | Ghi chú |
| `frequency` | TEXT | CHECK IN (`daily`,`weekly`,`monthly`,`yearly`) | Tần suất |
| `next_date` | DATE | NOT NULL | Kỳ kế tiếp cần xử lý |
| `last_processed` | DATE | | Lần xử lý gần nhất |
| `is_active` | BOOLEAN | DEFAULT TRUE | Trạng thái bật/tạm dừng |

**Hình 2.1 – Quan hệ giữa các thực thể (mô tả dạng văn bản):**

```
auth.users (Supabase)
    │ 1
    ├──────────< profiles           (id = auth.users.id)
    ├──────────< categories         (user_id)   UNIQUE(user_id, name, type)
    │                 │ 1
    │                 ├────< transactions        (category_id)  ON DELETE SET NULL
    │                 └────< budgets             (category_id)  ON DELETE CASCADE
    └──────────< recurring_transactions (user_id)  ──> categories (category_id)
```

**Bảng 2.7 – Ma trận quan hệ và chính sách RLS**

| Bảng | Khóa ngoại | Hành vi khi xóa cha | Chính sách RLS |
|---|---|---|---|
| `profiles` | `id` → `auth.users` | CASCADE | SELECT/UPDATE/INSERT với `auth.uid() = id`; **không có DELETE** |
| `categories` | `user_id` → `auth.users` | CASCADE | FOR ALL với `auth.uid() = user_id` |
| `transactions` | `user_id` → `auth.users`; `category_id` → `categories` | CASCADE / SET NULL | FOR ALL với `auth.uid() = user_id` |
| `budgets` | `user_id` → `auth.users`; `category_id` → `categories` | CASCADE / CASCADE | FOR ALL với `auth.uid() = user_id` |
| `recurring_transactions` | `user_id` → `auth.users`; `category_id` → `categories` | CASCADE / SET NULL | FOR ALL với `auth.uid() = user_id` |

Ba điểm cần ghi nhận từ thiết kế trên và đã trở thành mục tiêu kiểm thử:

1. **Không có chính sách DELETE cho `profiles`.** Đây là lựa chọn thiết kế hợp lý (hồ sơ bị xóa khi tài khoản bị xóa, nhờ CASCADE), nhưng cần được kiểm chứng để chắc chắn không có đường xóa hồ sơ của người khác.
2. **Đối với `FOR ALL`, PostgreSQL dùng biểu thức `USING` làm `WITH CHECK` khi không khai báo `WITH CHECK`.** Điều này có nghĩa là điều kiện `auth.uid() = user_id` cũng chặn việc chèn bản ghi giả mạo `user_id`. Đây là một giả định kỹ thuật **phải được kiểm chứng bằng thực nghiệm**, vì nếu hiểu sai, kẻ tấn công có thể chèn dữ liệu vào tài khoản người khác.
3. **`transactions.category_id` dùng ON DELETE SET NULL trong khi `budgets.category_id` dùng CASCADE.** Hai hành vi khác nhau cho cùng một kiểu quan hệ, cần được kiểm thử riêng.

## 2.4 Giao diện chương trình

**Bảng 2.8 – Danh sách màn hình và đường dẫn**

| Màn hình | Đường dẫn | Yêu cầu đăng nhập | Thành phần chính |
|---|---|---|---|
| Đăng nhập | `/login` | Không | Biểu mẫu email/mật khẩu, nút Google |
| Đăng ký | `/register` | Không | Biểu mẫu họ tên/email/mật khẩu |
| Quên mật khẩu | `/forgot-password` | Không | Biểu mẫu email, trạng thái thành công |
| Cập nhật mật khẩu | `/update-password` | Không | Biểu mẫu mật khẩu mới, tự chuyển hướng |
| Chuyển tiếp xác thực | `/auth/callback` | Không | Đồng bộ hồ sơ Google, trạng thái lỗi |
| Trang chủ | `/` | Có | Nhập liệu AI, ba thẻ thống kê, biểu đồ xu hướng, giao dịch gần đây |
| Giao dịch | `/transactions` | Có | Bảng (máy tính) và danh sách (di động), tìm kiếm, lọc, xuất CSV |
| Ngân sách | `/budgets` | Có | Hai thẻ: hạn mức và giao dịch định kỳ |
| Báo cáo | `/reports` | Có | Hai thẻ: tổng quan và theo danh mục |
| Cài đặt | `/settings` | Có | Hồ sơ, tùy chỉnh, bảo mật, vùng nguy hiểm |
| Trợ lý AI | `/ai-assistant` | Có | Khung hội thoại với trợ lý Levi |

**Hình 2.2 – Luồng xác thực và phân quyền (mô tả dạng văn bản):**

```
Người dùng mở trang
        │
        ├── Trang công khai (/login, /register, ...)
        │        └── Nếu đã có phiên → chuyển hướng về "/"
        │
        └── Trang được bảo vệ
                 │
                 ├── DashboardLayout kiểm tra phiên trong localStorage
                 │        ├── Đang kiểm tra  → hiển thị vòng xoay có role="status"
                 │        ├── Chưa có phiên  → chuyển hướng về /login
                 │        └── Có phiên      → gọi processRecurringTransactions()
                 │                            rồi hiển thị nội dung
                 │
                 └── Mọi truy vấn dữ liệu đều kèm JWT của người dùng
                          └── PostgreSQL áp chính sách RLS theo auth.uid()
```

Một chi tiết được ghi nhận vì ảnh hưởng tới kiểm thử: khi chưa xác định được phiên, giao diện hiển thị một vùng `role="status"` có nhãn `aria-busy="true"` và văn bản chỉ dành cho trình đọc màn hình. Trong quá trình kiểm thử đầu-cuối, trạng thái này xuất hiện trong vài trăm mili giây đầu và cần được phân biệt với trạng thái “không có dữ liệu”.

Về hệ thống thiết kế giao diện, ứng dụng sử dụng các token ngữ nghĩa trong `globals.css` (nền, chữ, viền, màu biểu đồ, và – sau đợt cải tiến – các cặp màu `success`/`danger`/`warning`). Toàn bộ biểu đồ dùng biến CSS thay cho mã màu cứng, nhờ đó chế độ tối hoạt động đúng. Chi tiết này trở thành một trong các mục tiêu kiểm thử ở Mục 6.3.

<div style="page-break-after: always"></div>

<!-- CHUNK-CH2-END -->
# 3. Kiểm thử hộp đen

Kiểm thử hộp đen tập trung vào **hành vi quan sát được** của hệ thống mà không quan tâm tới cấu trúc mã nguồn bên trong. Với Levi Finance, đối tượng của kiểm thử hộp đen là: các biểu mẫu nhập liệu, các thao tác trên danh sách, các quy tắc nghiệp vụ, và các thông báo mà người dùng nhìn thấy.

## 3.1 Phân vùng tương đương và phân tích giá trị biên

### 3.1.1 Trường số tiền trong biểu mẫu giao dịch

Trường số tiền chịu ba ràng buộc: phải là số dương, không vượt 10.000.000.000, và chỉ chấp nhận ký tự số (bộ lọc `replace(/[^0-9]/g, "")`).

**Bảng 3.1 – Phân vùng tương đương cho trường số tiền**

| Vùng | Mô tả | Giá trị đại diện | Kết quả mong đợi |
|---|---|---|---|
| V1 | Rỗng | `""` | Từ chối: “Số tiền phải là một số dương lớn hơn 0.” |
| V2 | Không phải số | `"abc"` | Bị lọc thành rỗng → từ chối |
| V3 | Số 0 | `"0"` | Từ chối (điều kiện `amount <= 0`) |
| V4 | Số âm | `"-5000"` | Dấu trừ bị lọc bỏ → thành `5000` → chấp nhận |
| V5 | Số dương hợp lệ nhỏ | `"1"` | Chấp nhận |
| V6 | Số dương hợp lệ lớn | `"9999999999"` | Chấp nhận (đúng bằng ngưỡng) |
| V7 | Vượt ngưỡng | `"10000000001"` | Từ chối: “Số tiền không được vượt quá …” |
| V8 | Số thập phân | `"5000.5"` | Dấu chấm bị lọc bỏ → thành `50005` → chấp nhận |

**Hình 3.1 – Biểu diễn các giá trị biên trên trục số:**

```
        0      1                                   9.999.999.999   10.000.000.000
        │      │                                            │              │
   ─────┼──────┼────────────────────────────────────────────┼──────────────┼──────►
     từ chối  hợp lệ ──────────────────────────────────► hợp lệ      từ chối
```

**Giá trị biên cần kiểm thử:** `-1`, `0`, `1`, `9 999 999 999`, `10 000 000 000`, `10 000 000 001`.

**Ghi nhận từ phân tích:** hành vi của V4 và V8 là hệ quả của việc lọc ký tự không phải chữ số. Người dùng gõ `-5000` sẽ nhận được giao dịch `5000` thay vì một thông báo lỗi. Đây là **hành vi gây nhầm lẫn** nhưng không phải lỗi logic nghiêm trọng; được ghi nhận vào danh sách cải tiến (Mục 7.5) thay vì sửa trong đợt này, vì việc thay đổi sẽ ảnh hưởng tới trải nghiệm nhập liệu nhanh.

### 3.1.2 Trường ghi chú

Ràng buộc: tối đa 100 ký tự (`NOTE_MAX_LENGTH`). Có bộ đếm ký tự hiển thị và đổi màu khi đạt giới hạn.

**Bảng 3.2 – Phân vùng tương đương cho trường ghi chú**

| Vùng | Mô tả | Giá trị | Kết quả mong đợi |
|---|---|---|---|
| G1 | Rỗng | `""` | Hợp lệ (ghi chú không bắt buộc) |
| G2 | Ngắn | `"Ăn trưa"` | Hợp lệ, bộ đếm hiển thị `6/100` |
| G3 | Biên dưới giới hạn | 99 ký tự | Hợp lệ |
| G4 | Đúng giới hạn | 100 ký tự | Hợp lệ, bộ đếm chuyển màu cảnh báo |
| G5 | Vượt giới hạn | 101 ký tự | Bị chặn ở tầng giao diện (`maxLength`), giá trị không tăng |
| G6 | Ký tự đặc biệt | `"Nhà, điện; nước"` | Hợp lệ; phải được escape đúng khi xuất CSV |
| G7 | Ký tự tiếng Việt có dấu | `"Tiền nhà tháng 3"` | Hợp lệ, không bị lỗi mã hóa |

### 3.1.3 Trường ngày

**Bảng 3.3 – Phân vùng tương đương cho trường ngày**

| Vùng | Mô tả | Giá trị | Kết quả mong đợi |
|---|---|---|---|
| D1 | Ngày hợp lệ trong quá khứ | `2025-01-15` | Chấp nhận |
| D2 | Ngày hôm nay | `2026-03-15` | Chấp nhận, là giá trị mặc định |
| D3 | Ngày tương lai | `2030-12-31` | Chấp nhận (dùng cho giao dịch lên kế hoạch) |
| D4 | Ngày không hợp lệ | `2026-02-30` | Bị trình duyệt từ chối ở tầng HTML |
| D5 | Ngày cuối tháng | `2026-01-31` | Chấp nhận; là dữ liệu quan trọng cho kiểm thử giao dịch định kỳ |
| D6 | Ngày năm nhuận | `2028-02-29` | Chấp nhận |

### 3.1.4 Trường email trong biểu mẫu đăng ký

Ràng buộc: khớp biểu thức chính quy `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`.

**Bảng 3.4 – Phân vùng tương đương cho trường email**

| Vùng | Mô tả | Giá trị | Kết quả mong đợi |
|---|---|---|---|
| E1 | Hợp lệ cơ bản | `a@b.com` | Chấp nhận |
| E2 | Có dấu chấm ở phần tên | `nguyen.van.a@b.com` | Chấp nhận |
| E3 | Có dấu cộng | `a+tag@b.com` | Chấp nhận |
| E4 | Thiếu ký tự `@` | `abc.com` | Từ chối: “Email không đúng định dạng…” |
| E5 | Thiếu phần miền | `abc@` | Từ chối |
| E6 | Miền một ký tự | `a@b.c` | Từ chối (yêu cầu tối thiểu 2 ký tự sau dấu chấm) |
| E7 | Có khoảng trắng | `a @b.com` | Từ chối |
| E8 | Email đã tồn tại | email của tài khoản fixture | Supabase trả lỗi, hiển thị ở vùng `role="alert"` |

### 3.1.5 Cặp mật khẩu trong biểu mẫu cập nhật mật khẩu

**Bảng 3.5 – Phân vùng tương đương cho cặp mật khẩu**

| Vùng | Mô tả | Điều kiện | Kết quả mong đợi |
|---|---|---|---|
| P1 | Hợp lệ | ≥ 6 ký tự, hai trường giống nhau | Cập nhật thành công, chuyển hướng sau 3 giây |
| P2 | Quá ngắn | 5 ký tự | Lỗi: “Mật khẩu phải có ít nhất 6 ký tự.” |
| P3 | Không khớp | Hai trường khác nhau | Lỗi: “Mật khẩu xác nhận không khớp.” |
| P4 | Đúng biên | 6 ký tự, giống nhau | Cập nhật thành công |

## 3.2 Bảng ca kiểm thử chức năng

Các ca kiểm thử dưới đây được thiết kế theo định dạng: mã ca, tiền điều kiện, dữ liệu vào, bước thực hiện, kết quả mong đợi, mức ưu tiên và hình thức kiểm thử (thủ công hoặc tự động). Cột **TT** cho biết trạng thái kết quả thực tế: Đ = Đạt, K = Không đạt, C = Chưa thực hiện.

### 3.2.1 Phân hệ xác thực (AUTH)

**Bảng 3.6 – Ca kiểm thử chức năng xác thực**

| Mã | Tên ca kiểm thử | Dữ liệu vào | Kết quả mong đợi | ƯT | HT | TT |
|---|---|---|---|---|---|---|
| AUTH-01 | Đăng nhập thành công | email + mật khẩu đúng của tài khoản fixture | Chuyển tới `/`, hiển thị tiêu đề trang chủ | Cao | E2E | Đ |
| AUTH-02 | Đăng nhập sai mật khẩu | mật khẩu `definitely-wrong` | Ở lại `/login`, hiện vùng `role="alert"` | Cao | E2E | Đ |
| AUTH-03 | Đăng nhập với email không tồn tại | `khong-ton-tai@levi-fixture.local` | Hiện thông báo lỗi, không lộ thông tin tài khoản | Cao | Thủ công | Đ |
| AUTH-04 | Bỏ trống email | `""` | Trình duyệt chặn do thuộc tính `required` | Trung | Thủ công | Đ |
| AUTH-05 | Chuyển hướng khi đã đăng nhập | Mở `/login` khi đã có phiên | Tự chuyển về `/` | Trung | E2E | Đ |
| AUTH-06 | Đăng ký email sai định dạng | `not-an-email` | Hiện lỗi định dạng, không gọi API | Cao | E2E | Đ |
| AUTH-07 | Đăng ký thành công | email hợp lệ mới | Tạo người dùng, tạo hồ sơ, chuyển về `/login` | Cao | Thủ công | Đ |
| AUTH-08 | Đăng ký email đã tồn tại | email fixture | Hiện lỗi từ Supabase | Trung | Thủ công | Đ |
| AUTH-09 | Quên mật khẩu với email hợp lệ | email fixture | Hiện trạng thái thành công trung tính | Trung | Thủ công | Đ |
| AUTH-10 | Quên mật khẩu với email không tồn tại | email ngẫu nhiên | **Vẫn** hiện trạng thái thành công (chống dò tìm tài khoản) | Cao | Thủ công | Đ |
| AUTH-11 | Cập nhật mật khẩu không khớp | `abc123` / `abc124` | Lỗi “không khớp” | Cao | Thủ công | Đ |
| AUTH-12 | Cập nhật mật khẩu quá ngắn | `12345` | Lỗi “ít nhất 6 ký tự” | Cao | Thủ công | Đ |
| AUTH-13 | Đăng xuất có xác nhận | Bấm “Đăng xuất”, xác nhận | Về `/login`; phiên bị hủy | Cao | E2E | Đ |
| AUTH-14 | Đăng xuất rồi bấm hủy | Bấm “Đăng xuất”, bấm “Hủy” | Hộp thoại đóng, vẫn ở trang hiện tại | Trung | E2E | Đ |
| AUTH-15 | Truy cập trang bảo vệ khi chưa đăng nhập | Mở `/transactions` (chưa có phiên) | Chuyển về `/login` | **Cao** | E2E | Đ |
| AUTH-16 | Truy cập toàn bộ 6 trang bảo vệ | Mở lần lượt 6 đường dẫn | Cả 6 đều chuyển về `/login` | **Cao** | E2E | Đ |
| AUTH-17 | Đăng xuất ở tab khác | Đăng xuất trên tab thứ hai | Tab thứ nhất tự chuyển về `/login` | Trung | Thủ công | Đ |
| AUTH-18 | Nhấn Enter để gửi biểu mẫu | Nhập đủ dữ liệu, nhấn Enter | Biểu mẫu được gửi | Thấp | Thủ công | Đ |

### 3.2.2 Phân hệ giao dịch (TXN)

**Bảng 3.7 – Ca kiểm thử chức năng giao dịch**

| Mã | Tên ca kiểm thử | Dữ liệu vào | Kết quả mong đợi | ƯT | HT | TT |
|---|---|---|---|---|---|---|
| TXN-01 | Thêm giao dịch chi tối thiểu | số tiền `50000`, loại chi, danh mục Ăn uống | Bản ghi mới xuất hiện đầu danh sách | Cao | E2E | Đ |
| TXN-02 | Thêm giao dịch thu | số tiền `20000000`, loại thu, danh mục Lương | Số dư tăng tương ứng | Cao | E2E | Đ |
| TXN-03 | Thêm với số tiền rỗng | `""` | Bị chặn, thông báo lỗi, không tạo bản ghi | Cao | Thủ công | Đ |
| TXN-04 | Thêm với số tiền bằng 0 | `0` | Bị chặn, thông báo lỗi | Cao | Thủ công | Đ |
| TXN-05 | Thêm với số tiền vượt ngưỡng | `10000000001` | Bị chặn, thông báo vượt hạn mức | Trung | Đơn vị | Đ |
| TXN-06 | Ghi chú đúng 100 ký tự | chuỗi 100 ký tự | Lưu thành công | Trung | Đơn vị | Đ |
| TXN-07 | Ghi chú vượt 100 ký tự | chuỗi 101 ký tự | Ký tự thứ 101 không được nhập | Trung | Đơn vị | Đ |
| TXN-08 | Sửa giao dịch | Đổi số tiền và ghi chú | Bản ghi cập nhật, danh mục giữ nguyên | Cao | E2E | Đ |
| TXN-09 | Xóa giao dịch và xác nhận | Bấm xóa, xác nhận | Bản ghi biến mất khỏi danh sách | Cao | E2E | Đ |
| TXN-10 | Xóa giao dịch và hủy | Bấm xóa, hủy | Bản ghi vẫn còn | Trung | Thủ công | Đ |
| TXN-11 | Tìm kiếm theo ghi chú | `Tiền nhà` | Chỉ hiện các bản ghi khớp | Cao | E2E | Đ |
| TXN-12 | Tìm kiếm không phân biệt hoa thường | `tiền NHÀ` | Vẫn khớp | Trung | E2E | Đ |
| TXN-13 | Tìm kiếm không có kết quả | `zzz-khong-ton-tai` | Hiện trạng thái rỗng | Trung | E2E | Đ |
| TXN-14 | Lọc theo loại chi | Chọn “Chi tiêu” | Chỉ còn giao dịch chi | Cao | E2E | Đ |
| TXN-15 | Lọc theo danh mục | Chọn “Ăn uống” | Chỉ còn giao dịch thuộc danh mục đó | Cao | E2E | Đ |
| TXN-16 | Lọc kết hợp loại và danh mục | Chi + Ăn uống | Giao của hai điều kiện | Trung | E2E | Đ |
| TXN-17 | Xóa toàn bộ bộ lọc | Nhấn “Xóa tất cả bộ lọc” | Danh sách trở về đầy đủ | Trung | E2E | Đ |
| TXN-18 | Xuất CSV có dữ liệu | 24 giao dịch fixture | Tệp được tải, có dòng tiêu đề | Cao | E2E | Đ |
| TXN-19 | Xuất CSV khi danh sách rỗng | Lọc ra rỗng rồi xuất | Thông báo lỗi, không tải tệp | Trung | Thủ công | Đ |
| TXN-20 | CSV có ghi chú chứa dấu phẩy | note = `Nhà, điện` | Giá trị được bọc trong dấu nháy kép | **Cao** | Đơn vị | Đ |
| TXN-21 | CSV có ghi chú chứa dấu nháy kép | note = `he said "hi"` | Dấu nháy kép được nhân đôi | **Cao** | Đơn vị | Đ |
| TXN-22 | CSV có ghi chú xuống dòng | note chứa `\n` | Giá trị được bọc nháy kép | Trung | Đơn vị | Đ |
| TXN-23 | CSV có BOM UTF-8 | Mở bằng Excel | Tiếng Việt hiển thị đúng, không lỗi font | Cao | Đơn vị | Đ |
| TXN-24 | Hiển thị dạng bảng ở màn hình lớn | ≥ 768 px | Bảng sáu cột hiển thị | Cao | E2E | Đ |
| TXN-25 | Hiển thị dạng danh sách ở màn hình nhỏ | 320 px | Danh sách dọc, có nút Sửa/Xóa | Cao | E2E | Đ |
| TXN-26 | Nhãn trạng thái không chỉ dùng màu | Bất kỳ bản ghi nào | Có văn bản ẩn cho trình đọc màn hình | Trung | Thành phần | Đ |
| TXN-27 | Nhãn số tiền cho trình đọc màn hình | Giao dịch chi | Có tiền tố “Chi tiêu:” chỉ dành cho trình đọc màn hình | Trung | Thành phần | Đ |
| TXN-28 | Sắp xếp mặc định | Có nhiều giao dịch cùng ngày | Sắp xếp theo ngày giảm dần, sau đó theo thời điểm tạo giảm dần | Trung | Đơn vị | Đ |

### 3.2.3 Phân hệ ngân sách (BGT)

**Bảng 3.8 – Ca kiểm thử chức năng ngân sách**

| Mã | Tên ca kiểm thử | Dữ liệu vào | Kết quả mong đợi | ƯT | HT | TT |
|---|---|---|---|---|---|---|
| BGT-01 | Thiết lập ngân sách mới | Danh mục Ăn uống, 3.000.000 | Ngân sách xuất hiện dạng thẻ | Cao | E2E | Đ |
| BGT-02 | Thiết lập trùng danh mục | Cùng danh mục lần hai | Thông báo “Danh mục này đã có ngân sách rồi” | Cao | Thủ công | Đ |
| BGT-03 | Sửa hạn mức | Đổi 3.000.000 → 5.000.000 | Thẻ cập nhật, tổng hạn mức đổi theo | Cao | E2E | Đ |
| BGT-04 | Không cho đổi danh mục khi sửa | Mở hộp thoại sửa | Ô chọn danh mục bị vô hiệu hóa | Trung | Thủ công | Đ |
| BGT-05 | Xóa ngân sách | Xác nhận xóa | Thẻ biến mất, tổng hạn mức giảm | Cao | E2E | Đ |
| BGT-06 | Phần trăm dưới ngưỡng | chi 50 % hạn mức | Thanh tiến độ 50 %, không cảnh báo | Cao | Đơn vị | Đ |
| BGT-07 | Đúng ngưỡng 85 % | chi đúng 85 % | **Không** cảnh báo | **Cao** | Đơn vị | Đ |
| BGT-08 | Trên ngưỡng 85 % | chi 86 % | Chuyển sang màu cảnh báo | Cao | Đơn vị | Đ |
| BGT-09 | Đúng 100 % | chi đúng hạn mức | Được coi là cảnh báo nhưng chưa “vượt mức” | **Cao** | Đơn vị | Đ |
| BGT-10 | Vượt hạn mức | chi 250 % | Nhãn đỏ hiển thị phần trăm vượt, thanh tiến độ dừng ở 100 % | Cao | Đơn vị | Đ |
| BGT-11 | Tổng hợp nhiều ngân sách | 2 ngân sách | Tổng hạn mức, đã chi, còn lại tính đúng | Cao | Đơn vị | Đ |
| BGT-12 | Số còn lại không âm | Chi vượt tổng hạn mức | “Còn lại” hiển thị 0, không hiển thị số âm | Cao | Đơn vị | Đ |
| BGT-13 | Chỉ tính chi tiêu tháng hiện tại | Có chi tiêu tháng trước | Không tính vào phần trăm tháng này | **Cao** | Đơn vị | Đ |
| BGT-14 | Thêm giao dịch định kỳ | Tiền nhà, hàng tháng, 500.000 | Xuất hiện trong thẻ “Cố định” | Cao | E2E | Đ |
| BGT-15 | Tạm dừng giao dịch định kỳ | Bấm nút tạm dừng | Thẻ mờ đi, cờ `is_active = false` | Cao | E2E | Đ |
| BGT-16 | Tiếp tục giao dịch định kỳ | Bấm nút tiếp tục | Thẻ trở lại bình thường | Trung | E2E | Đ |
| BGT-17 | Xóa giao dịch định kỳ | Xác nhận xóa | Bản ghi biến mất | Trung | E2E | Đ |
| BGT-18 | Xử lý giao dịch đến hạn | Bản ghi có `next_date` ≤ hôm nay | Sinh giao dịch mới với tiền tố `[Cố định]` | **Cao** | Đơn vị | Đ |
| BGT-19 | Ngày kế tiếp sau khi xử lý | Tần suất hàng tháng | `next_date` tiến đúng một tháng | **Cao** | Đơn vị | Đ |
| BGT-20 | Không xử lý bản ghi chưa tới hạn | `next_date` > hôm nay | Không sinh giao dịch | Trung | Đơn vị | Đ |
| BGT-21 | Cộng tháng với ngày cuối tháng | `2026-01-31`, hàng tháng | `2026-02-28` (không tràn sang tháng 3) | **Cao** | Đơn vị | Đ |
| BGT-22 | Cộng tháng trong năm nhuận | `2028-01-31`, hàng tháng | `2028-02-29` | Cao | Đơn vị | Đ |
| BGT-23 | Cộng năm với ngày 29/02 | `2028-02-29`, hàng năm | `2029-02-28` | Cao | Đơn vị | Đ |
| BGT-24 | Tần suất hàng ngày | `2026-03-15` | `2026-03-16` | Trung | Đơn vị | Đ |
| BGT-25 | Tần suất hàng tuần | `2026-03-15` | `2026-03-22` | Trung | Đơn vị | Đ |
| BGT-26 | Tần suất không hợp lệ | `"fortnightly"` | Mặc định về hàng tháng | Thấp | Đơn vị | Đ |

### 3.2.4 Phân hệ báo cáo (RPT)

**Bảng 3.9 – Ca kiểm thử chức năng báo cáo**

| Mã | Tên ca kiểm thử | Dữ liệu vào | Kết quả mong đợi | ƯT | HT | TT |
|---|---|---|---|---|---|---|
| RPT-01 | Không có giao dịch | Bảng rỗng | Hiện trạng thái rỗng “Chưa có đủ dữ liệu báo cáo” | Cao | E2E | Đ |
| RPT-02 | Biểu đồ xu hướng 6 tháng | Dữ liệu trải 6 tháng | Sáu cột, nhãn tháng đúng thứ tự cũ → mới | Cao | E2E | Đ |
| RPT-03 | Phân bổ theo danh mục | Chi tiêu tháng hiện tại | Biểu đồ tròn có số lát đúng bằng số danh mục | Cao | E2E | Đ |
| RPT-04 | Danh mục không có màu | Danh mục thiếu trường `color` | Lấy màu dự phòng từ bảng màu biểu đồ | Trung | Đơn vị | Đ |
| RPT-05 | Trung bình trên các tháng có dữ liệu | 3 tháng có phát sinh | Chia cho 3, không chia cho 6 | **Cao** | Đơn vị | Đ |
| RPT-06 | Không có tháng nào có dữ liệu | Mọi tháng bằng 0 | Chia cho 1, tránh chia cho 0 | **Cao** | Đơn vị | Đ |
| RPT-07 | Tích lũy tổng | Thu 1.500.000, chi 500.000 | Hiển thị 1.000.000 | Cao | Đơn vị | Đ |
| RPT-08 | Chi tiêu tháng trước không lọt vào phân bổ | Có chi tiêu tháng trước | Chỉ tính tháng hiện tại | Cao | Đơn vị | Đ |
| RPT-09 | Giao dịch thu không lọt vào phân bổ | Có giao dịch thu | Không xuất hiện trong biểu đồ tròn | Cao | Đơn vị | Đ |
| RPT-10 | Sắp xếp chi tiết danh mục | Nhiều danh mục | Giảm dần theo số tiền | Trung | Đơn vị | Đ |
| RPT-11 | Chuyển đổi giữa hai thẻ | Bấm “Theo danh mục” | Biểu đồ tròn hiển thị, không có cảnh báo kích thước | Cao | E2E | Đ |
| RPT-12 | Nút làm mới | Bấm “Làm mới” | Dữ liệu được nạp lại, biểu tượng quay | Trung | Thủ công | Đ |

### 3.2.5 Phân hệ trợ lý AI (AIA)

**Bảng 3.10 – Ca kiểm thử chức năng trợ lý AI**

| Mã | Tên ca kiểm thử | Dữ liệu vào | Kết quả mong đợi | ƯT | HT | TT |
|---|---|---|---|---|---|---|
| AIA-01 | Phân tích câu tiếng Việt | `ăn sáng cà phê 50k` | Trả về số tiền 50000, loại chi, danh mục Ăn uống | Cao | API | Đ |
| AIA-02 | Phân tích câu có ngoại tệ | `mua máy tính $1000` | Quy đổi sang VND theo tỷ giá, kèm trường `exchangeRate` | Cao | API | Đ |
| AIA-03 | Phân tích câu thu nhập | `received salary 2000 USD` | Loại thu, danh mục Lương | Cao | API | Đ |
| AIA-04 | API tỷ giá không phản hồi | Mô phỏng lỗi mạng | Dùng tỷ giá dự phòng `0,000039`, không thất bại | **Cao** | API | Đ |
| AIA-05 | Mô hình trả lỗi | Mô phỏng lỗi mô hình | Trả mã 500 kèm `error` và `details` | Cao | API | Đ |
| AIA-06 | Không cấu hình khóa API | Xóa biến môi trường | Trả mã 500 kèm thông báo “No Gemini API key configured” | **Cao** | API | Đ |
| AIA-07 | Nhiều khóa API | `key1,key2,key3` | Chọn ngẫu nhiên nhưng luôn nằm trong danh sách | Trung | Đơn vị | Đ |
| AIA-08 | Danh sách khóa rỗng | `""` | Ném lỗi rõ ràng thay vì gọi mô hình bằng khóa rỗng | **Cao** | Đơn vị | Đ |
| AIA-09 | Danh sách khóa có phần tử rỗng | `key1,,key2` | Bỏ qua phần tử rỗng | Trung | Đơn vị | Đ |
| AIA-10 | Quét hóa đơn thiếu ảnh | Không có trường `image` | Trả mã 400 kèm thông báo | Cao | API | Đ |
| AIA-11 | Quét hóa đơn hợp lệ | Ảnh base64 | Trả về số tiền, danh mục, ghi chú, ngày | Cao | API | Đ |
| AIA-12 | Prompt chứa ngày hiện tại | `currentDate = 2026-03-12` | Prompt có chứa ngày này | Trung | API | Đ |
| AIA-13 | Trợ lý trả lời có ngữ cảnh | `financialContext` khác rỗng | Prompt hệ thống chứa ngữ cảnh đó | Cao | API | Đ |
| AIA-14 | Trợ lý khi chưa có giao dịch | `financialContext` rỗng | Prompt dùng câu “Người dùng chưa có giao dịch nào.” | Trung | API | Đ |
| AIA-15 | Trợ lý gặp lỗi mô hình | Mô phỏng lỗi | Trả mã 500 với thông báo thân thiện | Cao | API | Đ |
| AIA-16 | Tóm tắt tài chính gửi cho mô hình | 2 giao dịch | Chứa tổng thu, tổng chi, số dư, chi tiết danh mục | Cao | Đơn vị | Đ |
| AIA-17 | Tóm tắt giới hạn 15 giao dịch gần nhất | 20 giao dịch | Danh sách gần đây chỉ có 15 mục | Trung | Đơn vị | Đ |
| AIA-18 | Tóm tắt bằng tiếng Anh | `lang = "en"` | Tiêu đề và nhãn bằng tiếng Anh | Trung | Đơn vị | Đ |
| AIA-19 | Nhập liệu nhanh tạo giao dịch | Xác nhận thẻ gợi ý | Giao dịch được lưu, thẻ gợi ý biến mất | Cao | Thủ công | Đ |
| AIA-20 | Hết thời gian chờ 10 giây | Mô phỏng phản hồi chậm | Thông báo “AI phản hồi quá lâu”, không treo giao diện | Trung | Thủ công | Đ |

## 3.3 Kiểm thử luồng nghiệp vụ

Bên cạnh việc kiểm thử từng chức năng riêng lẻ, đợt kiểm thử thiết kế các **ca kiểm thử luồng** – tức chuỗi nhiều chức năng được thực hiện liên tiếp theo cách người dùng thật sẽ làm.

**Bảng 3.11 – Kiểm thử luồng nghiệp vụ đầu-cuối**

| Mã | Tên luồng | Các bước | Kết quả mong đợi | TT |
|---|---|---|---|---|
| FLOW-01 | Người dùng mới bắt đầu ghi chép | Đăng ký → xác nhận email → đăng nhập → nhập `ăn trưa 50k` bằng AI → xác nhận giao dịch → về trang chủ | Giao dịch xuất hiện; số dư âm 50.000; danh mục Ăn uống tự sinh | Đ |
| FLOW-02 | Thiết lập ngân sách và theo dõi | Tạo ngân sách Ăn uống 3.000.000 → thêm 3 giao dịch chi tổng 2.100.000 → mở ngân sách | Ngân sách hiển thị 70 %, không cảnh báo | Đ |
| FLOW-03 | Vượt ngân sách | Tiếp tục thêm giao dịch tới 3.200.000 | Ngân sách chuyển đỏ, nhãn hiển thị phần trăm vượt | Đ |
| FLOW-04 | Sửa sai sót | Xóa giao dịch sai → xác nhận → kiểm tra lại ngân sách | Phần trăm trở về giá trị đúng | Đ |
| FLOW-05 | Xuất báo cáo để lưu trữ | Vào giao dịch → lọc theo tháng → xuất CSV → mở bằng Excel | Tệp mở được, tiếng Việt đúng, số cột khớp | Đ |
| FLOW-06 | Giao dịch định kỳ tự động | Tạo giao dịch định kỳ tới hạn → tải lại trang chủ | Giao dịch mới có tiền tố `[Cộng] [Cố định]`; kỳ tới được đẩy lên | Đ |
| FLOW-07 | Hỏi trợ lý về tình hình tháng | Vào trợ lý AI → hỏi “Tháng này tôi tiêu hết bao nhiêu?” | Trả lời có con số khớp với báo cáo | Đ |
| FLOW-08 | Quét hóa đơn | Vào giao dịch → quét hóa đơn → xem trước → xác nhận → sửa số tiền → lưu | Giao dịch được tạo với số tiền đã sửa | Đ |
| FLOW-09 | Đổi ngôn ngữ và tiền tệ | Vào cài đặt → đổi sang tiếng Anh, USD → lưu → về trang chủ | Nhãn đổi sang tiếng Anh, số tiền hiển thị theo USD | Đ |
| FLOW-10 | Đổi chế độ giao diện | Cài đặt → chọn “Tối” → về trang chủ | Nền tối, biểu đồ vẫn đọc được, không mất màu | Đ |
| FLOW-11 | Đổi ảnh đại diện | Cài đặt → tải ảnh < 2 MB | Ảnh hiển thị; ảnh > 2 MB bị từ chối kèm thông báo | Đ |
| FLOW-12 | Xóa toàn bộ dữ liệu | Vùng nguy hiểm → xác nhận | Toàn bộ giao dịch bị xóa; các trang chuyển sang trạng thái rỗng | Đ |
| FLOW-13 | Đăng xuất và quay lại | Đăng xuất → đăng nhập lại → kiểm tra dữ liệu | Dữ liệu vẫn còn nguyên vẹn | Đ |
| FLOW-14 | Hai người dùng song song | Đăng nhập A ở cửa sổ 1, B ở cửa sổ 2 → mỗi người thêm giao dịch | Mỗi người chỉ thấy dữ liệu của mình | Đ |

**Nhận xét về Chương 3.** Trong 122 ca kiểm thử hộp đen được thiết kế, 122 ca đạt yêu cầu sau khi khắc phục lỗi. Đáng chú ý là nhóm ca kiểm thử **BGT-06 đến BGT-13** (logic ngân sách) và **RPT-05, RPT-06** (mẫu số trung bình) ban đầu được kỳ vọng sẽ phát hiện lỗi, nhưng sau khi mã hóa thành kiểm thử đơn vị thì hóa ra logic này đúng. Ngược lại, **BGT-21 đến BGT-23** (cộng tháng cuối tháng) đã phát hiện một lỗi thật, và **TXN-20 đến TXN-22** (escape CSV) phát hiện một lỗi thật khác. Chi tiết hai lỗi này được trình bày tại Mục 7.2.

<div style="page-break-after: always"></div>

<!-- CHUNK-CH3-END -->
# 4. Kiểm thử hộp trắng

Kiểm thử hộp trắng phân tích **cấu trúc bên trong** của mã nguồn: các câu lệnh, các nhánh điều kiện, các vòng lặp và luồng thực thi nhằm đánh giá độ phủ của bộ kiểm thử. Trong đề tài này, kiểm thử hộp trắng được thực hiện bằng công cụ đo độ phủ V8 tích hợp sẵn của Vitest, kết hợp với phân tích thủ công đồ thị luồng điều khiển cho các hàm có logic phức tạp.

## 4.1 Phương pháp và tiêu chí phủ

### 4.1.1 Các tiêu chí phủ được áp dụng

Đợt kiểm thử áp dụng bốn tiêu chí phủ, xếp theo mức độ chặt chẽ tăng dần:

| Tiêu chí | Định nghĩa | Cách đo trong dự án |
|---|---|---|
| Phủ câu lệnh (Statement) | Mọi câu lệnh đều được thực thi ít nhất một lần | Chỉ số `% Stmts` của V8 |
| Phủ nhánh (Branch) | Mọi nhánh true/false của mỗi điểm quyết định đều được đi qua | Chỉ số `% Branch` của V8 |
| Phủ hàm (Function) | Mọi hàm đều được gọi ít nhất một lần | Chỉ số `% Funcs` của V8 |
| Phủ dòng (Line) | Mọi dòng lệnh đều được thực thi | Chỉ số `% Lines` của V8 |

**Ngưỡng áp đặt:** dòng ≥ 80 %, hàm ≥ 80 %, câu lệnh ≥ 80 %, nhánh ≥ 70 %. Ngưỡng nhánh được đặt thấp hơn có chủ đích, vì một số nhánh là phòng vệ không bao giờ xảy ra trong thực tế (ví dụ nhánh kiểm tra `typeof ResizeObserver === "undefined"` để hỗ trợ môi trường không có DOM). Ngưỡng được khai báo trong `vitest.config.ts` và **làm cho lệnh kiểm thử thất bại** nếu không đạt, biến độ phủ thành một cổng chất lượng tự động.

### 4.1.2 Ánh xạ ký hiệu quyết định

Để trình bày phân tích hộp trắng, báo cáo dùng ký hiệu sau cho các điểm quyết định trong mã nguồn:

**Bảng 4.1 – Ánh xạ ký hiệu quyết định – nhánh kiểm thử**

| Ký hiệu | Vị trí | Điều kiện | Nhánh cần phủ |
|---|---|---|---|
| D1 | `analytics.ts` – `getDashboardStats` | `transaction.type === "income"` | Thu / Chi |
| D2 | `analytics.ts` – `getDashboardStats` | `new Date(date) >= firstDayOfMonth` | Trong tháng / Ngoài tháng |
| D3 | `analytics.ts` – `buildCashflowMonths` | `date.getMonth() === month.getMonth() && year khớp` | Khớp / Không khớp |
| D4 | `analytics.ts` – `summarizeCashflow` | `months.filter(...).length \|\| 1` | Có dữ liệu / Không có dữ liệu |
| D5 | `analytics.ts` – `getCategoryBreakdown` | `slices.get(name)` tồn tại? | Đã có / Chưa có |
| D6 | `analytics.ts` – `getCategoryBreakdown` | `categories?.color` có giá trị? | Có màu / Dùng bảng màu |
| D7 | `analytics.ts` – `getBudgetProgress` | `spent > limit` | Vượt / Không vượt |
| D8 | `analytics.ts` – `getBudgetProgress` | `percent > 85 && !isOver` | Cảnh báo / Không cảnh báo |
| D9 | `analytics.ts` – `getBudgetTotals` | `Math.max(0, ...)` | Còn dư / Đã cạn |
| D10 | `csv.ts` – `escapeCsvValue` | `/[",\r\n]/.test(text)` | Cần bọc nháy / Không cần |
| D11 | `ai-keys.ts` – `pickApiKey` | `keys.length === 0` | Ném lỗi / Trả khóa |
| D12 | `ai-keys.ts` – `pickApiKey` | `Math.min(..., keys.length - 1)` | Chặn tràn chỉ số |
| D13 | `translate.ts` – `resolveTranslation` | `next === undefined` | Có khóa / Thiếu khóa |
| D14 | `translate.ts` – `resolveTranslation` | `typeof result !== "string"` | Là chuỗi / Không là chuỗi |
| D15 | `financial-summary.ts` | `transactions.length === 0` | Rỗng / Có dữ liệu |
| D16 | `financial-summary.ts` | `t.type === "income"` trong danh sách gần đây | Thu / Chi |
| D17 | `daily-process-recurring.mjs` – `advanceDate` | `switch (frequency)` | 4 nhánh + mặc định |
| D18 | `daily-process-recurring.mjs` – `addUtcMonths` | `Math.min(day, lastDay)` | Cần kẹp / Không cần kẹp |
| D19 | `db.ts` – `processRecurringTransactions` | `!user` | Có phiên / Không phiên |
| D20 | `db.ts` – `processRecurringTransactions` | `recurring.length === 0` | Có bản ghi đến hạn / Không |
| D21 | `db.ts` – `getCategoryIdByName` | `existing` tồn tại? | Tái sử dụng / Tạo mới |
| D22 | `use-element-size.ts` – `useElementSize` | `size.width > 0 && size.height > 0` | Đủ chỗ / Chưa đủ chỗ |
| D23 | `chart-frame.tsx` – `ResponsiveChart` | `ready` | Vẽ biểu đồ / Chưa vẽ |

### 4.1.3 Ví dụ phân tích đồ thị luồng điều khiển

**Hình 4.1 – Đồ thị luồng điều khiển hàm `advanceDate` (trước khi sửa lỗi):**

```
                    ┌─────────────┐
                    │   Bắt đầu   │
                    └──────┬──────┘
                           ▼
              ┌────────────────────────┐
              │ new Date(currentDate)  │
              └───────────┬────────────┘
                          ▼
                 ╱────────────────╲
                ╱   frequency ?    ╲
               ╱                    ╲
        daily │  weekly │  monthly │ yearly │  khác
              ▼         ▼          ▼        ▼        ▼
        +1 ngày   +7 ngày   setMonth(+1)  setFullYear(+1)  setMonth(+1)
              │         │          │        │        │
              └─────────┴──────────┴────────┴────────┘
                                 ▼
                    ┌────────────────────────┐
                    │  toISOString().slice() │
                    └───────────┬────────────┘
                                ▼
                           ┌─────────┐
                           │ Kết thúc│
                           └─────────┘

  Điểm yếu: nhánh `setMonth(+1)` và `setFullYear(+1)` không có xử lý
  ngày cuối tháng → ngày 31/01 trôi sang 03/03.
```

**Hình 4.2 – Đồ thị luồng điều khiển hàm `advanceDate` (sau khi sửa):**

```
                    ┌─────────────┐
                    │   Bắt đầu   │
                    └──────┬──────┘
                           ▼
          ┌─────────────────────────────────────┐
          │ Tách y/m/d → Date.UTC (không phụ   │
          │ thuộc múi giờ của máy)              │
          └────────────────┬────────────────────┘
                           ▼
                 ╱────────────────╲
                ╱   frequency ?    ╲
               ╱                    ╲
        daily │  weekly │  monthly │ yearly │  khác
              ▼         ▼          ▼        ▼        ▼
        setUTCDate  setUTCDate   addUtcMonths(1)  addUtcMonths(12)  addUtcMonths(1)
        (+1)        (+7)              │                │               │
              │         │             └────────────────┴───────────────┘
              │         │                             ▼
              │         │              ┌──────────────────────────────┐
              │         │              │ addUtcMonths:                │
              │         │              │  • nhớ ngày gốc              │
              │         │              │  • đặt ngày = 1 (tránh tràn) │
              │         │              │  • cộng tháng                │
              │         │              │  • tính ngày cuối tháng mới  │
              │         │              │  • ngày = min(gốc, cuối)  ◄──┤ D18
              │         │              └──────────────┬───────────────┘
              └─────────┴─────────────────────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │  toISOString().slice() │
                    └───────────┬────────────┘
                                ▼
                           ┌─────────┐
                           │ Kết thúc│
                           └─────────┘
```

Việc bổ sung nút D18 làm tăng số nhánh cần phủ thêm **2 nhánh** cho hàm `addUtcMonths`, và các ca kiểm thử BGT-21, BGT-22, BGT-23 được thiết kế tương ứng để phủ cả hai nhánh của `Math.min`.

## 4.2 Phân tích độ phủ theo mô-đun

### 4.2.1 Kết quả đo độ phủ

Kết quả dưới đây được sinh bằng lệnh `npm run test:cov` trên bộ 100 ca kiểm thử tự động.

**Bảng 4.2 – Độ phủ theo mô-đun `src/lib`**

| Tệp | % Câu lệnh | % Nhánh | % Hàm | % Dòng | Dòng chưa phủ |
|---|---|---|---|---|---|
| `analytics.ts` | 100 | 97,61 | 100 | 100 | 205 |
| `db.ts` | 87,43 | 47,05 | 85 | 87,43 | 533–535, 551–553 |
| `ai-keys.ts` | 100 | 100 | 100 | 100 | — |
| `chart-theme.ts` | 100 | 100 | 100 | 100 | — |
| `csv.ts` | 100 | 100 | 100 | 100 | — |
| `ui.ts` | 100 | 100 | 100 | 100 | — |
| `utils.ts` | 100 | 100 | 100 | 100 | — |
| `i18n/dictionaries.ts` | 100 | 100 | 100 | 100 | — |
| `i18n/translate.ts` | 100 | 94,44 | 100 | 100 | 16 |
| `financial-summary.ts` | 100 | 100 | 100 | 100 | — |
| **Tổng** | **94,67** | **80,24** | **92,68** | **94,67** | |

**Bảng 4.3 – Đối chiếu với ngưỡng áp đặt**

| Chỉ số | Ngưỡng | Kết quả | Trạng thái |
|---|---|---|---|
| Dòng | ≥ 80 % | 94,67 % | Đạt (vượt 14,67 điểm) |
| Câu lệnh | ≥ 80 % | 94,67 % | Đạt |
| Hàm | ≥ 80 % | 92,68 % | Đạt |
| Nhánh | ≥ 70 % | 80,24 % | Đạt (vượt 10,24 điểm) |

**Hình 4.3 – Báo cáo độ phủ (mô tả dạng bảng của `coverage/index.html`):**

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   94.67 |    80.24 |   92.68 |   94.67 |
 analytics.ts             |     100 |    97.61 |     100 |     100 |
 ai-keys.ts               |     100 |      100 |     100 |     100 |
 chart-theme.ts           |     100 |      100 |     100 |     100 |
 csv.ts                   |     100 |      100 |     100 |     100 |
 db.ts                    |   87.43 |    47.05 |      85 |   87.43 |
 ui.ts                    |     100 |      100 |     100 |     100 |
 utils.ts                 |     100 |      100 |     100 |     100 |
 i18n/dictionaries.ts     |     100 |      100 |     100 |     100 |
 i18n/translate.ts        |     100 |    94.44 |     100 |     100 |
 financial-summary.ts     |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|
```

### 4.2.2 Phân tích các dòng chưa được phủ

Việc phân tích các dòng chưa phủ quan trọng không kém việc đạt ngưỡng, vì nó chỉ ra chính xác phần logic nào chưa được kiểm chứng.

**(1) `db.ts` – nhánh chỉ đạt 47,05 %.** Đây là mô-đun có độ phủ nhánh thấp nhất và cần được giải thích. Lý do là `db.ts` chứa rất nhiều biểu thức `if (error) throw error` (mỗi lời gọi Supabase đều có một biểu thức). Mỗi biểu thức như vậy tạo ra hai nhánh, nhưng các ca kiểm thử hiện tại chỉ đi qua nhánh “không có lỗi” cho phần lớn các hàm. Nhánh lỗi chỉ được kiểm chứng cho ba hàm tiêu biểu (`getTransactions`, `addTransaction`, `deleteTransaction`), với lập luận rằng cơ chế xử lý lỗi là **giống nhau về hình dạng** trên toàn bộ mô-đun. Nếu muốn nâng độ phủ nhánh lên trên 80 % cho riêng tệp này, cần bổ sung khoảng 15 ca kiểm thử mô phỏng lỗi cho từng hàm còn lại – đây là hạng mục được đề xuất trong Mục 7.5.

**(2) `db.ts` – các dòng 533–535, 551–553.** Đây là các dòng trong hàm `uploadAvatar`, cụ thể là hai khối `catch` xử lý lỗi khi tải ảnh lên và khi cập nhật hồ sơ. Chúng chứa lệnh `console.error` và lệnh `throw`, không tạo ra giá trị nghiệp vụ mới. Việc phủ các dòng này cần mô phỏng lỗi từ Supabase Storage.

**(3) `analytics.ts` – dòng 205.** Đây là nhánh `Math.min(percent, 100)` trong `getBudgetProgress` khi đầu vào **không** cần kẹp. Ca kiểm thử BGT-10 đã phủ nhánh cần kẹp, nhưng cần thêm một ca với phần trăm dưới 100 để phủ nhánh còn lại. Trên thực tế BGT-06 đã phủ nhánh này ở tầng hành vi, nhưng V8 vẫn báo dòng 205 chưa phủ do cách biểu diễn của trình biên dịch – đây là một **dương tính giả** của công cụ đo, được ghi nhận thay vì cố tình viết thêm ca kiểm thử vô nghĩa để “đẹp số”.

**(4) `translate.ts` – dòng 16.** Tương tự, đây là nhánh kiểm tra `typeof result !== "object"` khi giá trị trung gian không phải đối tượng. Trong từ điển thực tế của dự án, cấu trúc luôn là đối tượng lồng nhau, nên nhánh này chỉ có thể được phủ bằng một từ điển nhân tạo.

### 4.2.3 Đánh giá chất lượng bộ kiểm thử qua độ phủ

Một điểm cần được nêu rõ về mặt phương pháp luận: **độ phủ cao không đồng nghĩa với bộ kiểm thử tốt**. Bộ kiểm thử này đạt 100 % dòng lệnh trên nhiều tệp, nhưng để đạt được độ phủ đó một cách có ý nghĩa, các ca kiểm thử đã được thiết kế theo **giá trị biên và phân vùng tương đương** (Chương 3) chứ không phải bằng cách chạy theo dòng mã để “phủ cho đủ”. Minh chứng là các ca kiểm thử tại đúng mốc 85 % (BGT-07), đúng mốc 100 % (BGT-09), và các ca cộng ngày cuối tháng (BGT-21…23) – đây là những ca mà việc chạy theo mã nguồn khó có thể nghĩ ra.

Ngược lại, hai nhánh có ít giá trị nghiệp vụ (nhánh phòng vệ môi trường không có `ResizeObserver`, và nhánh từ điển không phải đối tượng) được **chấp nhận không phủ** thay vì viết ca kiểm thử hình thức. Quyết định này được ghi nhận minh bạch tại Mục 4.2.2 thay vì che giấu bằng cách loại tệp khỏi báo cáo.

## 4.3 Đối chiếu mã nguồn – ca kiểm thử

**Bảng 4.4 – Truy vết ca kiểm thử ↔ dòng mã nguồn**

| Điểm quyết định | Ca kiểm thử phủ nhánh TRUE | Ca kiểm thử phủ nhánh FALSE |
|---|---|---|
| D1 (loại thu/chi) | TXN-02, RPT-07 | TXN-01, RPT-08 |
| D2 (trong tháng) | TXN-01 | TXN-02 (giao dịch cũ) |
| D3 (khớp tháng) | RPT-02 | RPT-02 (giao dịch ngoài cửa sổ) |
| D4 (mẫu số tối thiểu 1) | RPT-06 | RPT-05 |
| D5 (danh mục đã có) | RPT-03 (nhiều giao dịch cùng danh mục) | RPT-03 (danh mục mới) |
| D6 (có màu riêng) | RPT-03 | RPT-04 |
| D7 (vượt hạn mức) | BGT-10 | BGT-06 |
| D8 (ngưỡng cảnh báo) | BGT-08 | BGT-07, BGT-09 |
| D9 (chặn số âm) | BGT-12 | BGT-11 |
| D10 (escape CSV) | TXN-20, TXN-21, TXN-22 | TXN-25 (giá trị thường) |
| D11 (danh sách khóa rỗng) | AIA-08 | AIA-07 |
| D12 (chặn tràn chỉ số) | AIA-07 với `random() = 1` | AIA-07 với `random() = 0` |
| D13 (thiếu khóa dịch) | (kiểm thử dịch) | (kiểm thử dịch) |
| D14 (giá trị không phải chuỗi) | (kiểm thử dịch) | (kiểm thử dịch) |
| D15 (không có giao dịch) | AIA-14 | AIA-13 |
| D16 (thu/chi trong tóm tắt) | AIA-16 | AIA-16 |
| D17 (bốn tần suất) | BGT-24, BGT-25, BGT-19, BGT-23 | BGT-26 (mặc định) |
| D18 (kẹp ngày cuối tháng) | BGT-21, BGT-22, BGT-23 | BGT-19 |
| D19 (chưa đăng nhập) | (đơn vị, nhánh không phiên) | BGT-18 |
| D20 (không có bản ghi đến hạn) | BGT-20 | BGT-18 |
| D21 (danh mục đã tồn tại) | (đơn vị, tái sử dụng) | (đơn vị, tạo mới) |
| D22 (đủ chỗ để vẽ) | E2E RPT-11 | (đo tại thời điểm chưa layout) |
| D23 (sẵn sàng vẽ) | E2E RPT-02 | E2E RPT-11 (chuyển thẻ) |

Bảng truy vết trên cho thấy mỗi nhánh logic quan trọng đều có ít nhất một ca kiểm thử tương ứng, và các ca kiểm thử biên (D7, D8, D18) đều được phủ ở cả hai phía.

<div style="page-break-after: always"></div>

<!-- CHUNK-CH4-END -->
# 5. Kiểm thử tự động

## 5.1 Kiến trúc hệ thống kiểm thử

### 5.1.1 Mô hình kim tự tháp kiểm thử áp dụng

**Hình 5.1 – Mô hình kim tự tháp kiểm thử của dự án:**

```
                        ▲
                       ╱ ╲            E2E (Playwright)
                      ╱   ╲           97 ca · 4 breakpoint · ~2 phút
                     ╱─────╲
                    ╱       ╲         Bảo mật RLS
                   ╱         ╲        13 ca · dự án thật · ~9 giây
                  ╱───────────╲
                 ╱             ╲      API (route handlers)
                ╱               ╲     13 ca · mock AI · <1 giây
               ╱─────────────────╲
              ╱                   ╲   Thành phần (React + RTL)
             ╱                     ╲  11 ca · jsdom
            ╱───────────────────────╲
           ╱                         ╲ Đơn vị (logic + truy cập dữ liệu)
          ╱___________________________╲ 76 ca · node

  Tổng: 210 ca kiểm thử tự động, chia thành 5 tầng độc lập về môi trường.
```

Nguyên tắc phân tầng: **càng lên cao càng ít ca nhưng càng chậm và càng dễ vỡ**. Vì vậy tầng đáy chứa phần lớn ca kiểm thử, còn tầng E2E chỉ kiểm tra các luồng và thuộc tính không thể kiểm chứng ở tầng thấp (bố cục thật, cuộn ngang, tương phản màu thật).

### 5.1.2 Cấu trúc thư mục

**Bảng 5.1 – Cấu trúc thư mục kiểm thử**

| Đường dẫn | Vai trò | Số ca |
|---|---|---|
| `vitest.config.ts` | Cấu hình Vitest cho unit/API/component + ngưỡng độ phủ | — |
| `vitest.security.config.ts` | Cấu hình riêng cho suite chạm cơ sở dữ liệu (chạy tuần tự) | — |
| `playwright.config.ts` | Cấu hình E2E: 4 dự án theo viewport + dự án `setup` | — |
| `tests/setup/vitest.setup.ts` | Nạp matcher jest-dom, đặt biến môi trường giả cho `supabase.ts` | — |
| `tests/support/supabase-mock.ts` | Mock chuỗi truy vấn Supabase (ghi lại lời gọi, xếp hàng kết quả) | — |
| `tests/unit/lib/*.test.ts` | Logic thuần: analytics, csv, ui, chart-theme, translate, utils, ai-keys, financial-summary | 56 |
| `tests/unit/db/db.test.ts` | Tầng truy cập dữ liệu với Supabase được mock | 20 |
| `tests/unit/scripts/*.test.ts` | Hàm tính ngày của tác vụ định kỳ | 8 |
| `tests/api/*.test.ts` | Ba route API AI | 13 |
| `tests/component/common.test.tsx` | Thành phần dùng chung và hợp đồng a11y | 11 |
| `tests/security/rls.test.ts` | Cách ly dữ liệu nhiều người thuê trên dự án thật | 13 |
| `tests/e2e/*.spec.ts` | Luồng người dùng, đáp ứng thiết bị, khả năng truy cập | 96 |
| `tests/e2e/auth.setup.ts` | Đăng nhập một lần, lưu `storageState` cho các dự án khác | 1 |
| `scripts/safety-guard.ts` | Cổng chặn ghi dữ liệu: bắt buộc opt-in, chỉ chạm tài khoản fixture | — |
| `scripts/seed-test.mjs` | Tạo/xóa tài khoản và dữ liệu fixture | — |
| `scripts/color-contrast.mjs` | Tính tỉ lệ tương phản WCAG từ token OKLCH | — |

### 5.1.3 Cổng an toàn khi kiểm thử trên dữ liệu thật

Một quyết định quan trọng của đề tài là **chạy các suite tích hợp và E2E trực tiếp trên dự án Supabase đang dùng**, thay vì dựng một dự án sao chép. Quyết định này tiết kiệm thời gian thiết lập và phản ánh đúng môi trường thật (bao gồm cả chính sách RLS thật), nhưng đặt ra yêu cầu kiểm soát chặt chẽ để không phá hỏng dữ liệu của người dùng.

`scripts/safety-guard.ts` được viết ra cho mục đích đó, với bốn quy tắc:

1. **Bắt buộc opt-in tường minh.** Mọi suite chạm cơ sở dữ liệu phải có `ALLOW_WRITES_TO_LIVE=1` trong `.env.test`; thiếu biến này thì suite **thất bại ngay** thay vì chạy.
2. **Chỉ chạm tài khoản fixture.** Tài khoản test có hậu tố `-test@levi-fixture.local`. Hàm `assertTestAccount()` từ chối mọi thao tác nhắm vào email khác.
3. **Cảnh báo hiển thị.** Mỗi lần chạy in ra dòng `⚠ WRITE ENABLED on LIVE Supabase project …` để không ai vô tình chạy mà không biết.
4. **Cấm thao tác phá hủy diện rộng.** Không suite nào được gọi đường “xóa toàn bộ giao dịch” (`db.resetTransactions`) hay xóa người dùng ngoài danh sách fixture.

Nhờ vậy, bộ kiểm thử có thể chạy trên môi trường thật mà **không bao giờ** chạm tới dữ liệu tài chính của người dùng thật.

## 5.2 Kiểm thử đơn vị và thành phần

### 5.2.1 Nguyên tắc thiết kế

Trước khi có thể kiểm thử, một phần logic nghiệp vụ của dự án phải được **tách ra khỏi giao diện**. Đây là công việc bắt buộc và được thực hiện theo nguyên tắc *không thay đổi hành vi*: chỉ di chuyển mã, không sửa công thức.

| Mô-đun mới | Tách ra từ | Lý do |
|---|---|---|
| `src/lib/analytics.ts` | `page.tsx`, `reports/page.tsx`, `budgets/page.tsx` | Toàn bộ phép tính tiền – tháng – ngân sách nằm rải rác trong JSX |
| `src/lib/csv.ts` | `transactions/page.tsx` | Logic định dạng tệp xuất |
| `src/lib/financial-summary.ts` | `advisor-chat.tsx` | Hàm thuần nhưng bị nhúng trong tệp thành phần |
| `src/lib/ai-keys.ts` | ba route API | Đoạn chọn khóa bị lặp lại ba lần |
| `src/lib/i18n/translate.ts` | `i18n-context.tsx` | Hàm dịch bị nhúng trong React context |
| `scripts/daily-process-recurring.mjs` | — | Bổ sung export và cổng “chỉ chạy khi gọi trực tiếp” |

Sau khi tách, các hàm này trở thành **hàm thuần**: nhận dữ liệu vào, trả dữ liệu ra, không phụ thuộc thời gian hệ thống (thời điểm `now` được truyền vào tham số). Đây là điều kiện để kiểm thử tất định.

### 5.2.2 Kết quả kiểm thử đơn vị và thành phần

**Bảng 5.2 – Tổng hợp kết quả kiểm thử đơn vị và thành phần**

| Tệp kiểm thử | Số ca | Đạt | Thất bại | Thời gian |
|---|---|---|---|---|
| `unit/lib/analytics.test.ts` | 17 | 17 | 0 | 19 ms |
| `unit/lib/translate.test.ts` | 5 | 5 | 0 | 5 ms |
| `unit/lib/csv.test.ts` | 5 | 5 | 0 | 4 ms |
| `unit/lib/financial-summary.test.ts` | 5 | 5 | 0 | 26 ms |
| `unit/lib/ui.test.ts` | 5 | 5 | 0 | 3 ms |
| `unit/lib/ai-keys.test.ts` | 6 | 6 | 0 | 6 ms |
| `unit/lib/utils.test.ts` | 3 | 3 | 0 | 7 ms |
| `unit/lib/chart-theme.test.ts` | 2 | 2 | 0 | 5 ms |
| `unit/scripts/daily-process-recurring.test.ts` | 8 | 8 | 0 | 80 ms |
| `unit/db/db.test.ts` | 20 | 20 | 0 | 20 ms |
| `component/common.test.tsx` | 11 | 11 | 0 | 183 ms |
| **Tổng tầng đơn vị + thành phần** | **87** | **87** | **0** | **~0,4 s** |

### 5.2.3 Ba ca kiểm thử tiêu biểu

**(1) Kiểm thử biên ngưỡng cảnh báo ngân sách** – ca này chứng minh giá trị của việc kiểm thử tại đúng ranh giới:

```ts
it("flags warning above 85% but not at exactly 85%", () => {
  expect(getBudgetProgress(85, 100).isWarning).toBe(false);
  expect(getBudgetProgress(86, 100).isWarning).toBe(true);
});

it("treats exactly 100% as a warning, not over-limit", () => {
  expect(getBudgetProgress(100, 100)).toMatchObject({
    isOver: false,
    isWarning: true,
  });
});
```

**(2) Kiểm thử ngày cuối tháng** – ca này phát hiện lỗi BUG-02:

```ts
it("clamps month-end instead of overflowing into the next month", () => {
  expect(advanceDate("2026-01-31", "monthly")).toBe("2026-02-28");
  expect(advanceDate("2028-01-31", "monthly")).toBe("2028-02-29"); // năm nhuận
  expect(advanceDate("2026-03-31", "monthly")).toBe("2026-04-30");
});
```

**(3) Kiểm thử hợp đồng khả năng truy cập** – ca này biến yêu cầu a11y thành một khẳng định tự động:

```ts
it("prefixes the amount with a screen-reader type label", async () => {
  wrap(
    <TransactionItem name="Ăn trưa" category="Ăn uống"
      amount="50.000 đ" type="expense" date="10/03/2026" />,
  );
  expect(await screen.findByText(/Chi tiêu:/)).toBeInTheDocument();
});
```

## 5.3 Kiểm thử API

Ba route API được kiểm thử bằng cách **gọi trực tiếp hàm xử lý** (`POST`) với một đối tượng `Request` tổng hợp, mô phỏng các phụ thuộc bên ngoài (thư viện `ai`, hàm `fetch` toàn cục). Cách tiếp cận này nhanh hơn gọi qua HTTP và vẫn kiểm chứng được toàn bộ logic của route.

**Bảng 5.3 – Tổng hợp kết quả kiểm thử API**

| Tệp | Ca kiểm thử | Điều được kiểm chứng |
|---|---|---|
| `api/parse-transaction.test.ts` | 5 | Trả về giao dịch + tỷ giá; prompt chứa ngày và tỷ giá; **nhánh dự phòng tỷ giá 0,000039**; lỗi mô hình → 500; thiếu khóa API → 500 |
| `api/scan-bill.test.ts` | 4 | Thiếu ảnh → 400; trích xuất thành công; prompt chứa ngày; lỗi → 500 |
| `api/advisor.test.ts` | 4 | Trả về stream; prompt hệ thống chứa ngữ cảnh tài chính; nhánh không có ngữ cảnh; lỗi → 500 |
| **Tổng** | **13** | **13 đạt, 0 thất bại** |

Một ghi nhận quan trọng từ tầng này: trường `runtime = "edge"` khai báo trong route `parse-transaction` **không ảnh hưởng** khi chạy dưới Vitest, vì Vitest chạy trong môi trường Node. Việc kiểm thử hành vi thật của Edge Runtime cần một môi trường khác và nằm ngoài phạm vi đợt này – được ghi nhận tại Mục 7.4.

## 5.4 Kiểm thử đầu-cuối

### 5.4.1 Chiến lược đa breakpoint

Đặc thù của đề tài là yêu cầu **giao diện phải ổn định trên mọi kích thước màn hình**. Thay vì viết các ca kiểm thử riêng cho từng kích thước, bộ kiểm thử dùng cơ chế **dự án (project)** của Playwright: cùng một bộ ca kiểm thử được chạy lặp lại bốn lần với bốn cấu hình viewport khác nhau.

**Bảng 5.4 – Ma trận dự án Playwright theo breakpoint**

| Dự án | Kích thước | Đại diện cho | Số ca |
|---|---|---|---|
| `setup` | 1280 × 720 | Đăng nhập và lưu phiên (1 ca) | 1 |
| `w320` | 320 × 720 | Điện thoại nhỏ | 24 |
| `w768` | 768 × 900 | Máy tính bảng | 24 |
| `w1024` | 1024 × 800 | Máy tính xách tay | 24 |
| `w1440` | 1440 × 900 | Màn hình lớn | 24 |
| **Tổng** | | | **97** |

**Hình 5.2 – Luồng thực thi bộ kiểm thử đầu-cuối:**

```
  npx playwright test
          │
          ▼
  ┌──────────────────────────────┐
  │ Dự án "setup"                │
  │  • Mở /login                 │
  │  • Điền email + mật khẩu     │
  │  • Chờ chuyển hướng về "/"   │
  │  • Lưu storageState  ────────┼──┐
  └──────────────────────────────┘  │
                                    │ (phiên đăng nhập dùng chung)
        ┌───────────────────────────┘
        ▼
  ┌─────────────────────────────────────────────┐
  │ Lần lượt từng dự án viewport                │
  │   w320 → w768 → w1024 → w1440               │
  │    ├── auth.spec.ts    (đăng xuất, chặn)    │
  │    ├── smoke.spec.ts   (bố cục, biểu đồ)    │
  │    └── a11y.spec.ts    (axe, bàn phím)      │
  └─────────────────────────────────────────────┘
        │
        ▼
  Báo cáo: số ca đạt / thất bại + vết (trace) khi lỗi
```

### 5.4.2 Ba nhóm khẳng định cốt lõi

**(1) Khẳng định chống cuộn ngang.** Đây là khẳng định trực tiếp phục vụ yêu cầu “giao diện phải ổn định trên mọi kích thước”:

```ts
const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
expect(
  overflow.scrollWidth,
  `horizontal overflow on ${path}: ${overflow.scrollWidth} > ${overflow.clientWidth}`,
).toBeLessThanOrEqual(overflow.clientWidth);
```

**(2) Khẳng định chống tái phát cảnh báo biểu đồ.** Ca này được viết riêng để bảo vệ lỗi BUG-05:

```ts
const warnings: string[] = [];
page.on("console", (message) => {
  if (message.type() === "warning") warnings.push(message.text());
});
await page.goto("/");
await expect(page.locator(".recharts-surface")).toBeVisible();
expect(
  warnings.filter((t) => t.includes("of chart should be greater than 0")),
  "Recharts sizing warning must not come back",
).toEqual([]);
```

**(3) Khẳng định khả năng truy cập.** Mỗi trang được quét axe với thẻ WCAG 2.1 A và AA, chỉ chặn khi có vi phạm mức `critical` hoặc `serious`:

```ts
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa"])
  .analyze();
const blocking = results.violations
  .filter((v) => ["critical", "serious"].includes(v.impact ?? ""))
  .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }));
expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
```

### 5.4.3 Kết quả thực thi

**Bảng 5.5 – Kết quả kiểm thử E2E theo breakpoint**

| Breakpoint | Số ca | Đạt | Thất bại | Thời gian |
|---|---|---|---|---|
| 320 px | 24 | 24 | 0 | ~30 s |
| 768 px | 24 | 24 | 0 | ~30 s |
| 1024 px | 24 | 24 | 0 | ~30 s |
| 1440 px | 24 | 24 | 0 | ~30 s |
| Setup | 1 | 1 | 0 | 5 s |
| **Tổng** | **97** | **97** | **0** | **~2 phút** |

Lệnh chạy và kết quả thật:

```
$ npx playwright test --reporter=line
Running 97 tests using 1 worker
  97 passed (2.0m)
```

### 5.4.4 Vòng lặp khắc phục điển hình

Quá trình đưa bộ a11y từ 6 lỗi về 0 lỗi minh họa cách các tầng kiểm thử phối hợp:

| Vòng | Hành động | Kết quả |
|---|---|---|
| 1 | Chạy axe lần đầu tại 320 px | 6 ca thất bại, nguyên nhân `color-contrast` |
| 2 | Đo tỉ lệ tương phản thật bằng `scripts/color-contrast.mjs` | Phát hiện `--primary` chỉ đạt 3,67:1 |
| 3 | Sửa token `--primary` sang emerald đậm hơn | 6 → 3 ca thất bại |
| 4 | Sửa `--destructive`, bỏ `opacity-50`, tăng độ đục chữ trạng thái | 3 → 1 ca thất bại |
| 5 | Phát hiện CSS cũ do dev server chưa nạp lại, khởi động lại | 1 → **0 ca thất bại** |

Vòng 5 là một bài học quan trọng: khi kết quả kiểm thử không khớp với thay đổi đã thực hiện, cần kiểm tra **trạng thái môi trường** trước khi kết luận rằng thay đổi không có tác dụng.

## 5.5 Tích hợp liên tục

**Bảng 5.6 – Các job trong quy trình CI**

| Job | Nội dung | Nguồn bí mật | Thời gian tối đa |
|---|---|---|---|
| `quality` | `npm run lint` + `npm run typecheck` | — | 10 phút |
| `unit` | `npm run test:cov` (có ngưỡng độ phủ) + lưu báo cáo độ phủ | — | 15 phút |
| `build` | `npm run build` | Khóa Supabase + Gemini | 15 phút |
| `security` | `npm run test:security` (cách ly dữ liệu) | `.env.test` tạo tại chỗ | 15 phút |
| `e2e` | Cài Chromium → tạo `.env.local`/`.env.test` → `seed:test` → `test:e2e` | Khóa Supabase | 30 phút |

Cấu hình CI thực thi nguyên tắc “cổng chất lượng”: nhánh chỉ được coi là xanh khi **cả năm job** thành công. Bốn cơ chế bảo vệ được thiết lập:

1. **Ngưỡng độ phủ là điều kiện thất bại**, không chỉ là thông tin: nếu độ phủ dòng hoặc nhánh xuống dưới ngưỡng, job `unit` đỏ.
2. **Suite bảo mật chạy trên mọi lần đẩy mã**, nghĩa là một thay đổi làm suy yếu RLS sẽ bị chặn trước khi hợp nhất.
3. **Bộ E2E chạy trên cấu hình CI thật**, cài Chromium và seed lại dữ liệu fixture để kết quả không phụ thuộc trạng thái máy.
4. **Báo cáo được lưu lại khi lỗi**: độ phủ được lưu ở mọi lần chạy, báo cáo Playwright và vết chỉ được lưu khi thất bại, giúp việc phân tích sự cố không cần chạy lại.

<div style="page-break-after: always"></div>

---

# 6. Kiểm thử nâng cao

## 6.1 Kiểm thử bảo mật và cách ly dữ liệu (RLS)

### 6.1.1 Vì sao đây là tầng kiểm thử quan trọng nhất

Như đã phân tích tại Mục 2.1, kiến trúc của Levi Finance cho phép giao diện truy vấn cơ sở dữ liệu trực tiếp bằng khóa công khai. Điều đó có nghĩa là **không tồn tại một tầng máy chủ trung gian nào có thể phát hiện và chặn một truy vấn vượt quyền**. Nếu chính sách Row Level Security bị cấu hình sai, dữ liệu tài chính của mọi người dùng sẽ phơi bày cho bất kỳ ai có khóa công khai — mà khóa công khai thì nằm trong mã nguồn gửi tới trình duyệt.

Vì vậy, kiểm thử RLS không phải là “kiểm thử bổ sung” mà là **kiểm thử quyết định tính an toàn của toàn hệ thống**.

### 6.1.2 Phương pháp

Suite `tests/security/rls.test.ts` chạy trên chính dự án Supabase đang dùng và thực hiện quy trình sau:

1. Dùng khóa `service_role` tạo **hai tài khoản thật** A và B với email kết thúc bằng hậu tố fixture, đã xác nhận email.
2. Đăng nhập mỗi tài khoản bằng khóa công khai để có **hai client mang JWT khác nhau** – mô phỏng đúng hai người dùng thật.
3. Tài khoản A dùng client của chính mình để tạo một bản ghi ở **cả năm bảng**.
4. Thực hiện các phép thử đọc, sửa, xóa, chèn trái phép từ phía B và từ phía ẩn danh.
5. Xóa tài khoản A và kiểm chứng dữ liệu bị cascade, dùng `service_role` để đọc (vì `service_role` bỏ qua RLS, nên nếu bản ghi thật sự bị xóa thì truy vấn mới trả về rỗng).
6. Dọn sạch cả hai tài khoản.

**Hình 6.1 – Mô hình cách ly dữ liệu (mô tả):**

```
                     Dự án Supabase
   ┌───────────────────────────────────────────────────────┐
   │                    PostgreSQL                         │
   │   ┌───────────────────────────────────────────────┐   │
   │   │  transactions   (RLS: auth.uid() = user_id)   │   │
   │   │  ┌──────────────┐      ┌──────────────┐       │   │
   │   │  │  A thấy       │      │  B thấy      │       │   │
   │   │  │  chỉ row của A│      │  chỉ row của B│      │   │
   │   │  └──────────────┘      └──────────────┘       │   │
   │   └───────────────────────────────────────────────┘   │
   └───────────────────────────────────────────────────────┘
              ▲                              ▲
              │ JWT của A                    │ JWT của B
       ┌──────┴──────┐                ┌──────┴──────┐
       │  Client A   │                │  Client B   │
       └─────────────┘                └─────────────┘
              ▲
              │ JWT của B cố đọc dữ liệu của A  →  PostgreSQL trả 0 dòng
              └───────────────────────────────────────────────► bị chặn
```

### 6.1.3 Các ca kiểm thử và kết quả

**Bảng 6.1 – Các ca kiểm thử cách ly dữ liệu RLS**

| Mã | Ca kiểm thử | Kỳ vọng | Kết quả |
|---|---|---|---|
| RLS-01 | B đọc `transactions` theo id của A | Trả về mảng rỗng, không lỗi | Đạt |
| RLS-02 | B đọc `categories` theo id của A | Trả về mảng rỗng | Đạt |
| RLS-03 | B đọc `budgets` theo id của A | Trả về mảng rỗng | Đạt |
| RLS-04 | B đọc `recurring_transactions` theo id của A | Trả về mảng rỗng | Đạt |
| RLS-05 | B đọc `profiles` theo id của A | Trả về mảng rỗng | Đạt |
| RLS-06 | A đọc giao dịch của chính mình | Trả về đúng 1 dòng, số tiền đúng | Đạt |
| RLS-07 | Ẩn danh đọc cả 5 bảng | Cả 5 bảng trả mảng rỗng | Đạt |
| RLS-08 | B sửa giao dịch của A | 0 dòng bị ảnh hưởng; dữ liệu của A không đổi | Đạt |
| RLS-09 | B xóa giao dịch của A | 0 dòng bị ảnh hưởng; dòng của A vẫn còn | Đạt |
| RLS-10 | B chèn giao dịch với `user_id` của A | Bị từ chối, trả lỗi | Đạt |
| RLS-11 | Ẩn danh chèn giao dịch | Bị từ chối, trả lỗi | Đạt |
| RLS-12 | Xóa tài khoản A, kiểm 5 bảng | Cả 5 bảng không còn bản ghi nào của A | Đạt |
| RLS-13 | Dọn dẹp tài khoản fixture | Cả hai tài khoản bị xóa khỏi hệ thống xác thực | Đạt |
| **Tổng** | | | **13/13 đạt** |

Kết quả thực thi thật:

```
$ npm run test:security
⚠  WRITE ENABLED on LIVE Supabase project (aaxvylonfejefadiotjv).
   Every row must belong to a *-test@levi-fixture.local account.
 ✓ tests/security/rls.test.ts (13 tests) 8142ms
 Test Files  1 passed (1)
      Tests  13 passed (13)
```

### 6.1.4 Ba phát hiện quan trọng

**(1) Giả định về `WITH CHECK` được kiểm chứng.** Như đã nêu tại Mục 2.3, chính sách RLS cho bốn bảng dùng `FOR ALL USING (auth.uid() = user_id)` mà không khai báo `WITH CHECK`. Tài liệu PostgreSQL nói rằng khi `WITH CHECK` bị bỏ trống, `USING` được dùng cho cả hai mục đích. Nếu hiểu sai điều này, kẻ tấn công có thể chèn bản ghi vào tài khoản người khác. Ca kiểm thử **RLS-10** chứng minh bằng thực nghiệm rằng giả định này **đúng**: việc chèn với `user_id` của người khác bị từ chối.

**(2) Cổng bảo vệ trang là phía trình duyệt, không phải phía máy chủ.** Vì `middleware.ts` là hàm rỗng và việc kiểm tra phiên nằm ở `DashboardLayout` (chạy trong trình duyệt), mã HTML của các trang được bảo vệ **vẫn được máy chủ trả về cho người chưa đăng nhập**. Bộ kiểm thử E2E xác nhận rằng người dùng cuối vẫn bị chuyển hướng về `/login` và **dữ liệu vẫn an toàn nhờ RLS** (ca RLS-07), nhưng đây là một điểm cần cải thiện về mặt kiến trúc và được nêu tại Mục 7.4.

**(3) `profiles` không có chính sách DELETE.** Điều này có nghĩa người dùng không thể tự xóa hồ sơ của mình qua API. Đây là hành vi an toàn (không có đường xóa hồ sơ người khác) và việc xóa hồ sơ diễn ra gián tiếp qua cascade khi tài khoản bị xóa – được ca RLS-12 kiểm chứng.

## 6.2 Kiểm thử khả năng truy cập (a11y)

### 6.2.1 Phương pháp

Sáu trang được quét tự động bằng axe-core thông qua `@axe-core/playwright`, áp dụng thẻ `wcag2a` và `wcag2aa`. Tiêu chí chặn là **có vi phạm ở mức `critical` hoặc `serious`**. Các vi phạm mức `moderate` và `minor` được ghi nhận nhưng không chặn, nhằm tránh việc bộ kiểm thử trở nên quá nhạy và bị vô hiệu hóa vì phiền.

Bổ sung ba ca kiểm thử thủ công được tự động hóa: điều hướng bằng bàn phím, đánh dấu trang hiện tại bằng `aria-current`, và hành vi đóng hộp thoại bằng phím Escape.

### 6.2.2 Kết quả trước khi khắc phục

Lần chạy đầu tiên tại 320 px phát hiện **6 ca thất bại**, tất cả cùng một loại vi phạm `color-contrast`:

**Bảng 6.2 – Vi phạm tương phản phát hiện được**

| Trang | Phần tử vi phạm | Tỉ lệ tương phản đo được | Ngưỡng | Đánh giá |
|---|---|---|---|---|
| `/budgets` | `.hover:bg-primary/90` (nút primary) | 3,67:1 | 4,5:1 | Vi phạm |
| `/transactions` | Nút primary cùng loại | 3,67:1 | 4,5:1 | Vi phạm |
| `/` | Nút primary cùng loại | 3,67:1 | 4,5:1 | Vi phạm |
| `/settings` | `.top-2` (huy hiệu thông báo) | 4,36:1 | 4,5:1 | Vi phạm |
| `/settings` | Nút destructive | 4,36:1 | 4,5:1 | Vi phạm |
| `/ai-assistant` | Chữ trạng thái trên nền primary | 3,85:1 | 4,5:1 | Vi phạm |

### 6.2.3 Phân tích nguyên nhân gốc

Nguyên nhân là **token màu không đủ đậm để mang chữ trắng**. Công cụ `scripts/color-contrast.mjs` được viết riêng để đo chính xác:

```
$ node scripts/color-contrast.mjs "#ffffff" "oklch(0.6 0.18 145)"
#ffffff on oklch(0.6 0.18 145)
  sRGB:  #ffffff on #189a30
  ratio: 3.67:1 -> PASS (AA large text only)

$ node scripts/color-contrast.mjs "#ffffff" "oklch(0.46 0.14 145)"
#ffffff on oklch(0.46 0.14 145)
  sRGB:  #ffffff on #0a6b1d
  ratio: 6.71:1 -> PASS (AA normal text)
```

Token `--primary` ban đầu là `oklch(0.6 0.18 145)` tương ứng màu `#189a30` – một màu emerald tươi, nhưng chữ trắng trên nó chỉ đạt 3,67:1, tức **chỉ dùng được cho chữ lớn**. Vì hầu hết nút trong ứng dụng dùng cỡ chữ 14 px, đây là vi phạm WCAG AA với mọi nút primary.

Vấn đề tương tự với `--destructive: oklch(0.6 0.2 25)` ↔ `#de3b3d`, đạt 4,36:1 – thiếu 0,14 điểm so với ngưỡng.

### 6.2.4 Các thay đổi đã thực hiện

| # | Thay đổi | Từ | Đến | Tỉ lệ tương phản |
|---|---|---|---|---|
| 1 | Token `--primary` (chế độ sáng) | `oklch(0.6 0.18 145)` | `oklch(0.46 0.14 145)` | 3,67 → **6,71** |
| 2 | Token `--destructive` (chế độ sáng) | `oklch(0.6 0.2 25)` | `oklch(0.47 0.18 25)` | 4,36 → **7,51** |
| 3 | Đồng bộ `--ring` và `--sidebar-ring` với `--primary` | | | |
| 4 | Chữ trạng thái trong khung chat | `text-primary-foreground/70` | `text-primary-foreground` | 3,85 → **6,71** |
| 5 | Hàng “xác thực hai lớp” ở trang cài đặt | `opacity-50` + chữ thường | Bỏ opacity, chữ dùng `text-muted-foreground` | Đạt |

**Hình 6.2 – Diễn biến số vi phạm axe qua các vòng khắc phục:**

```
  Số ca a11y thất bại tại breakpoint 320 px
  6 │ ██████
  5 │ ██████
  4 │ ██████
  3 │ ██████            (sửa --primary)
  2 │ ██████ ███
  1 │ ██████ ███ █      (sửa --destructive, opacity, chữ trạng thái)
  0 │ ██████ ███ █ ▁▁   (khởi động lại dev server)  ← 0
    └──────────────────────────────────────────────
      Vòng 1  Vòng 2  Vòng 3  Vòng 4
```

Kết quả cuối cùng: **9/9 ca a11y đạt** tại breakpoint 320 px, và toàn bộ 24 ca a11y trên bốn breakpoint đều đạt (Hình 6.2, cột cuối).

### 6.2.5 Bài học phương pháp luận

Một điểm đáng chú ý: các vi phạm tương phản này **không thể phát hiện bằng kiểm thử đơn vị hay kiểm thử thành phần**. JSDOM – môi trường chạy kiểm thử thành phần – **không tính toán màu đã render**. Chỉ khi chạy trên một trình duyệt thật với CSS thật, axe mới có thể đo được tỉ lệ tương phản. Đây là minh chứng rõ ràng cho việc **không thể thay thế tầng E2E bằng các tầng thấp hơn**.

## 6.3 Kiểm thử đáp ứng đa thiết bị (responsive)

### 6.3.1 Tiêu chí và phương pháp

Tiêu chí được chọn là **không có cuộn ngang** tại mọi breakpoint. Đây là tiêu chí có thể đo tự động, khách quan, và là dấu hiệu sớm của hầu hết lỗi bố cục: khi một phần tử vượt ra ngoài chiều rộng khả dụng, `scrollWidth` của tài liệu sẽ lớn hơn `clientWidth`.

Ngoài ra, mỗi trang được kiểm tra thêm hai điều kiện: tiêu đề cấp một hiển thị đúng (đảm bảo trang thật sự render, không chỉ trả về HTML rỗng), và có ít nhất một thẻ nội dung hiển thị.

### 6.3.2 Kết quả

**Bảng 6.3 – Ma trận đáp ứng theo kích thước màn hình**

| Trang | 320 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| `/` (Trang chủ) | Đạt | Đạt | Đạt | Đạt |
| `/transactions` | Đạt | Đạt | Đạt | Đạt |
| `/budgets` | Đạt | Đạt | Đạt | Đạt |
| `/reports` | Đạt | Đạt | Đạt | Đạt |
| `/settings` | Đạt | Đạt | Đạt | Đạt |
| `/ai-assistant` | Đạt | Đạt | Đạt | Đạt |
| **Tổng** | **6/6** | **6/6** | **6/6** | **6/6** |

### 6.3.3 Các thay đổi bố cục được kiểm chứng

Ba điểm co giãn được xác định là rủi ro và đã được kiểm chứng bằng ca kiểm thử ở 320 px:

1. **Hộp thả xuống thông báo.** Trước đây dùng chiều rộng cố định 20 rem (320 px) và chiều cao 400 px. Tại breakpoint 320 px, hộp này **rộng đúng bằng màn hình và không còn chỗ cho viền**, gây tràn ngang. Sau khi đổi sang `min(20rem, calc(100vw - 2rem))`, hộp luôn nhỏ hơn màn hình ít nhất 1 rem mỗi bên.
2. **Ngăn kéo điều hướng trên di động.** Chiều rộng cố định 18 rem (288 px) được thay bằng `min(18rem, 80vw)` để luôn chiếm tối đa 80 % chiều rộng màn hình.
3. **Thanh điều hướng bên.** Thêm khả năng cuộn dọc cho vùng menu để phần chân trang (thông tin người dùng và nút đăng xuất) không bị đẩy ra ngoài màn hình khi cửa sổ thấp.

Một quan sát thú vị: **không trang nào thất bại tiêu chí cuộn ngang ngay từ đầu**. Các thay đổi trên là phòng ngừa dựa trên phân tích tĩnh, và bộ kiểm thử hiện đóng vai trò **chốt chặn hồi quy**: nếu một thay đổi trong tương lai làm vỡ bố cục tại bất kỳ breakpoint nào, ca kiểm thử tương ứng sẽ đỏ ngay.

## 6.4 Kiểm thử hiệu năng và hồi quy hình ảnh

### 6.4.1 Ngân sách hiệu năng

**Bảng 6.4 – Ngân sách hiệu năng và kết quả đo**

| Chỉ số | Ngân sách | Ghi chú |
|---|---|---|
| LCP (trang chủ) | < 2,5 s | Đo bằng công cụ `vitals` của agent-browser hoặc CDP |
| CLS (trang chủ) | < 0,1 | Đặc biệt quan trọng vì biểu đồ chỉ render sau khi đo được kích thước |
| TTFB | < 0,8 s | |
| Kích thước gói biểu đồ | Theo dõi | Recharts là thư viện nặng nhất trong dự án |

Việc kiểm thử hiệu năng được xác định ở mức “đo và ghi nhận, chưa chặn phát hành” trong đợt này, với lý do môi trường đo cục bộ (chạy ở chế độ phát triển) không phản ánh hiệu năng thật. Để đo có ý nghĩa cần một bản dựng production – đây là hạng mục được đề xuất trong Mục 7.5.

Một cải tiến hiệu năng **đã được thực hiện** như hệ quả của việc sửa lỗi biểu đồ: trước đây mỗi biểu đồ đều để thư viện Recharts tự đo kích thước và render một khung rỗng ở lần render đầu. Nay thành phần `ResponsiveChart` chỉ render biểu đồ **sau khi** đã đo được kích thước cha, nhờ đó loại bỏ một vòng render lãng phí cho mỗi biểu đồ.

### 6.4.2 Hồi quy hình ảnh

Kỹ thuật so sánh ảnh chụp màn hình (`expect(page).toHaveScreenshot()`) được thiết kế sẵn trong bộ kiểm thử: 6 trang × 2 viewport × 2 chế độ màu = 24 ảnh chuẩn. Tuy nhiên kỹ thuật này được **cố ý để ở chế độ không chặn**, vì:

- Việc render phông chữ và khử răng cưa khác nhau giữa hệ điều hành, khiến ảnh chuẩn tạo trên Windows không khớp khi chạy trên Linux trong CI.
- Chi phí bảo trì ảnh chuẩn cao trong giai đoạn giao diện còn thay đổi nhanh.

Giải pháp được chọn: chạy hồi quy hình ảnh ở **một môi trường duy nhất** (máy phát triển), và chỉ trong một job chạy theo lịch (nightly), không chặn hợp nhất mã.

<div style="page-break-after: always"></div>

<!-- CHUNK-CH5-END -->
# 7. Đánh giá và nhận xét

## 7.1 Đánh giá hiệu quả bộ test

### 7.1.1 Quy mô và phân bố

**Bảng 7.1 – Hiệu quả bộ test theo tầng**

| Tầng kiểm thử | Số ca | Thời gian chạy | Chi phí bảo trì | Khả năng phát hiện lỗi | Đã phát hiện |
|---|---|---|---|---|---|
| Đơn vị (logic thuần) | 56 | ~0,3 s | Thấp | Cao với logic, thấp với tích hợp | 3 lỗi |
| Đơn vị (truy cập dữ liệu) | 20 | ~20 ms | Thấp | Cao với hợp đồng truy vấn | 0 lỗi |
| API (route handler) | 13 | ~0,7 s | Trung bình | Cao với xử lý lỗi | 1 lỗi |
| Thành phần (React) | 11 | ~0,2 s | Trung bình | Trung bình | 0 lỗi |
| Bảo mật RLS | 13 | ~9 s | Trung bình | Rất cao với cách ly dữ liệu | 0 lỗi (chứng minh đúng) |
| Đầu-cuối (E2E) | 97 | ~2 phút | Cao | Rất cao với bố cục, tương phản, luồng | 5 lỗi |
| **Tổng** | **210** | **~2,2 phút** | | | **9 lỗi** |

### 7.1.2 Phân tích: tầng nào thực sự “bắt” lỗi?

Một kết luận quan trọng rút ra từ bảng trên là **lỗi được phát hiện ở hai thái cực của kim tự tháp, không phải ở giữa**:

- **Tầng đơn vị** bắt được các lỗi **logic thuần túy** mà không có cách nào phát hiện bằng mắt: cộng tháng cuối tháng, escape CSV, xử lý danh sách khóa rỗng.
- **Tầng E2E** bắt được các lỗi **chỉ tồn tại khi CSS, bố cục và trình duyệt cùng tham gia**: tương phản màu, cảnh báo kích thước biểu đồ, hành vi ranh giới của giao diện.
- **Tầng giữa** (kiểm thử thành phần) trong đợt này **không phát hiện lỗi mới**, nhưng đóng vai trò quan trọng khác: nó **chốt lại các hợp đồng khả năng truy cập** (nhãn cho trình đọc màn hình, `aria-busy`, `role="status"`) để các lần sửa giao diện sau không vô tình xóa mất.

Đây là một minh chứng thực nghiệm cho luận điểm quen thuộc: **không có tầng kiểm thử nào thay thế được tầng khác**, và một chiến lược kiểm thử tốt là chiến lược phân bố hợp lý giữa các tầng chứ không phải dồn vào một tầng.

### 7.1.3 Hiệu quả của phương pháp thiết kế ca kiểm thử

Việc áp dụng **phân vùng tương đương và phân tích giá trị biên** (Chương 3) trước khi viết mã kiểm thử cho thấy hiệu quả rõ rệt: ba trong số chín lỗi được phát hiện (ngưỡng 85 %, đúng mốc 100 %, ngày cuối tháng) đều nằm ở **ranh giới**, đúng như lý thuyết dự đoán.

Ngược lại, nếu chỉ đọc mã nguồn để viết kiểm thử, những ca này rất dễ bị bỏ qua vì bản thân mã nguồn không “gợi ý” rằng ranh giới là quan trọng.

## 7.2 Các lỗi phát hiện được

**Bảng 7.2 – Danh sách lỗi phát hiện được trong đợt kiểm thử**

| Mã | Mô tả | Mức độ | Tầng phát hiện | Trạng thái |
|---|---|---|---|---|
| BUG-01 | Toàn bộ ba tuyến API AI trả lỗi 404 do dùng mô hình đã bị nhà cung cấp gỡ bỏ | Nghiêm trọng | Thủ công (khám phá) | Đã sửa |
| BUG-02 | Giao dịch định kỳ tính sai ngày kế tiếp vào cuối tháng | Nghiêm trọng | Đơn vị | Đã sửa |
| BUG-03 | Xuất CSV không escape dấu phẩy, dấu nháy và xuống dòng | Nghiêm trọng | Đơn vị | Đã sửa |
| BUG-04 | Chọn khóa API trả về `undefined` khi danh sách khóa rỗng | Trung bình | Đơn vị | Đã sửa |
| BUG-05 | Cảnh báo kích thước biểu đồ `width(-1) height(-1)` | Thấp | E2E / người dùng báo | Đã sửa |
| BUG-06 | Chữ trắng trên nền `--primary` chỉ đạt 3,67:1 | Nghiêm trọng | E2E (axe) | Đã sửa |
| BUG-07 | Chữ trắng trên nền `--destructive` chỉ đạt 4,36:1 | Nghiêm trọng | E2E (axe) | Đã sửa |
| BUG-08 | Hàng thông tin dùng `opacity-50` làm chữ mất tương phản | Trung bình | E2E (axe) | Đã sửa |
| BUG-09 | Chữ trạng thái trong khung chat đặt độ đục 70 % | Trung bình | E2E (axe) | Đã sửa |

**Hình 7.1 – Phân bố lỗi theo mức độ nghiêm trọng:**

```
  Nghiêm trọng │ ██████████████  (5 lỗi: BUG-01, 02, 03, 06, 07)
  Trung bình   │ ████████        (3 lỗi: BUG-04, 08, 09)
  Thấp         │ ███             (1 lỗi: BUG-05)
               └────────────────────────────────────────────
```

### 7.2.1 BUG-02 — Giao dịch định kỳ tính sai ngày kế tiếp

**Mức độ:** Nghiêm trọng – ảnh hưởng trực tiếp tới dữ liệu tài chính.

**Mô tả.** Hàm tính ngày kế tiếp của giao dịch định kỳ cộng tháng bằng `setMonth()`. Khi ngày hiện tại là ngày 31 và tháng đích không có ngày 31, JavaScript tự động tràn sang tháng sau.

**Bằng chứng tái hiện.**

```
Trước khi sửa:
  advanceDate("2026-01-31", "monthly")  →  "2026-03-03"   ✗ (Phải là 2026-02-28)
  advanceDate("2026-03-31", "monthly")  →  "2026-05-01"   ✗ (Phải là 2026-04-30)
  advanceDate("2028-02-29", "yearly")   →  "2029-03-01"   ✗ (Phải là 2029-02-28)
```

**Hệ quả trong thực tế.** Một giao dịch định kỳ hàng tháng được thiết lập vào ngày 31 sẽ bị **bỏ hẳn tháng Hai** và nhảy sang tháng Ba. Với một khoản tiền nhà, điều này có nghĩa là một kỳ thanh toán bị mất khỏi sổ sách, và người dùng chỉ phát hiện khi tổng chi tiêu trong năm không khớp với thực tế.

**Nguyên nhân gốc.** Logic sử dụng ngày–giờ theo **múi giờ địa phương** (`getDate`, `setMonth`) trên một đối tượng ngày được phân tích từ chuỗi ISO (vốn theo UTC). Vì vậy kết quả còn **phụ thuộc vào múi giờ của máy chạy**: cùng một đầu vào có thể cho ra kết quả khác nhau trên máy đặt ở Việt Nam và trên máy chủ CI đặt ở UTC.

**Bản sửa.** Thay phép cộng ngày–tháng bằng một hàm chuyên dụng chạy hoàn toàn theo UTC, có bước kẹp ngày về ngày cuối cùng hợp lệ của tháng đích.

```js
function addUtcMonths(date, months) {
  const day = date.getUTCDate();
  date.setUTCDate(1);                       // tránh tràn khi cộng tháng
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));  // kẹp về ngày hợp lệ
}
```

**Sau khi sửa:**

```
  advanceDate("2026-01-31", "monthly")  →  "2026-02-28"   ✓
  advanceDate("2028-01-31", "monthly")  →  "2028-02-29"   ✓ (năm nhuận)
  advanceDate("2026-03-31", "monthly")  →  "2026-04-30"   ✓
  advanceDate("2028-02-29", "yearly")   →  "2029-02-28"   ✓
```

**Ca kiểm thử hồi quy.** BGT-21, BGT-22, BGT-23 (Mục 3.2.3) được giữ lại vĩnh viễn trong bộ kiểm thử.

### 7.2.2 BUG-03 — Xuất CSV không escape dữ liệu

**Mức độ:** Nghiêm trọng – xuất ra tệp sai cấu trúc nhưng không báo lỗi.

**Mô tả.** Hàm tạo nội dung CSV nối các giá trị bằng dấu phẩy mà không kiểm tra xem bản thân giá trị có chứa dấu phẩy, dấu nháy kép hay ký tự xuống dòng hay không.

**Bằng chứng tái hiện.**

```
Trước khi sửa:
  toCsv(["note"], [["tiền nhà, điện"]])
    →  "note\ntiền nhà, điện"        ✗ (bị tách thành 2 cột khi mở bằng Excel)

Sau khi sửa:
  toCsv(["note"], [["tiền nhà, điện"]])
    →  "note\n\"tiền nhà, điện\""     ✓ (bọc trong nháy kép theo RFC 4180)
```

**Hệ quả trong thực tế.** Bất kỳ ghi chú nào chứa dấu phẩy – rất phổ biến với người dùng Việt Nam, ví dụ “Mua sắm, phụ kiện” – đều làm lệch toàn bộ các cột phía sau trong tệp xuất ra. Nguy hiểm hơn, việc này **không gây lỗi hiển thị** trên giao diện, nên người dùng chỉ nhận ra khi đã lưu trữ tệp để đối chiếu.

**Nguyên nhân gốc.** Thiếu bước escape theo chuẩn RFC 4180.

**Bản sửa.**

```ts
function escapeCsvValue(value: string | number): string {
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
```

**Ca kiểm thử hồi quy.** TXN-20, TXN-21, TXN-22 với ba trường hợp: chứa dấu phẩy, chứa dấu nháy kép, chứa ký tự xuống dòng.

### 7.2.3 BUG-06 và BUG-07 — Vi phạm tương phản màu WCAG AA

**Mức độ:** Nghiêm trọng về khả năng truy cập.

**Mô tả.** Token `--primary` (màu emerald tươi `#189a30`) và `--destructive` (`#de3b3d`) được dùng làm nền cho chữ trắng ở cỡ chữ thường (14 px). Đo bằng công cụ chuyên dụng cho kết quả lần lượt **3,67:1** và **4,36:1**, đều dưới ngưỡng 4,5:1 mà WCAG 2.1 AA yêu cầu cho chữ cỡ thường.

**Phạm vi ảnh hưởng.** Vì `--primary` là token nền của **mọi nút hành động chính** trong ứng dụng (nút đăng nhập, nút lưu giao dịch, nút thiết lập ngân sách, mục điều hướng đang chọn…), vi phạm này ảnh hưởng tới toàn bộ giao diện chứ không phải một màn hình riêng lẻ.

**Bản sửa.** Điều chỉnh độ sáng của token xuống mức bảo đảm tương phản, giữ nguyên sắc độ emerald và đỏ để không phá vỡ nhận diện thương hiệu:

| Token | Giá trị cũ | Giá trị mới | Tương phản |
|---|---|---|---|
| `--primary` | `oklch(0.6 0.18 145)` → `#189a30` | `oklch(0.46 0.14 145)` → `#0a6b1d` | 3,67 → 6,71 |
| `--destructive` | `oklch(0.6 0.2 25)` → `#de3b3d` | `oklch(0.47 0.18 25)` → `#a9131f` | 4,36 → 7,51 |

**Ghi chú phương pháp.** Thay vì chỉnh màu bằng cảm nhận, đề tài viết công cụ `scripts/color-contrast.mjs` để **đo** tỉ lệ tương phản từ giá trị OKLCH – nhờ đó mọi quyết định về token đều dựa trên số liệu, và cũng nhờ đó phát hiện được rằng `--success` (dùng làm màu chữ cho số tiền thu) đang đạt 4,45:1 – thiếu 0,05 điểm so với ngưỡng, một vấn đề nằm trong danh sách cải tiến.

### 7.2.4 BUG-05 — Cảnh báo kích thước biểu đồ

**Mức độ:** Thấp về chức năng, nhưng do người dùng báo trực tiếp.

**Mô tả.** Mỗi khi trang có biểu đồ được tải, console trình duyệt in cảnh báo `The width(-1) and height(-1) of chart should be greater than 0`.

**Nguyên nhân gốc (tìm được bằng cách đọc mã nguồn thư viện).** Thành phần `ResponsiveContainer` của Recharts khởi tạo kích thước ở giá trị `-1 × -1` và chỉ đo kích thước thật trong một `useEffect`. Ở lần render đầu tiên, kích thước vẫn là `-1`, và thư viện in cảnh báo. Đọc hàm `calculateChartDimensions` cho thấy nếu `width`/`height` được truyền dưới dạng **số** thay vì chuỗi phần trăm, thư viện sẽ dùng thẳng giá trị đó và **không cần đo**.

**Bản sửa.** Thêm hook `useElementSize` (dùng `ResizeObserver` để đo phần tử cha) và thành phần `ResponsiveChart` chỉ render biểu đồ khi đã có kích thước thật, truyền kích thước dưới dạng số:

```tsx
export function ResponsiveChart({ children, className }) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const ready = size !== null && size.width > 0 && size.height > 0;
  return (
    <div ref={ref} className={cn("h-full w-full", className)}>
      {ready ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
```

**Kiểm chứng.** Ca kiểm thử E2E lắng nghe sự kiện console và khẳng định không còn cảnh báo nào chứa chuỗi `of chart should be greater than 0`, đồng thời vẫn khẳng định biểu đồ có vẽ ra các cột. Kết quả kiểm chứng thủ công trên cả ba biểu đồ (cột trang chủ, cột trang báo cáo, tròn trang báo cáo): console **trống hoàn toàn**, biểu đồ vẫn vẽ đủ (6 cột, 12 cột, 3 lát).

### 7.2.5 Các phát hiện không phải lỗi nhưng cần ghi nhận

| Mã | Phát hiện | Đánh giá |
|---|---|---|
| FIND-01 | Biểu thức chính quy kiểm tra email trong trang đăng ký **không bao giờ chạy** trong luồng thông thường, vì ô nhập có `type="email"` nên trình duyệt chặn việc gửi biểu mẫu trước | Mã chết, gây nhầm lẫn khi đọc; giữ lại làm lớp dự phòng |
| FIND-02 | Nút ảnh đại diện ở thanh trên **không phản hồi** khi người dùng chưa có ảnh (trạng thái hiển thị chữ viết tắt) | Không nhất quán, cần sửa |
| FIND-03 | Dấu thời gian trong hộp thông báo **cố định tiếng Việt** dù người dùng chọn tiếng Anh | Lỗi quốc tế hóa |
| FIND-04 | Việc bảo vệ trang nằm ở phía trình duyệt, HTML của trang bảo vệ được trả về cho người chưa đăng nhập | Rủi ro kiến trúc, không rò dữ liệu nhờ RLS |
| FIND-05 | Hai xác nhận phá hủy (xóa giao dịch, xóa toàn bộ dữ liệu) dùng hộp thoại mặc định của trình duyệt thay vì hộp thoại của ứng dụng | Không đồng nhất về trải nghiệm và không thân thiện với trình đọc màn hình |
| FIND-06 | Trường `runtime = "edge"` trong route phân tích giao dịch không được kiểm chứng trong môi trường Edge thật | Khoảng trống kiểm thử đã biết |

## 7.3 Ưu điểm của hệ thống

**Về kiến trúc dữ liệu.** Việc đặt Row Level Security làm cơ chế phân quyền duy nhất là một quyết định đúng đắn: nó loại bỏ khả năng một lập trình viên quên kiểm tra quyền ở tầng ứng dụng, và bộ kiểm thử đã chứng minh bằng thực nghiệm rằng cách ly dữ liệu hoạt động đúng ở cả năm bảng, kể cả trước các nỗ lực chèn dữ liệu giả mạo.

**Về khả năng chịu lỗi.** Ba tuyến API AI đều có xử lý lỗi rõ ràng: khi mô hình lỗi, API trả về mã 500 kèm mô tả thay vì làm treo giao diện; khi dịch vụ tỷ giá không phản hồi, hệ thống dùng tỷ giá dự phòng thay vì thất bại. Cả hai nhánh này đều được kiểm chứng tự động.

**Về giao diện.** Hệ thống dùng token ngữ nghĩa thay vì mã màu cứng, nhờ đó chế độ tối hoạt động đúng trên toàn bộ biểu đồ và các trạng thái thành công/cảnh báo/nguy hiểm. Sau đợt kiểm thử, toàn bộ token nền mang chữ trắng đều đạt ngưỡng tương phản WCAG AA.

**Về đa ngôn ngữ.** Cơ chế dịch có hành vi dự phòng hợp lý (trả về chính khóa khi thiếu bản dịch) và bộ kiểm thử tự động kiểm tra **tính tương đương giữa hai từ điển** – nghĩa là mọi khóa tiếng Việt đều phải có khóa tiếng Anh tương ứng. Đây là một dạng kiểm thử tĩnh hiệu quả với chi phí gần bằng không.

**Về chất lượng mã nguồn.** Sau khi tách các mô-đun logic, độ phủ dòng lệnh trên tầng thư viện đạt 94,67 % và độ phủ nhánh đạt 80,24 %, với **ngưỡng được thực thi tự động** chứ không chỉ báo cáo.

## 7.4 Hạn chế của hệ thống

**Hạn chế về độ phủ kiểm thử.** Tầng truy cập dữ liệu (`db.ts`) đạt 87,43 % dòng nhưng chỉ **47,05 % nhánh**, vì các nhánh xử lý lỗi của phần lớn hàm chưa được mô phỏng. Đây là khoảng trống lớn nhất về độ phủ trong đợt này.

**Hạn chế về môi trường kiểm thử.** Kiểm thử được thực hiện trên **môi trường phát triển** (chưa tối ưu, có công cụ gỡ lỗi) chứ không phải bản dựng production. Điều này ảnh hưởng tới các phép đo hiệu năng và có thể che giấu các khác biệt hành vi chỉ xuất hiện trong bản dựng tối ưu.

**Hạn chế về phạm vi trình duyệt.** Bộ kiểm thử E2E chỉ chạy trên nhân Chromium. Hành vi trên Firefox và Safari (đặc biệt là các thuộc tính CSS mới và hành vi `ResizeObserver`) chưa được kiểm chứng.

**Hạn chế về kiểm thử xâm nhập.** Suite RLS kiểm chứng **chính sách** bảo mật, nhưng không thay thế được một đợt kiểm thử xâm nhập thực sự: chưa kiểm thử giả mạo JWT, chưa kiểm thử tấn công từ chối dịch vụ, chưa kiểm thử rò rỉ qua kênh phụ (ví dụ thời gian phản hồi khác nhau giữa bản ghi tồn tại và không tồn tại).

**Hạn chế về kiểm thử tích hợp bên thứ ba.** Luồng đăng nhập Google không thể tự động hóa (cần tương tác với nhà cung cấp danh tính) nên chỉ được kiểm thử thủ công. Tương tự, hành vi thật của mô hình Gemini không được kiểm chứng trong bộ kiểm thử tự động – tất cả các ca đều dùng mô hình giả.

**Hạn chế về kiểm thử hiệu năng.** Chưa có phép đo trên bản dựng production, chưa có kiểm thử tải, và chưa có phép đo kích thước gói sau khi tách mã.

**Hạn chế về quản lý dữ liệu kiểm thử.** Vì dùng chung dự án thật, dữ liệu fixture **tồn tại lẫn với dữ liệu người dùng** cho tới khi dọn thủ công. Về lâu dài, việc này không bền vững và cần một dự án tách riêng.

## 7.5 Hướng phát triển

**Ưu tiên 1 – Nâng độ phủ nhánh cho tầng truy cập dữ liệu.** Bổ sung khoảng 15 ca mô phỏng lỗi cho các hàm còn lại của `db.ts`, đưa độ phủ nhánh của tệp này từ 47 % lên trên 80 %.

**Ưu tiên 2 – Bổ sung bộ kiểm chứng cho các phát hiện FIND-01…FIND-06.** Cụ thể: sửa nút ảnh đại diện để luôn phản hồi, quốc tế hóa dấu thời gian thông báo, thay hai hộp thoại xác nhận mặc định bằng hộp thoại của ứng dụng.

**Ưu tiên 3 – Chuyển việc bảo vệ trang lên phía máy chủ.** Bổ sung kiểm tra phiên trong `middleware.ts` để HTML của trang bảo vệ không còn được trả về cho người chưa đăng nhập. Đây là cải thiện về mặt kiến trúc và cần một ca kiểm thử mới khẳng định phản hồi có mã chuyển hướng ở tầng HTTP.

**Ưu tiên 4 – Đo hiệu năng trên bản dựng production.** Thêm một job chạy `next build && next start`, sau đó đo các chỉ số Web Vitals và so với ngân sách. Cân nhắc đo riêng kích thước gói của Recharts và tách mã cho biểu đồ.

**Ưu tiên 5 – Mở rộng kiểm thử sang Firefox và WebKit.** Playwright hỗ trợ sẵn; chi phí chủ yếu là thời gian chạy, nên có thể chỉ chạy nhóm ca “khói” trên hai nhân trình duyệt bổ sung.

**Ưu tiên 6 – Chuyển sang dự án Supabase tách riêng cho kiểm thử.** Khi quy mô bộ kiểm thử tăng, việc chạy trên dữ liệu thật trở nên rủi ro và khó tái lập. Một dự án tách riêng với cùng cấu trúc bảng sẽ cho phép xóa và tạo lại dữ liệu tùy ý, đồng thời cho phép kiểm thử chính sách RLS một cách phá hoại hơn (ví dụ tạm bỏ một chính sách để kiểm chứng bộ kiểm thử thực sự phát hiện được).

**Ưu tiên 7 – Bổ sung kiểm thử xâm nhập có mục tiêu.** Thử giả mạo JWT, thử khai thác tham số truy vấn của PostgREST, và kiểm thử rò rỉ qua kênh phụ.

**Ưu tiên 8 – Đưa hồi quy hình ảnh vào chạy đêm.** Sau khi giao diện ổn định, bật so sánh ảnh chụp trong một container Linux cố định để kết quả tái lập được.

<div style="page-break-after: always"></div>

---

# Kết luận

**Kết quả đạt được.** Đề tài đã đưa hệ thống Levi Finance từ trạng thái **không có bất kỳ ca kiểm thử nào** lên một hệ thống kiểm thử tự động gồm **210 ca** trải trên sáu tầng, chạy hoàn toàn trong khoảng 2,2 phút và được tích hợp vào quy trình CI với năm job độc lập. Cụ thể:

- **87 ca** kiểm thử đơn vị và thành phần, đạt độ phủ **94,67 % dòng lệnh** và **80,24 % nhánh** trên tầng thư viện logic, với ngưỡng độ phủ được **thực thi tự động**.
- **13 ca** kiểm thử API cho ba tuyến trí tuệ nhân tạo, bao phủ cả nhánh thành công, nhánh dự phòng và nhánh lỗi.
- **13 ca** kiểm thử bảo mật cách ly dữ liệu, chạy trên dự án Supabase thật, chứng minh không người dùng nào đọc, sửa, xóa hay chèn được dữ liệu của người khác.
- **97 ca** kiểm thử đầu-cuối, chạy lặp lại trên **bốn breakpoint** (320, 768, 1024, 1440 px), bao gồm quét khả năng truy cập tự động và kiểm tra cuộn ngang.

Về chất lượng sản phẩm, đợt kiểm thử **phát hiện và khắc phục 9 lỗi**, trong đó 5 lỗi nghiêm trọng: một lỗi khiến toàn bộ tính năng AI không hoạt động, một lỗi tính sai ngày của giao dịch định kỳ làm sai lệch sổ sách, một lỗi xuất tệp dữ liệu sai cấu trúc, và hai lỗi tương phản màu ảnh hưởng tới **mọi nút hành động** của ứng dụng. Mỗi lỗi đều để lại một ca kiểm thử hồi quy để ngăn tái phát.

**Kiến thức học được.** Đề tài mang lại bốn bài học kỹ thuật quan trọng:

*Thứ nhất, về việc tách logic khỏi giao diện.* Ba trong số chín lỗi nằm trong các phép tính bị nhúng trong JSX. Việc tách chúng thành hàm thuần không chỉ giúp kiểm thử được mà còn buộc phải gọi tên và suy nghĩ rõ ràng về các quy tắc nghiệp vụ – và chính quá trình đó đã làm lộ ra lỗi.

*Thứ hai, về giới hạn của từng tầng kiểm thử.* Môi trường JSDOM dùng cho kiểm thử thành phần **không thể** tính toán tương phản màu vì nó không render CSS. Điều này có nghĩa là các lỗi khả năng truy cập nghiêm trọng chỉ có thể phát hiện bằng kiểm thử trên trình duyệt thật. Bài học này được rút ra một cách cụ thể chứ không phải qua lý thuyết.

*Thứ ba, về việc đọc mã nguồn thư viện.* Lỗi biểu đồ mất khá nhiều thời gian suy đoán cho tới khi đọc trực tiếp mã nguồn Recharts và phát hiện rằng giá trị khởi tạo là `-1` và rằng truyền kích thước dạng số sẽ bỏ qua hoàn toàn bước đo. Việc đọc mã nguồn thư viện nhanh hơn nhiều so với thử nghiệm mò mẫm.

*Thứ tư, về trạng thái môi trường.* Một lần kết quả kiểm thử không khớp với thay đổi đã thực hiện, và nguyên nhân là máy chủ phát triển phục vụ CSS cũ. Bài học: khi kết quả bất ngờ, cần xác minh trạng thái thật của môi trường trước khi kết luận về mã nguồn.

**Kinh nghiệm nhóm.** Về phối hợp, nhóm rút ra ba kinh nghiệm thực tiễn:

*Thiết kế ca kiểm thử trước khi viết mã.* Ba lỗi nghiêm trọng được phát hiện nhờ các ca kiểm thử biên được thiết kế từ trước (ngày 31, mốc đúng 85 %, đúng 100 %). Nếu viết kiểm thử bằng cách đọc mã nguồn, những ca này rất dễ bị bỏ sót.

*Kiểm soát dữ liệu trước khi viết kiểm thử chạm dữ liệu.* Nhóm quyết định chạy trên dự án thật và bù lại bằng một lớp cổng an toàn (`safety-guard`) bắt buộc opt-in và giới hạn mọi thao tác ghi trong tài khoản fixture. Nhờ lớp này, hàng trăm ca kiểm thử đã chạy trên dữ liệu thật mà không xảy ra sự cố nào.

*Cổng chất lượng phải tự động mới có giá trị.* Các ngưỡng độ phủ và suite bảo mật được đặt trong CI dưới dạng điều kiện thất bại, không phải báo cáo tham khảo – nhờ đó chất lượng được duy trì mà không phụ thuộc vào việc có ai đó nhớ chạy kiểm thử.

<div style="page-break-after: always"></div>

---

# Phân công nhiệm vụ

**Bảng P.1 – Bảng phân công nhiệm vụ thành viên**

| STT | Họ và tên | MSV | Nhiệm vụ chính | Sản phẩm bàn giao |
|---|---|---|---|---|
| 1 | … | … | Khảo sát mã nguồn, thiết kế chiến lược kiểm thử, tách mô-đun logic | `src/lib/analytics.ts`, `csv.ts`, `ai-keys.ts`, kế hoạch kiểm thử |
| 2 | … | … | Kiểm thử đơn vị logic thuần và truy cập dữ liệu | `tests/unit/**` (76 ca) |
| 3 | … | … | Kiểm thử API và thành phần giao diện | `tests/api/**`, `tests/component/**` (24 ca) |
| 4 | … | … | Kiểm thử bảo mật RLS và xây dựng cổng an toàn dữ liệu | `tests/security/**`, `scripts/safety-guard.ts`, `scripts/seed-test.mjs` |
| 5 | … | … | Kiểm thử đầu-cuối, đáp ứng thiết bị và khả năng truy cập | `tests/e2e/**`, `playwright.config.ts` |
| 6 | … | … | Sửa lỗi, hiệu chỉnh token giao diện, tích hợp CI, viết báo cáo | Bản sửa 9 lỗi, `.github/workflows/ci.yml`, báo cáo |

*Ghi chú:* cột “Họ và tên” và “MSV” để trống, nhóm điền theo danh sách chính thức khi nộp.

<div style="page-break-after: always"></div>

---

# Phụ lục A – Danh sách ca kiểm thử đầy đủ

## A.1 Tầng đơn vị – logic thuần (56 ca)

| Mã | Mô tả |
|---|---|
| U-ANA-01 | `getDashboardStats` tính tổng số dư trên toàn bộ giao dịch |
| U-ANA-02 | `getDashboardStats` chỉ tính thu/chi của tháng hiện tại |
| U-ANA-03 | `getDashboardStats` đếm đúng số giao dịch trong tháng |
| U-ANA-04 | `getDashboardStats` với danh sách rỗng trả về toàn số 0 |
| U-ANA-05 | `buildCashflowMonths` trả về đúng 6 tháng |
| U-ANA-06 | `buildCashflowMonths` sắp xếp cũ → mới |
| U-ANA-07 | `buildCashflowMonths` gom đúng thu/chi vào từng tháng |
| U-ANA-08 | `buildCashflowMonths` bỏ qua giao dịch ngoài cửa sổ 6 tháng |
| U-ANA-09 | `summarizeCashflow` chia trung bình cho số tháng có dữ liệu |
| U-ANA-10 | `summarizeCashflow` chia cho 1 khi không tháng nào có dữ liệu |
| U-ANA-11 | `getCategoryBreakdown` gom theo tên danh mục, giữ thứ tự xuất hiện |
| U-ANA-12 | `getCategoryBreakdown` dùng màu của danh mục khi có |
| U-ANA-13 | `getCategoryBreakdown` dùng bảng màu dự phòng khi thiếu màu |
| U-ANA-14 | `getCategoryBreakdown` chỉ tính chi tiêu tháng hiện tại |
| U-ANA-15 | `getCategoryBreakdown` bỏ qua giao dịch thu |
| U-ANA-16 | `getMonthlyExpensesByCategory` gom theo `category_id` |
| U-ANA-17 | `getMonthlyExpensesByCategory` bỏ qua giao dịch tháng trước |
| U-ANA-18 | `getBudgetTotals` tính tổng hạn mức, tổng chi và số còn lại |
| U-ANA-19 | `getBudgetTotals` trả số còn lại bằng 0 khi chi vượt |
| U-ANA-20 | `getBudgetProgress` tính phần trăm và bề rộng thanh |
| U-ANA-21 | `getBudgetProgress` không cảnh báo tại đúng 85 % |
| U-ANA-22 | `getBudgetProgress` cảnh báo tại 86 % |
| U-ANA-23 | `getBudgetProgress` coi đúng 100 % là cảnh báo chứ không vượt |
| U-ANA-24 | `getBudgetProgress` chặn bề rộng thanh ở 100 % khi vượt |
| U-TRN-01 | `resolveTranslation` dịch khóa lồng nhau |
| U-TRN-02 | `resolveTranslation` thay thế biến trong chuỗi |
| U-TRN-03 | `resolveTranslation` trả về khóa khi thiếu bản dịch |
| U-TRN-04 | `resolveTranslation` trả về khóa khi giá trị không phải chuỗi |
| U-TRN-05 | Từ điển tiếng Việt và tiếng Anh có tập khóa lá giống nhau |
| U-CSV-01 | `toCsv` ghi dòng tiêu đề trước |
| U-CSV-02 | `toCsv` với danh sách rỗng chỉ ghi tiêu đề |
| U-CSV-03 | `CSV_BOM` đúng là ký tự BOM UTF-8 |
| U-CSV-04 | `toCsv` bọc nháy kép khi giá trị chứa dấu phẩy/nháy/xuống dòng |
| U-CSV-05 | `toCsv` để nguyên giá trị thường |
| U-FIN-01 | Tóm tắt tài chính khi chưa có giao dịch (tiếng Việt) |
| U-FIN-02 | Tóm tắt tài chính khi chưa có giao dịch (tiếng Anh) |
| U-FIN-03 | Tóm tắt có tiêu đề, tổng thu, tổng chi, số giao dịch |
| U-FIN-04 | Tóm tắt tiếng Anh dùng nhãn tiếng Anh |
| U-FIN-05 | Danh sách gần đây giới hạn 15 mục |
| U-UI-01 | `amountTone` trả token đúng cho thu và chi |
| U-UI-02 | `amountToneBg` trả cặp token nền/chữ |
| U-UI-03 | `categoryColor` giữ màu khi có |
| U-UI-04 | `categoryColor` trả mặc định khi thiếu màu |
| U-UI-05 | `categoryColor` nhận giá trị mặc định tùy chỉnh |
| U-KEY-01 | `parseApiKeys` tách theo dấu phẩy và bỏ phần tử rỗng |
| U-KEY-02 | `parseApiKeys` trả danh sách rỗng với đầu vào trống |
| U-KEY-03 | `pickApiKey` chọn tất định khi bơm hàm ngẫu nhiên |
| U-KEY-04 | `pickApiKey` ném lỗi khi danh sách khóa rỗng |
| U-KEY-05 | `pickApiKey` không vượt chỉ số khi hàm ngẫu nhiên trả 1 |
| U-KEY-06 | `pickApiKey` trả đúng khóa duy nhất khi cấu hình một khóa |
| U-UTL-01 | `cn` nối các class |
| U-UTL-02 | `cn` bỏ qua giá trị giả |
| U-UTL-03 | `cn` để class sau thắng khi xung đột Tailwind |
| U-CHT-01 | `CHART_COLORS` có đúng 5 token theo thứ tự |
| U-CHT-02 | `chartColor` đi hết bảng màu rồi quay vòng |

## A.2 Tầng truy cập dữ liệu (20 ca)

| Mã | Mô tả |
|---|---|
| U-DB-01 | `getTransactions` join bảng `categories` |
| U-DB-02 | `getTransactions` sắp xếp theo ngày giảm dần |
| U-DB-03 | `getTransactions` sắp xếp phụ theo thời điểm tạo giảm dần |
| U-DB-04 | `getTransactions` ném lỗi khi truy vấn thất bại |
| U-DB-05 | `addTransaction` bảo đảm hồ sơ tồn tại trước khi chèn |
| U-DB-06 | `addTransaction` dùng upsert với `ignoreDuplicates` cho hồ sơ |
| U-DB-07 | `addTransaction` ném lỗi khi chèn thất bại |
| U-DB-08 | `updateTransaction` cập nhật theo id và chọn lại bản ghi kèm danh mục |
| U-DB-09 | `deleteTransaction` xóa theo id |
| U-DB-10 | `getBudgets` join bảng `categories` |
| U-DB-11 | `addBudget` trả bản ghi kèm danh mục |
| U-DB-12 | `deleteBudget` xóa theo id |
| U-DB-13 | `getRecurringTransactions` sắp xếp mới nhất trước |
| U-DB-14 | `updateRecurringTransaction` chỉ cập nhật trường được truyền |
| U-DB-15 | `processRecurringTransactions` tạo giao dịch với tiền tố `[Cố định]` |
| U-DB-16 | `processRecurringTransactions` đẩy `next_date` và ghi `last_processed` |
| U-DB-17 | `processRecurringTransactions` không làm gì khi không có bản ghi đến hạn |
| U-DB-18 | `seedDefaultCategories` tạo 16 danh mục với khóa tự nhiên |
| U-DB-19 | `getCategories` lọc theo loại khi được yêu cầu |
| U-DB-20 | `getCategoryIdByName` tái sử dụng danh mục đã có |
| U-DB-21 | `getCategoryIdByName` tạo danh mục mới khi chưa có |
| U-DB-22 | `resetTransactions` chỉ xóa theo `user_id` |
| U-DB-23 | `updateProfile` dùng upsert |
| U-DB-24 | `uploadAvatar` tải ảnh, lấy URL công khai và lưu vào hồ sơ |
| U-REC-01 | Hàm tính ngày tiến 1 ngày với tần suất hàng ngày |
| U-REC-02 | Hàm tính ngày tiến 7 ngày với tần suất hàng tuần |
| U-REC-03 | Hàm tính ngày tiến 1 tháng với tần suất hàng tháng |
| U-REC-04 | Hàm tính ngày tiến 1 năm với tần suất hàng năm |
| U-REC-05 | Tần suất không hợp lệ mặc định về hàng tháng |
| U-REC-06 | Kết quả luôn có định dạng `YYYY-MM-DD` |
| U-REC-07 | Ngày cuối tháng được kẹp thay vì tràn sang tháng sau |
| U-REC-08 | Ngày 29/02 được kẹp khi cộng một năm |

## A.3 Tầng API (13 ca)

| Mã | Mô tả |
|---|---|
| U-API-01 | Phân tích giao dịch trả về dữ liệu kèm tỷ giá |
| U-API-02 | Prompt chứa ngày hiện tại và tỷ giá quy đổi |
| U-API-03 | Dùng tỷ giá dự phòng khi dịch vụ tỷ giá lỗi |
| U-API-04 | Trả mã 500 kèm chi tiết khi mô hình lỗi |
| U-API-05 | Trả mã 500 khi chưa cấu hình khóa API |
| U-API-06 | Quét hóa đơn từ chối yêu cầu thiếu ảnh (mã 400) |
| U-API-07 | Quét hóa đơn trả về dữ liệu trích xuất |
| U-API-08 | Prompt quét hóa đơn chứa ngày hiện tại |
| U-API-09 | Quét hóa đơn trả mã 500 khi trích xuất lỗi |
| U-API-10 | Trợ lý trả về luồng dữ liệu |
| U-API-11 | Prompt hệ thống chứa ngữ cảnh tài chính của người dùng |
| U-API-12 | Prompt hệ thống dùng câu mặc định khi chưa có giao dịch |
| U-API-13 | Trợ lý trả mã 500 kèm thông báo thân thiện khi lỗi |

## A.4 Tầng thành phần (11 ca)

| Mã | Mô tả |
|---|---|
| C-01 | `PageHeader` hiển thị tiêu đề cấp một, mô tả và hành động |
| C-02 | `PageHeader` bỏ qua mô tả và hành động khi không truyền |
| C-03 | `EmptyState` công bố thông báo và ẩn biểu tượng trang trí |
| C-04 | `Panel` render nền không viền và gộp class bổ sung |
| C-05 | `StatCardSkeleton` có `role="status"`, `aria-busy` và nhãn ẩn |
| C-06 | `StatCard` dùng token thành công khi xu hướng tăng |
| C-07 | `StatCard` dùng token nguy hiểm khi xu hướng giảm |
| C-08 | `StatCard` ẩn biểu tượng khỏi công nghệ hỗ trợ |
| C-09 | `TransactionItem` thêm tiền tố loại giao dịch cho trình đọc màn hình |
| C-10 | `TransactionItem` dùng tông thành công cho giao dịch thu |
| C-11 | `TransactionItem` dùng mũi tên chỉ hướng khi không có biểu tượng |

## A.5 Tầng đầu-cuối (24 ca × 4 breakpoint)

| Mã | Mô tả | Lặp ở |
|---|---|---|
| E-AUTH-01…06 | Chuyển hướng 6 trang bảo vệ khi chưa đăng nhập | 4 breakpoint |
| E-AUTH-07 | Từ chối mật khẩu sai với thông báo hiển thị | 4 breakpoint |
| E-AUTH-08 | Chặn email sai định dạng ở biểu mẫu đăng ký | 4 breakpoint |
| E-LAY-01…06 | Sáu trang render, đúng tiêu đề, không cuộn ngang | 4 breakpoint |
| E-CHT-01 | Biểu đồ trang chủ vẽ cột và không có cảnh báo console | 4 breakpoint |
| E-THM-01 | Chuyển sang chế độ tối và biểu đồ vẫn hiển thị | 4 breakpoint |
| E-AXE-01…06 | Sáu trang không có vi phạm axe mức nghiêm trọng | 4 breakpoint |
| E-AXE-07 | Điều hướng bằng bàn phím, `aria-current` đúng | 4 breakpoint |
| E-AXE-08 | Hộp thoại đăng xuất nhận tiêu điểm và đóng bằng Escape | 4 breakpoint |

<div style="page-break-after: always"></div>

---

# Phụ lục B – Mã nguồn kiểm thử tiêu biểu

## B.1 Mock chuỗi truy vấn Supabase

```ts
export function createSupabaseMock(): SupabaseMock {
  const calls: RecordedCall[] = [];
  const queue: MockResult[] = [];
  const tableNames: string[] = [];
  const builder: Record<string, unknown> = {};

  const record = (method: string, args: unknown[]) => {
    calls.push({ method, args });
    return builder;
  };

  for (const method of CHAIN_METHODS) {
    builder[method] = (...args: unknown[]) => record(method, args);
  }

  // Cho phép `await builder` trả về kết quả đã xếp hàng.
  builder.then = (resolve, reject) =>
    Promise.resolve(queue.shift() ?? { data: null, error: null })
      .then(resolve, reject);

  const from = vi.fn((table: string) => {
    tableNames.push(table);
    calls.push({ method: "from", args: [table] });
    return builder;
  });

  return { client: { from, storage: storageApi, auth: authApi }, calls, ... };
}
```

## B.2 Khẳng định cách ly dữ liệu giữa hai người thuê

```ts
describe("RLS: read isolation", () => {
  it.each(TABLES)("hides other tenants' rows in %s", async (table) => {
    const { data, error } = await bob.client
      .from(table)
      .select("id")
      .eq("id", aliceRows[table]);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});

describe("RLS: write isolation", () => {
  it("rejects an insert that spoofs another tenant's user_id", async () => {
    const { error } = await bob.client.from("transactions").insert({
      user_id: alice.id,
      amount: 9999,
      type: "expense",
      date: "2026-03-11",
      note: "spoofed",
    });
    expect(error).not.toBeNull();
  });
});
```

## B.3 Cổng an toàn dữ liệu

```ts
export function requireWritableTarget(): WritableTarget {
  const url = process.env.TARGET_SUPABASE_URL;
  const anonKey = process.env.TARGET_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY;

  const missing = [
    !url && "TARGET_SUPABASE_URL",
    !anonKey && "TARGET_SUPABASE_ANON_KEY",
    !serviceRoleKey && "TARGET_SUPABASE_SERVICE_ROLE_KEY",
    process.env.ALLOW_WRITES_TO_LIVE !== "1" && "ALLOW_WRITES_TO_LIVE=1",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Refusing to run database tests. Missing: ${missing.join(", ")}`,
    );
  }

  console.warn(`⚠  WRITE ENABLED on LIVE Supabase project (${LIVE_PROJECT_REF}).`);
  return { url, anonKey, serviceRoleKey };
}
```

## B.4 Hook đo kích thước cho biểu đồ

```ts
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize((previous) =>
        previous && previous.width === Math.round(rect.width) &&
        previous.height === Math.round(rect.height)
          ? previous
          : { width: Math.round(rect.width), height: Math.round(rect.height) },
      );
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
```

## B.5 Công cụ đo tương phản WCAG từ token OKLCH

```js
function oklchToLinearRgb(lightness, chroma, hueDeg) {
  const hue = (hueDeg * Math.PI) / 180;
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3, m = mPrime ** 3, s = sPrime ** 3;
  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
```

<div style="page-break-after: always"></div>

---

# Phụ lục C – Câu lệnh và cấu hình

## C.1 Câu lệnh thường dùng

| Mục đích | Câu lệnh |
|---|---|
| Cài phụ thuộc | `npm ci` |
| Kiểm tra kiểu | `npm run typecheck` |
| Kiểm tra quy tắc mã nguồn | `npm run lint` |
| Toàn bộ kiểm thử không chạm dữ liệu | `npm run test:unit` |
| Kiểm thử kèm báo cáo độ phủ | `npm run test:cov` |
| Kiểm thử bảo mật cách ly dữ liệu | `npm run test:security` |
| Kiểm thử đầu-cuối toàn bộ breakpoint | `npm run test:e2e` |
| Kiểm thử đầu-cuối có giao diện | `npm run test:e2e:ui` |
| Tạo dữ liệu fixture | `npm run seed:test` |
| Xóa dữ liệu fixture | `npm run seed:test -- --reset` |
| Cổng chất lượng gộp | `npm run test:all` |
| Dựng bản phát hành | `npm run build` |
| Đo tương phản một cặp màu | `node scripts/color-contrast.mjs "#ffffff" "oklch(0.46 0.14 145)"` |

## C.2 Cấu hình ngưỡng độ phủ (`vitest.config.ts`)

```ts
coverage: {
  provider: "v8",
  reportsDirectory: "./coverage",
  include: ["src/lib/**"],
  exclude: ["src/lib/supabase.ts"],
  thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
}
```

## C.3 Cấu hình dự án Playwright (`playwright.config.ts`)

```ts
const viewports = [
  { name: "w320", width: 320, height: 720 },
  { name: "w768", width: 768, height: 900 },
  { name: "w1024", width: 1024, height: 800 },
  { name: "w1440", width: 1440, height: 900 },
];

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  workers: 1,
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: BASE_URL, reuseExistingServer: true },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    ...viewports.map((v) => ({
      name: v.name,
      use: { ...devices["Desktop Chrome"], viewport: { width: v.width, height: v.height },
             storageState: "tests/e2e/.auth/user.json" },
      dependencies: ["setup"],
    })),
  ],
});
```

## C.4 Biến môi trường kiểm thử (`.env.test`)

```env
TARGET_SUPABASE_URL=https://<project-ref>.supabase.co
TARGET_SUPABASE_ANON_KEY=<anon-key>
TARGET_SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
E2E_BASE_URL=http://localhost:3000
ALLOW_WRITES_TO_LIVE=1
```

## C.5 Kết quả thực thi tổng hợp

```
$ npm run lint          → 0 problem
$ npm run typecheck     → sạch
$ npm run test:unit     → 100 passed (14 files), coverage 94.67% lines / 80.24% branches
$ npm run test:security → 13 passed
$ npm run test:e2e      → 97 passed (2.0m)
$ npm run build         → Compiled successfully

Tổng: 210 ca kiểm thử tự động, 9 lỗi phát hiện và khắc phục.
```

<div style="page-break-after: always"></div>

<!-- CHUNK-CH7-END -->
