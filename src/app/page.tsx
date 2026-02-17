"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import { SmartInput } from "@/components/dashboard/smart-input";
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
  Loader2,
  LucideIcon,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer as ReResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";
import { useTranslation } from "@/hooks/use-translation";
import { enUS, vi as viLocale } from "date-fns/locale";

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
    financialScore: 0,
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

      // Calculate stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let totalBalance = 0;
      let monthlyIncome = 0;
      let monthlyExpense = 0;

      transactions?.forEach((t: Transaction) => {
        const amount = Number(t.amount);
        if (t.type === "income") {
          totalBalance += amount;
        } else {
          totalBalance -= amount;
        }

        const tDate = new Date(t.date);
        if (tDate >= firstDayOfMonth) {
          if (t.type === "income") {
            monthlyIncome += amount;
          } else {
            monthlyExpense += amount;
          }
        }
      });

      setStats({
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        transactionCount:
          transactions?.filter(
            (t: Transaction) => new Date(t.date) >= firstDayOfMonth,
          ).length || 0,
        financialScore: calculateFinancialScore(
          monthlyIncome,
          monthlyExpense,
          transactions?.length || 0,
        ),
      });

      // Calculate Chart Data (Spending Trend - last 6 months)
      const currentLocale = lang === "vi" ? viLocale : enUS;
      const months = Array.from({ length: 6 }, (_, i) => ({
        date: subMonths(new Date(), i),
        name: format(subMonths(new Date(), i), "MMM", {
          locale: currentLocale,
        }),
        expense: 0,
      })).reverse();

      transactions?.forEach((t: Transaction) => {
        if (t.type === "expense") {
          const tDate = new Date(t.date);
          months.forEach((m) => {
            if (
              tDate.getMonth() === m.date.getMonth() &&
              tDate.getFullYear() === m.date.getFullYear()
            ) {
              m.expense += Number(t.amount);
            }
          });
        }
      });
      setChartData(months);

      setRecentTransactions(transactions?.slice(0, 6) || []);
    } catch (error: unknown) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  const calculateFinancialScore = (
    income: number,
    expense: number,
    totalTx: number,
  ) => {
    let score = 500; // Điểm nền

    // 1. Tỷ lệ tiết kiệm (Max 300đ)
    if (income > 0) {
      const savingsRate = (income - expense) / income;
      score += Math.max(0, Math.min(savingsRate * 300, 300));
    } else if (expense > 0) {
      score -= 100; // Có chi mà không có thu
    }

    // 2. Tính kỷ luật (Max 200đ)
    // Giả sử có ít nhất 10 giao dịch/tháng là tốt
    score += Math.min(totalTx * 10, 200);

    return Math.floor(score);
  };

  const getScoreRating = (score: number) => {
    if (score >= 800) return lang === "vi" ? "Tuyệt vời" : "Excellent";
    if (score >= 650) return lang === "vi" ? "Khá tốt" : "Great";
    if (score >= 450) return lang === "vi" ? "Trung bình" : "Average";
    return lang === "vi" ? "Cần cải thiện" : "Needs Improvement";
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const currencyFormat = lang === "vi" ? "vi-VN" : "en-US";
  const currencySymbol = lang === "vi" ? "₫" : "$";

  return (
    <DashboardLayout>
      {/* AI Smart Input - Quick Access */}
      <div className="mb-10 max-w-2xl mx-auto">
        <h2 className="text-center mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {t("home.quickAiInput")}
        </h2>
        <SmartInput onAdd={fetchDashboardData} />
      </div>

      {/* Thống kê Tổng quan */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        <StatCard
          title={t("home.financialScore")}
          value={stats.financialScore.toString()}
          icon={TrendingUp}
          description={`${lang === "vi" ? "Mức" : "Level"}: ${getScoreRating(stats.financialScore)}`}
          className="bg-indigo-50/50 dark:bg-indigo-950/10"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Biểu đồ xu hướng */}
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("home.spendingTrend")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] p-6">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">
                  {lang === "vi"
                    ? "Đang quét dữ liệu chi tiêu..."
                    : "Scanning spending data..."}
                </p>
              </div>
            ) : chartData.length > 0 ? (
              <ReResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData}>
                  <ReCartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <ReXAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888888", fontSize: 12 }}
                    dy={10}
                  />
                  <ReYAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888888", fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `${(value / 1000000).toFixed(0)}tr`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      return value.toString();
                    }}
                  />
                  <ReTooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number | string | undefined) => [
                      `${Number(value || 0).toLocaleString(currencyFormat)} ${currencySymbol}`,
                    ]}
                  />
                  <ReBar
                    dataKey="expense"
                    name={lang === "vi" ? "Chi tiêu" : "Expense"}
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    activeBar={{
                      fill: "#818cf8",
                      stroke: "#6366f1",
                      strokeWidth: 1,
                    }}
                  />
                </ReBarChart>
              </ReResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-t bg-muted/10 rounded-b-xl border-dashed">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm">
                    {lang === "vi"
                      ? "Chưa có đủ dữ liệu để hiển thị biểu đồ."
                      : "Not enough data to display the chart."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Giao dịch gần nhất */}
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-primary flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              {t("home.recentTransactions")}
            </CardTitle>
            <button
              onClick={() => (window.location.href = "/transactions")}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t("common.viewAll")}
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-center py-10 text-sm text-muted-foreground">
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
