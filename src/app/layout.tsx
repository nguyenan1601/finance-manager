import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Levi Finance - Quản lý chi tiêu thông minh với AI",
  description:
    "Ứng dụng quản lý tài chính cá nhân tích hợp trí tuệ nhân tạo, giúp bạn tiết kiệm và quản lý dòng tiền hiệu quả.",
};

import { I18nProvider } from "@/contexts/i18n-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} font-sans antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" expand={true} richColors />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
