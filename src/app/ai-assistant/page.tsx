"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdvisorChat } from "@/components/dashboard/advisor-chat";
import { PageHeader } from "@/components/common/page-header";
import { PageShell } from "@/components/common/page-shell";

import { useTranslation } from "@/hooks/use-translation";

export default function AIAssistantPage() {
  const { t, lang } = useTranslation();

  return (
    <DashboardLayout>
      <PageShell className="mx-auto max-w-7xl">
        <PageHeader
          title={t("common.aiAssistant")}
          description={
            lang === "vi"
              ? "Người bạn đồng hành thông minh, giúp bạn quản lý ngân sách và tối ưu hóa chi tiêu 24/7."
              : "Your smart companion, helping you manage your budget and optimize spending 24/7."
          }
        />
        <AdvisorChat />
      </PageShell>
    </DashboardLayout>
  );
}
