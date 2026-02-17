"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdvisorChat } from "@/components/dashboard/advisor-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, TrendingUp } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";

export default function AIAssistantPage() {
  const { t, lang } = useTranslation();

  const suggestionQuestions =
    lang === "vi"
      ? [
          "Làm sao để tiết kiệm tiền ăn uống?",
          "Hãy phân tích chi tiêu tuần qua của tôi.",
          "Tôi có nên mua iPhone mới lúc này không?",
          "Tạo kế hoạch trả nợ hiệu quả.",
        ]
      : [
          "How can I save money on food?",
          "Analyze my spending from last week.",
          "Should I buy a new iPhone right now?",
          "Create an effective debt repayment plan.",
        ];

  return (
    <DashboardLayout>
      <div className="grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto">
        {/* Chatbot Column */}
        <div className="lg:col-span-7">
          <AdvisorChat />
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("home.aiAssistant")}
            </h1>
            <p className="text-muted-foreground">
              {lang === "vi"
                ? "Người bạn đồng hành thông minh, giúp bạn quản lý ngân sách và tối ưu hóa chi tiêu 24/7."
                : "Your smart companion, helping you manage your budget and optimize spending 24/7."}
            </p>
          </div>

          <Card className="border-none shadow-sm bg-amber-50 dark:bg-amber-950/20">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {lang === "vi" ? "Mẹo hôm nay" : "Tip of the day"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                {lang === "vi"
                  ? "Hãy thử quy tắc 50/30/20: 50% cho nhu cầu thiết yếu, 30% cho sở thích và 20% cho tiết kiệm. Levi AI có thể giúp bạn theo dõi tỷ lệ này!"
                  : "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Levi AI can help you track this ratio!"}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <Target className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm mb-1">
                  {lang === "vi" ? "Mục tiêu tích lũy" : "Savings Goal"}
                </CardTitle>
                <div className="text-lg font-bold">
                  {lang === "vi" ? "Đạt 85%" : "Reached 85%"}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm mb-1">
                  {lang === "vi" ? "Dự báo số dư" : "Balance Forecast"}
                </CardTitle>
                <div className="text-lg font-bold">+1.2tr</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === "vi"
                  ? "Bạn có thể hỏi Levi AI:"
                  : "You can ask Levi AI:"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {suggestionQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary" />
                    {q}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
