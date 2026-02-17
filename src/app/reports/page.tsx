"use client";

import { useCallback, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer as ReResponsiveContainer,
  PieChart as RePieChart,
  Pie as RePie,
  Cell as ReCell,
} from "recharts";
import {
  AlertCircle,
  Loader2,
  RefreshCcw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db, Transaction } from "@/lib/db";
import { format, subMonths } from "date-fns";

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

      // 1. Calculate Monthly Trend (Last 6 months)
      const months: MonthlyData[] = Array.from({ length: 6 }, (_, i) => ({
        date: subMonths(new Date(), i),
        name: format(subMonths(new Date(), i), "MMM", {
          locale: currentLocale,
        }),
        income: 0,
        expense: 0,
      })).reverse();

      transactions.forEach((item) => {
        const tDate = new Date(item.date);
        const amount = Number(item.amount);
        months.forEach((m) => {
          if (
            tDate.getMonth() === m.date.getMonth() &&
            tDate.getFullYear() === m.date.getFullYear()
          ) {
            if (item.type === "income") m.income += amount;
            else m.expense += amount;
          }
        });
      });
      setMonthlyData(months);

      // 2. Category Breakdown (Current Month)
      const now = new Date();
      const currentMonthExpenses = transactions.filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() === now.getMonth() &&
          new Date(t.date).getFullYear() === now.getFullYear(),
      );

      const catMap: Record<
        string,
        { name: string; value: number; color: string }
      > = {};
      const colors = [
        "#f97316",
        "#3b82f6",
        "#f43f5e",
        "#6366f1",
        "#10b981",
        "#a855f7",
        "#eab308",
      ];

      currentMonthExpenses.forEach((item) => {
        const catName = item.categories?.name || t("common.other");
        const catColor =
          item.categories?.color ||
          colors[Object.keys(catMap).length % colors.length];
        if (!catMap[catName]) {
          catMap[catName] = {
            name: catName,
            value: 0,
            color: catColor,
          };
        }
        catMap[catName].value += Number(item.amount);
      });
      setCategoryData(Object.values(catMap));

      // 3. Summary stats
      const totalIncome = months.reduce((sum, m) => sum + m.income, 0);
      const totalExpense = months.reduce((sum, m) => sum + m.expense, 0);
      const count =
        months.filter((m) => m.income > 0 || m.expense > 0).length || 1;

      setSummary({
        avgIncome: totalIncome / count,
        avgExpense: totalExpense / count,
        totalSavings: totalIncome - totalExpense,
        incomeTrend: 0, // Simplified for now
        expenseTrend: 0,
      });
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {lang === "vi" ? "Đang phân tích dữ liệu..." : "Analyzing data..."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const noData = monthlyData.length === 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("common.reports")}
            </h1>
            <p className="text-muted-foreground">
              {lang === "vi"
                ? "Phân tích chi tiết dòng tiền và thói quen tiêu dùng."
                : "Detailed analysis of cash flow and spending habits."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="rounded-lg h-9"
            >
              <RefreshCcw
                className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
              />
              {lang === "vi" ? "Làm mới" : "Refresh"}
            </Button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors h-9">
              <Calendar className="h-4 w-4" />
              {lang === "vi" ? "6 tháng qua" : "Last 6 months"}
            </button>
          </div>
        </div>

        {noData ? (
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-bold">
                  {lang === "vi"
                    ? "Chưa có đủ dữ liệu báo cáo"
                    : "Not enough report data"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {lang === "vi"
                    ? "Hãy thêm giao dịch để Levi AI có thể phân tích báo cáo cho bạn."
                    : "Add transactions so Levi AI can analyze reports for you."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
              <TabsTrigger value="overview" className="rounded-lg px-6">
                {lang === "vi" ? "Tổng quan" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="categories" className="rounded-lg px-6">
                {lang === "vi" ? "Theo danh mục" : "By category"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      {lang === "vi" ? "Thu nhập trung bình" : "Average Income"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summary.avgIncome.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "vi"
                        ? "Tính trên các tháng có dữ liệu"
                        : "Based on months with data"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      {lang === "vi"
                        ? "Chi tiêu trung bình"
                        : "Average Expense"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summary.avgExpense.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "vi"
                        ? "Tính trên các tháng có dữ liệu"
                        : "Based on months with data"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      {lang === "vi" ? "Tích lũy tổng" : "Total Savings"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summary.totalSavings.toLocaleString(currencyFormat)}{" "}
                      {currencySymbol}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "vi"
                        ? "Tổng tích lũy 6 tháng qua"
                        : "Total savings in last 6 months"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    {lang === "vi"
                      ? "So sánh Thu nhập & Chi tiêu"
                      : "Income & Expense Comparison"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] pt-6">
                  <ReResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={monthlyData}>
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
                        dataKey="income"
                        name={lang === "vi" ? "Thu nhập" : "Income"}
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                      <ReBar
                        dataKey="expense"
                        name={lang === "vi" ? "Chi tiêu" : "Expense"}
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </ReBarChart>
                  </ReResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-12">
                <Card className="border-none shadow-sm md:col-span-7">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-primary" />
                      {lang === "vi"
                        ? "Phân bổ chi tiêu tháng này"
                        : "Spending breakdown this month"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px] flex items-center justify-center relative">
                    {categoryData.length > 0 ? (
                      <>
                        <ReResponsiveContainer width="100%" height="100%">
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
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                              }}
                              formatter={(
                                value: number | string | undefined,
                              ) => [
                                `${Number(value || 0).toLocaleString(currencyFormat)} ${currencySymbol}`,
                              ]}
                            />
                          </RePieChart>
                        </ReResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold">
                            {lang === "vi"
                              ? `${(categoryData.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}tr`
                              : `${(categoryData.reduce((sum, c) => sum + c.value, 0) / 1000).toFixed(1)}k`}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
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
                </Card>

                <Card className="border-none shadow-sm md:col-span-5">
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
                                <p className="text-[10px] text-muted-foreground">
                                  {Math.round((item.value / total) * 100)}%
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center py-10 text-sm text-muted-foreground">
                          {lang === "vi"
                            ? "Không có dữ liệu chi tiết."
                            : "No detailed data."}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
