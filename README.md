# Quản Lý Tài Chính Cá Nhân (AI Finance Manager)

Ứng dụng quản lý tài chính cá nhân thông minh, tích hợp **Levi AI** để hỗ trợ nhập liệu, phân tích và tư vấn tài chính.

## 🚀 Tính Năng Chính

### 🤖 Trợ lý AI Thông Minh (Levi)

- **Smart Input**: Nhập liệu nhanh bằng ngôn ngữ tự nhiên.
  - Ví dụ: _"Ăn sáng và cà phê 50k"_, _"Received salary 2000 USD"_.
- **Advisor Chat**: Trò chuyện với trợ lý tài chính dựa trên dữ liệu thực tế của bạn.
  - Hỏi: _"Tháng này tôi tiêu hết bao nhiêu?"_, _"Làm sao để tiết kiệm tiền?"_.
  - Nhận phân tích và lời khuyên chi tiết.

### 🌍 Đa Ngôn Ngữ (i18n)

- Hỗ trợ hoàn toàn **Tiếng Việt** và **Tiếng Anh**.
- Chuyển đổi ngôn ngữ dễ dàng trong phần Cài đặt.
- Định dạng tiền tệ và ngày tháng tự động theo vùng miền.

### 📊 Quản Lý & Báo Cáo

- **Dashboard**: Tổng quan thu chi, biểu đồ xu hướng và danh sách giao dịch gần đây.
- **Giao dịch (Transactions)**: Thêm, sửa, xóa và tìm kiếm giao dịch. Bộ lọc theo ngày tháng, danh mục.
- **Ngân sách (Budgets)**: Thiết lập ngân sách cho từng danh mục để kiểm soát chi tiêu.
- **Báo cáo (Reports)**: Biểu đồ trực quan hóa dữ liệu theo tháng và danh mục.

### 🔒 Bảo Mật & Tiện Ích

- **Xác thực**: Đăng nhập an toàn qua Supabase Auth (Email/Google).
- **Giao diện**: Thiết kế hiện đại với **Next.js**, **Tailwind CSS** và **Shadcn UI**.

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Engine**: DeepSeek (via Vercel AI SDK)
- **Charts**: Recharts
- **Date Handling**: date-fns (với locale vi/enUS)

## ⚙️ Cài Đặt & Chạy Dự Án

### 1. Clone repository

```bash
git clone https://github.com/nguyenan1601/finance-manager.git
cd finance-manager
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc dự án và thêm các thông tin sau:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEYS=your_deepseek_api_key
```

