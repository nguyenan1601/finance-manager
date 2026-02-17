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

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Engine**: Google Gemini (via SDK)
- **Charts**: Recharts
- **Date Handling**: date-fns (với locale vi/enUS)

## ⚙️ Cài Đặt & Chạy Dự Án

### 1. Clone repository

```bash
git clone https://github.com/your-username/finance-manager.git
cd finance-manager/finance-app
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc và thêm các thông tin sau:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.
