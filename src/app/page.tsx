"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import { SmartInput } from "@/components/dashboard/smart-input";
import { PageHeader } from "@/components/common/page-header";
import { PageShell } from "@/components/common/page-shell";
import { Panel } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { ChartSkeleton, StatCardSkeleton } from "@/components/common/skeletons";
import { db, Transaction } from "@/lib/db";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Coffee,
  Car,
  Home as HomeIcon,
  Smartphone,
  Utensils,
  LucideIcon,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
} from "recharts";
import { useTranslation } from "@/hooks/use-translation";
import { enUS, vi as viLocale } from "date-fns/locale";
import { buildCashflowMonths, getDashboardStats } from "@/lib/analytics";
import { ResponsiveChart } from "@/components/common/chart-frame";
import {
  CHART_CURSOR,
  CHART_EXPENSE,
  CHART_GRID,
  chartAxisTick,
  chartTooltipProps,
} from "@/lib/chart-theme";

// Mapping icons for different categories
const iconMap: Record<string, LucideIcon> = {
  "Ăn uống": Utensils,
  "Giải trí": Coffee,
  "Di chuyển": Car,
  "Mua sắm": ShoppingBag,
  Lương: ArrowUpRight,
  "Hàng tháng": HomeIcon,
  "Dịch vụ": Smartphone,
  Khác: Wallet,
};

export default function Home() {
  const { t, lang } = useTranslation();
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [chartData, setChartData] = useState<
    { name: string; expense: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const transactions = await db.getTransactions();
      const now = new Date();
      const currentLocale = lang === "vi" ? viLocale : enUS;

      setStats(getDashboardStats(transactions || [], now));

      setChartData(
        buildCashflowMonths(transactions || [], now, currentLocale).map(
          (month) => ({ name: month.name, expense: month.expense }),
        ),
      );

      setRecentTransactions(transactions?.slice(0, 6) || []);
    } catch (error: unknown) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const currencyFormat = lang === "vi" ? "vi-VN" : "en-US";
  const currencySymbol = lang === "vi" ? "₫" : "$";

  const hasChartData = chartData.some((m) => m.expense > 0);

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          title={t("common.dashboard")}
          description={
            lang === "vi"
              ? "Tổng quan tài chính và hoạt động gần đây của bạn."
              : "Your financial overview and recent activity."
          }
        />

        {/* AI Smart Input - Quick Access */}
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:mb-4 sm:text-sm">
            {t("home.quickAiInput")}
          </h2>
          <SmartInput onAdd={fetchDashboardData} />
        </div>

        {/* Thống kê Tổng quan */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title={t("home.totalBalance")}
                value={`${stats.totalBalance.toLocaleString(currencyFormat)} ${currencySymbol}`}
                icon={Wallet}
                variant="bright"
                description={lang === "vi" ? "tất cả tài khoản" : "all accounts"}
              />

              <StatCard
                title={t("home.monthlyIncome")}
                value={`${stats.monthlyIncome.toLocaleString(currencyFormat)} ${currencySymbol}`}
                icon={ArrowUpRight}
                description={lang === "vi" ? "Tháng hiện tại" : "Current month"}
              />

              <StatCard
                title={t("home.monthlyExpense")}
                value={`${stats.monthlyExpense.toLocaleString(currencyFormat)} ${currencySymbol}`}
                icon={ArrowDownRight}
                description={
                  lang === "vi"
                    ? `${stats.transactionCount} giao dịch`
                    : `${stats.transactionCount} transactions`
                }
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-7">
          {/* Biểu đồ xu hướng */}
          <Panel className="lg:col-span-4">
            <CardHeader className="px-4 pb-2 sm:px-6 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                {t("home.spendingTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] px-2 sm:h-[350px] sm:p-6">
              {isLoading ? (
                <ChartSkeleton className="h-full px-4" />
              ) : hasChartData ? (
                <ResponsiveChart className="h-full">
                  <ReBarChart data={chartData}>
                    <ReCartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={CHART_GRID}
                    />
                    <ReXAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={chartAxisTick}
                      dy={10}
                    />
                    <ReYAxis
                      axisLine={false}
                      tickLine={false}
                      tick={chartAxisTick}
                      tickFormatter={(value) => {
                        if (value >= 1000000)
                          return `${(value / 1000000).toFixed(0)}tr`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                        return value.toString();
                      }}
                    />
                    <ReTooltip
                      cursor={{ fill: CHART_CURSOR }}
                      {...chartTooltipProps}
                      formatter={(value: number | string | undefined) => [
                        `${Number(value || 0).toLocaleString(currencyFormat)} ${currencySymbol}`,
                      ]}
                    />
                    <ReBar
                      dataKey="expense"
                      name={lang === "vi" ? "Chi tiêu" : "Expense"}
                      fill={CHART_EXPENSE}
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                      activeBar={{ fill: CHART_EXPENSE, opacity: 0.85 }}
                    />
                  </ReBarChart>
                </ResponsiveChart>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title={
                    lang === "vi"
                      ? "Chưa có đủ dữ liệu"
                      : "Not enough data"
                  }
                  description={
                    lang === "vi"
                      ? "Thêm giao dịch chi tiêu để xem biểu đồ xu hướng."
                      : "Add expense transactions to see the trend chart."
                  }
                  className="h-full border-0 bg-transparent"
                />
              )}
            </CardContent>
          </Panel>

          {/* Giao dịch gần nhất */}
          <Panel className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between px-4 sm:px-6">
              <CardTitle className="flex items-center text-base text-primary sm:text-lg">
                <CreditCard
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
                {t("home.recentTransactions")}
              </CardTitle>
              <button
                onClick={() => (window.location.href = "/transactions")}
                className="rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t("common.viewAll")}
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-accent" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/3 animate-pulse rounded-md bg-accent" />
                          <div className="h-3 w-1/4 animate-pulse rounded-md bg-accent" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    {lang === "vi"
                      ? "Chưa có giao dịch nào."
                      : "No transactions yet."}
                  </p>
                ) : (
                  recentTransactions.map((t) => (
                    <TransactionItem
                      key={t.id}
                      name={
                        t.note ||
                        t.categories?.name ||
                        (lang === "vi" ? "Giao dịch" : "Transaction")
                      }
                      category={
                        t.categories?.name || (lang === "vi" ? "Khác" : "Other")
                      }
                      amount={`${Number(t.amount).toLocaleString(currencyFormat)} ${currencySymbol}`}
                      type={t.type}
                      date={new Date(t.date).toLocaleDateString(currencyFormat)}
                      icon={
                        (t.categories?.name && iconMap[t.categories.name]) ||
                        Wallet
                      }
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Panel>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