> Khóa AI lấy tại [platform.deepseek.com](https://platform.deepseek.com/). Có thể cấu hình nhiều khóa ngăn cách bằng dấu phẩy (`key1,key2,key3`) — mỗi lần gọi API hệ thống chọn ngẫu nhiên một khóa để phân tải.

### 4. Thiết lập Database (Supabase)

Dự án này yêu cầu một cấu trúc bảng cụ thể trên Supabase. Bạn có hai cách để thiết lập:

#### Cách 1: Sử dụng SQL Editor (Nhanh nhất)

1. Truy cập vào **SQL Editor** trong Supabase Dashboard.
2. Mở file `supabase/schema.sql` trong mã nguồn dự án.
3. Copy toàn bộ nội dung và dán vào SQL Editor, sau đó nhấn **Run**.

#### Cách 2: Sử dụng Supabase CLI

Nếu bạn đã cài đặt Supabase CLI, hãy chạy lệnh sau:

```bash
npx supabase db push
```

### 5. Cấu hình Xác thực (Auth)

Để tính năng đăng nhập (Email/Google) hoạt động:

1. Vào **Authentication** -> **URL Configuration**.
2. Thêm `http://localhost:3000/**` vào danh sách **Redirect URLs**.
3. Nếu dùng Google Login, hãy cấu hình Google Provider trong phần **Auth Providers** với Client ID và Secret từ Google Cloud Console.

### 6. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🔄 Dùng Nhà Cung Cấp AI Khác (tùy chọn)

Mặc định dự án dùng **DeepSeek** qua Vercel AI SDK. Có thể đổi sang nhà cung cấp khác (OpenAI, Anthropic, Google, OpenRouter, mô hình chạy local...) bằng cách thay provider trong 3 tuyến API.

### Các tệp cần sửa

| Tệp | Nội dung cần đổi |
|---|---|
| `src/app/api/ai/parse-transaction/route.ts` | `createDeepSeek(...)` → provider mới; `deepseek("deepseek-flash")` → model mới |
| `src/app/api/ai/scan-bill/route.ts` | như trên (**bắt buộc model mới phải đọc được ảnh**) |
| `src/app/api/ai/advisor/route.ts` | như trên |
| `src/lib/ai-keys.ts` | Tên biến môi trường và thông báo lỗi |
| `.env.local` | Tên biến + khóa API mới |
| `tests/api/*.test.ts`, `tests/unit/lib/ai-keys.test.ts` | Tên biến môi trường trong test |
| `.github/workflows/ci.yml` | Tên secret dùng ở job `build` và `e2e` |
| `package.json` | Gói provider mới |

### Ví dụ: đổi sang OpenAI

```bash
# Đúng dòng phiên bản của AI SDK (dự án dùng ai@6) — xem mục "3 điều kiện" bên dưới
npm install @ai-sdk/openai@ai-v6
```

```ts
import { createOpenAI } from "@ai-sdk/openai";

const provider = createOpenAI({
  apiKey: pickApiKey(process.env.OPENAI_API_KEYS),
});

// ...
model: provider("<model-id-của-bạn>"),
```

> `@ai-sdk/openai` vốn đã có sẵn trong `dependencies` của dự án. Nếu dùng nhà cung cấp tương thích OpenAI (OpenRouter, Groq, LM Studio, vLLM...), chỉ cần thêm `baseURL` vào `createOpenAI({ baseURL: "...", apiKey: ... })`.

### ⚠️ Ba điều kiện bắt buộc

1. **Chọn đúng dòng phiên bản của AI SDK.** Dự án dùng `ai@6`. Mỗi gói provider có nhiều dòng phiên bản song song; cài sai dòng sẽ lỗi type. Kiểm tra bằng `npm view <tên-gói> dist-tags` rồi chọn tag **`ai-v6`** (đừng dùng `latest` nếu nó thuộc dòng khác).
2. **Model phải hỗ trợ ảnh (vision)**, vì route `scan-bill` gửi ảnh hóa đơn dạng data URL cho model. Nếu model không đọc được ảnh thì phải hoặc giữ DeepSeek cho riêng route này, hoặc tắt tính năng quét hóa đơn — đừng để nó âm thầm hỏng.
3. **Model cần hỗ trợ JSON output** cho `generateObject`. Nếu không hỗ trợ gốc, AI SDK sẽ chuyển sang *compatibility mode* (chèn schema vào system message) — chương trình vẫn chạy nhưng schema **không được API cưỡng chế**, nên kết quả trả về cần được kiểm tra kỹ hơn.

### Kiểm tra sau khi đổi

```bash
npm run lint && npm run typecheck && npm run test:unit && npm run build
```

Sau đó chạy `npm run dev` và thử cả 3 tuyến: nhập liệu bằng câu tự nhiên, quét một ảnh hóa đơn, và chat với trợ lý — để chắc chắn JSON mode, vision và streaming đều hoạt động.

<details>
<summary><b>🤖 Prompt sẵn để giao cho AI khác thực hiện việc đổi provider</b></summary>

Chép nguyên khối dưới đây, thay phần trong dấu `<>`, rồi đưa cho AI agent đang mở repo:

```text
Bạn đang làm việc trong repo Next.js 16 (App Router) + TypeScript, dùng Vercel AI SDK v6 (gói `ai`) cho 3 tuyến API AI.

Nhiệm vụ: chuyển 3 tuyến API từ DeepSeek sang <NHÀ CUNG CẤP>, model <MODEL_ID>.

Bối cảnh code hiện tại:
- src/app/api/ai/parse-transaction/route.ts — generateObject, có `export const runtime = "edge"`.
- src/app/api/ai/scan-bill/route.ts — generateObject VÀ gửi ảnh hóa đơn (data URL base64) cho model.
- src/app/api/ai/advisor/route.ts — streamText.
- Mỗi route tạo provider bằng createDeepSeek({ apiKey: pickApiKey(process.env.DEEPSEEK_API_KEYS) }) rồi gọi deepseek("deepseek-flash").
- src/lib/ai-keys.ts chứa parseApiKeys() và pickApiKey(): đọc biến môi trường gồm nhiều khóa ngăn cách bằng dấu phẩy, chọn ngẫu nhiên 1 khóa mỗi lần gọi, và ném lỗi rõ ràng khi danh sách rỗng.
- Test hiện mock module "ai" (không mock provider): tests/api/*.test.ts đặt process.env.DEEPSEEK_API_KEYS = "key-1"; tests/api/parse-transaction.test.ts assert /No DeepSeek API key/; tests/unit/lib/ai-keys.test.ts assert /No DeepSeek API key configured/.
- .github/workflows/ci.yml dùng secrets.DEEPSEEK_API_KEYS ở job build và e2e.

Yêu cầu:
1. Cài gói provider chính thức của AI SDK cho nhà cung cấp đó, ĐÚNG dòng tương thích ai@6: chạy `npm view <tên-gói> dist-tags` và chọn tag `ai-v6`, không dùng `latest` nếu latest thuộc dòng phiên bản khác.
2. Đổi cả 3 route sang provider mới. Giữ nguyên logic nghiệp vụ, prompt hệ thống, schema zod, cách xử lý lỗi (trả 500 kèm error + details) và runtime edge.
3. Model phải hỗ trợ ảnh vì scan-bill gửi ảnh. Nếu model không hỗ trợ ảnh, dừng lại và báo cho tôi biết, đừng âm thầm làm hỏng tính năng quét hóa đơn.
4. Đổi tên biến môi trường thành <PROVIDER>_API_KEYS, giữ nguyên cơ chế nhiều khóa và thông báo lỗi rõ ràng trong src/lib/ai-keys.ts. Cập nhật .env.local, ci.yml và README cho khớp.
5. Cập nhật toàn bộ test liên quan.
6. Xác minh: npm run lint && npm run typecheck && npm run test:unit && npm run build. Sửa cho tới khi tất cả đều xanh.
7. Nếu tôi đã cấu hình khóa thật, chạy dev server và gọi thử cả 3 route để chứng minh JSON mode, vision và streaming hoạt động; báo lại kết quả thực tế kèm output, không chỉ nói "đã xong".
8. Không commit và không push trừ khi tôi yêu cầu.
```

</details>

