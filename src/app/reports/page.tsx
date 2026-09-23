"use client";

import { useCallback, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  PieChart as RePieChart,
  Pie as RePie,
  Cell as ReCell,
} from "recharts";
import {
  AlertCircle,
  RefreshCcw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db, Transaction } from "@/lib/db";
import { PageHeader } from "@/components/common/page-header";
import {
  buildCashflowMonths,
  getCategoryBreakdown,
  summarizeCashflow,
} from "@/lib/analytics";
import { ResponsiveChart } from "@/components/common/chart-frame";
import { PageShell } from "@/components/common/page-shell";
import { Panel } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import {
  ChartSkeleton,
  StatCardSkeleton,
} from "@/components/common/skeletons";
import {
  CHART_COLORS,
  CHART_CURSOR,
  CHART_EXPENSE,
  CHART_GRID,
  CHART_INCOME,
  chartAxisTick,
  chartTooltipProps,
} from "@/lib/chart-theme";

interface MonthlyData {
  date: Date;
  name: string;
  income: number;
  expense: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

import { useTranslation } from "@/hooks/use-translation";
import { enUS, vi } from "date-fns/locale";

export default function ReportsPage() {
  const { t, lang } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState({
    avgIncome: 0,
    avgExpense: 0,
    totalSavings: 0,
    incomeTrend: 0,
    expenseTrend: 0,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const transactions = (await db.getTransactions()) as Transaction[];
      if (!transactions || transactions.length === 0) {
        setMonthlyData([]);
        setCategoryData([]);
        setIsLoading(false);
        return;
      }

      const currentLocale = lang === "vi" ? vi : enUS;
      const now = new Date();

      const months = buildCashflowMonths(transactions, now, currentLocale);
      setMonthlyData(months);

      setCategoryData(
        getCategoryBreakdown(transactions, now, t("common.other"), CHART_COLORS),
      );

      setSummary(summarizeCashflow(months));
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lang, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currencyFormat = lang === "vi" ? "vi-VN" : "en-US";
  const currencySymbol = lang === "vi" ? "₫" : "$";

  const noData = monthlyData.length === 0;

  return (
    <DashboardLayout>
      <PageShell>
        <PageHeader
          title={t("common.reports")}
          description={
            lang === "vi"
              ? "Phân tích chi tiết dòng tiền và thói quen tiêu dùng."
              : "Detailed analysis of cash flow and spending habits."
          }
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isLoading}
                className="h-9 rounded-lg"
              >
                <RefreshCcw
                  className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
                  aria-hidden="true"
                />
                {lang === "vi" ? "Làm mới" : "Refresh"}
              </Button>
              <Badge
                variant="outline"
                className="h-9 gap-2 rounded-lg px-3 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {lang === "vi" ? "6 tháng qua" : "Last 6 months"}
              </Badge>
            </>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <Panel>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  {lang === "vi"
                    ? "So sánh Thu nhập & Chi tiêu"
                    : "Income & Expense Comparison"}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px] px-4 sm:h-[400px]">
                <ChartSkeleton className="h-full" />
              </CardContent>
            </Panel>
          </div>
        ) : noData ? (
          <EmptyState
            icon={AlertCircle}
            title={
              lang === "vi"
                ? "Chưa có đủ dữ liệu báo cáo"
                : "Not enough report data"
            }
            description={
              lang === "vi"
                ? "Hãy thêm giao dịch để Levi AI có thể phân tích báo cáo cho bạn."
                : "Add transactions so Levi AI can analyze reports for you."
            }
          />
        ) : (
          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="w-full bg-muted/50 p-1 sm:w-fit">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-lg px-4 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                {lang === "vi" ? "Tổng quan" : "Overview"}
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex-1 rounded-lg px-4 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                {lang === "vi" ? "Theo danh mục" : "By category"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                <Panel>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
                      {lang === "vi" ? "Thu nhập trung bình" : "Average Income"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold sm:text-2xl">
                      {summary.avgIncome.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lang === "vi"
                        ? "Tính trên các tháng có dữ liệu"
                        : "Based on months with data"}
                    </p>
                  </CardContent>
                </Panel>
                <Panel>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
                      {lang === "vi"
                        ? "Chi tiêu trung bình"
                        : "Average Expense"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold sm:text-2xl">
                      {summary.avgExpense.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lang === "vi"
                        ? "Tính trên các tháng có dữ liệu"
                        : "Based on months with data"}
                    </p>
                  </CardContent>
                </Panel>
                <Panel>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
                      {lang === "vi" ? "Tích lũy tổng" : "Total Savings"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold sm:text-2xl">
                      {summary.totalSavings.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lang === "vi"
                        ? "Tổng tích lũy 6 tháng qua"
                        : "Total savings in last 6 months"}
                    </p>
                  </CardContent>
                </Panel>
              </div>

              <Panel>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    {lang === "vi"
                      ? "So sánh Thu nhập & Chi tiêu"
                      : "Income & Expense Comparison"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] px-1 pt-4 sm:h-[400px] sm:px-6 sm:pt-6">
                  <ResponsiveChart className="h-full">
                    <ReBarChart data={monthlyData}>
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
                        tickFormatter={(value: number) => {
                          if (lang === "vi") {
                            if (value >= 1000000)
                              return `${(value / 1000000).toFixed(0)}tr`;
                            if (value >= 1000)
                              return `${(value / 1000).toFixed(0)}k`;
                          } else {
                            if (value >= 1000)
                              return `${(value / 1000).toFixed(0)}k`;
                          }
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
                        dataKey="income"
                        name={lang === "vi" ? "Thu nhập" : "Income"}
                        fill={CHART_INCOME}
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                      <ReBar
                        dataKey="expense"
                        name={lang === "vi" ? "Chi tiêu" : "Expense"}
                        fill={CHART_EXPENSE}
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </ReBarChart>
                  </ResponsiveChart>
                </CardContent>
              </Panel>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-6">
                <Panel className="sm:col-span-7">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      {lang === "vi"
                        ? "Phân bổ chi tiêu tháng này"
                        : "Spending breakdown this month"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative flex h-[280px] items-center justify-center sm:h-[350px]">
                    {categoryData.length > 0 ? (
                      <>
                        <ResponsiveChart className="h-full w-full">
                          <RePieChart>
                            <RePie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <ReCell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </RePie>
                            <ReTooltip
                              {...chartTooltipProps}
                              formatter={(
                                value: number | string | undefined,
                              ) => [
                                `${Number(value || 0).toLocaleString(currencyFormat)} ${currencySymbol}`,
                              ]}
                            />
                          </RePieChart>
                        </ResponsiveChart>
                        <div className="pointer-events-none absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">
                            {lang === "vi"
                              ? `${(categoryData.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}tr`
                              : `${(categoryData.reduce((sum, c) => sum + c.value, 0) / 1000).toFixed(1)}k`}
                          </span>
                          <span className="text-xs uppercase text-muted-foreground">
                            {lang === "vi" ? "Tổng chi" : "Total spent"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {lang === "vi"
                          ? "Tháng này chưa có chi tiêu."
                          : "No spending this month."}
                      </p>
                    )}
                  </CardContent>
                </Panel>

                <Panel className="sm:col-span-5">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
                      {lang === "vi" ? "Chi tiết danh mục" : "Category details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categoryData.length > 0 ? (
                        categoryData.map((item) => {
                          const total = categoryData.reduce(
                            (sum, c) => sum + c.value,
                            0,
                          );
                          return (
                            <div
                              key={item.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                  aria-hidden="true"
                                />
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  {item.value.toLocaleString(currencyFormat)}{" "}
                                  {currencySymbol}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round((item.value / total) * 100)}%
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="py-10 text-center text-sm text-muted-foreground">
                          {lang === "vi"
                            ? "Không có dữ liệu chi tiết."
                            : "No detailed data."}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Panel>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </PageShell>
    </DashboardLayout>
  );
}
