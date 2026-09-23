"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Wallet,
  AlertCircle,
  Loader2,
  Trash2,
  Pencil,
  PiggyBank,
  ArrowUpRight,
  TrendingDown,
  CalendarClock,
  Repeat,
  Play,
  Pause,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  db,
  Budget,
  Transaction,
  Category,
  RecurringTransaction,
} from "@/lib/db";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { PageShell } from "@/components/common/page-shell";
import { Panel } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import {
  ListSkeleton,
  StatCardSkeleton,
} from "@/components/common/skeletons";
import { amountTone, categoryColor } from "@/lib/ui";

import { useTranslation } from "@/hooks/use-translation";

export default function BudgetsPage() {
  const { t, lang } = useTranslation();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Budgets Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    period: "monthly",
  });

  // Recurring Dialog state
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] =
    useState<RecurringTransaction | null>(null);
  const [recurringFormData, setRecurringFormData] = useState({
    categoryId: "",
    amount: "",
    type: "expense" as "income" | "expense",
    note: "",
    frequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    nextDate: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Process any due recurring transactions first
      await db.processRecurringTransactions();

      const [
        budgetData,
        transactionData,
        categoryData,
        allCatData,
        recurringData,
      ] = await Promise.all([
        db.getBudgets(),
        db.getTransactions(),
        db.getCategories("expense"),
        db.getCategories(),
        db.getRecurringTransactions(),
      ]);

      setBudgets(budgetData || []);
      setCategories(categoryData || []);
      setAllCategories(allCatData || []);
      setRecurringTransactions(recurringData || []);

      // Calculate monthly expenses per category
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const expenses: Record<string, number> = {};
      transactionData?.forEach((t: Transaction) => {
        const tDate = new Date(t.date);
        if (t.type === "expense" && tDate >= firstDayOfMonth) {
          expenses[t.category_id] =
            (expenses[t.category_id] || 0) + Number(t.amount);
        }
      });
      setMonthlyExpenses(expenses);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingBudget(null);
    setFormData({
      categoryId: "",
      amount: "",
      period: "monthly",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.category_id,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const isVi = lang === "vi";
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    setIsSubmitLoading(true);
    try {
      if (editingBudget) {
        await db.updateBudget(editingBudget.id, {
          category_id: formData.categoryId,
          amount: Number(formData.amount),
          period: formData.period,
        });
        toast.success(isVi ? "Đã cập nhật ngân sách" : "Budget updated");
      } else {
        // Check if budget for this category already exists
        if (budgets.some((b) => b.category_id === formData.categoryId)) {
          toast.error(
            isVi
              ? "Danh mục này đã có ngân sách rồi"
              : "This category already has a budget",
          );
          return;
        }

        const {
          data: { user },
        } = await (await import("@/lib/supabase")).supabase.auth.getUser();
        if (!user) return;

        await db.addBudget({
          user_id: user.id,
          category_id: formData.categoryId,
          amount: Number(formData.amount),
          period: formData.period,
        });
        toast.success(
          isVi ? "Đã thiết lập ngân sách mới" : "New budget set up",
        );
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error(
        isVi
          ? "Có lỗi xảy ra, vui lòng thử lại"
          : "An error occurred, please try again",
      );
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    const isVi = lang === "vi";
    if (
      !confirm(
        isVi
          ? "Bạn có chắc chắn muốn xóa ngân sách này?"
          : "Are you sure you want to delete this budget?",
      )
    )
      return;

    try {
      await db.deleteBudget(id);
      toast.success(isVi ? "Đã xóa ngân sách" : "Budget deleted");
      fetchData();
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error(isVi ? "Không thể xóa ngân sách" : "Cannot delete budget");
    }
  };

  const handleOpenAddRecurring = () => {
    setEditingRecurring(null);
    setRecurringFormData({
      categoryId: "",
      amount: "",
      type: "expense",
      note: "",
      frequency: "monthly",
      nextDate: new Date().toISOString().split("T")[0],
    });
    setIsRecurringDialogOpen(true);
  };

  const handleOpenEditRecurring = (item: RecurringTransaction) => {
    setEditingRecurring(item);
    setRecurringFormData({
      categoryId: item.category_id,
      amount: item.amount.toString(),
      type: item.type,
      note: item.note,
      frequency: item.frequency,
      nextDate: item.next_date,
    });
    setIsRecurringDialogOpen(true);
  };

  const handleRecurringSubmit = async (e: React.FormEvent) => {
    const isVi = lang === "vi";
    e.preventDefault();
    if (!recurringFormData.categoryId || !recurringFormData.amount) return;

    setIsSubmitLoading(true);
    try {
      const {
        data: { user },
      } = await (await import("@/lib/supabase")).supabase.auth.getUser();
      if (!user) return;

      const payload = {
        user_id: user.id,
        category_id: recurringFormData.categoryId,
        amount: Number(recurringFormData.amount),
        type: recurringFormData.type,
        note: recurringFormData.note,
        frequency: recurringFormData.frequency,
        next_date: recurringFormData.nextDate,
        is_active: editingRecurring ? editingRecurring.is_active : true,
      };

      if (editingRecurring) {
        await db.updateRecurringTransaction(editingRecurring.id, payload);
        toast.success(
          isVi ? "Đã cập nhật giao dịch cố định" : "Recurring updated",
        );
      } else {
        await db.addRecurringTransaction(payload);
        toast.success(
          isVi ? "Đã thêm giao dịch cố định mới" : "Added recurring item",
        );
      }
      setIsRecurringDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving recurring:", error);
      toast.error(isVi ? "Có lỗi xảy ra" : "An error occurred");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    const isVi = lang === "vi";
    if (
      !confirm(
        isVi ? "Xóa giao dịch cố định này?" : "Delete this recurring item?",
      )
    )
      return;

    try {
      await db.deleteRecurringTransaction(id);
      toast.success(isVi ? "Đã xóa" : "Deleted");
      fetchData();
    } catch (error) {
      console.error("Error deleting recurring:", error);
    }
  };

  const toggleRecurringActive = async (item: RecurringTransaction) => {
    try {
      await db.updateRecurringTransaction(item.id, {
        is_active: !item.is_active,
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling recurring:", error);
    }
  };

  // Calculate totals
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => {
    return sum + (monthlyExpenses[b.category_id] || 0);
  }, 0);
  const remainingBudget = Math.max(0, totalBudgeted - totalSpentInBudgets);

  const currencyFormat = lang === "vi" ? "vi-VN" : "en-US";
  const currencySymbol = lang === "vi" ? "₫" : "$";

  return (
    <DashboardLayout>
      <PageShell>
        {/* Header */}
        <PageHeader
          title={t("common.budgets")}
          description={
            lang === "vi"
              ? "Thiết lập hạn mức chi tiêu theo danh mục và quản lý các khoản cố định."
              : "Set spending limits by category and manage recurring items."
          }
        />

        <Tabs defaultValue="budgets" className="space-y-4 sm:space-y-6">
          <TabsList className="h-10 w-full bg-muted/50 p-1 sm:h-11 sm:w-auto">
            <TabsTrigger
              value="budgets"
              className="flex-1 rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-sm sm:flex-none sm:px-6 sm:text-sm"
            >
              <Wallet
                className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              {lang === "vi" ? "Hạn mức" : "Limits"}
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="flex-1 rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-sm sm:flex-none sm:px-6 sm:text-sm"
            >
              <CalendarClock
                className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              {lang === "vi" ? "Cố định" : "Recurring"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budgets" className="mt-0 space-y-8">
            {/* Summary Cards moved inside TabsContent if they only represent budgets */}
            <div className="flex justify-end">
              <Button
                onClick={handleOpenAddDialog}
                className="h-11 rounded-lg px-6 font-semibold shadow-lg shadow-primary/20"
              >
                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                {lang === "vi" ? "Thiết lập ngân sách" : "Set up budget"}
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
              <Panel className="bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "vi" ? "Tổng hạn mức" : "Total limits"}
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">
                    {totalBudgeted.toLocaleString(currencyFormat)}{" "}
                    {currencySymbol}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    />
                    {lang === "vi"
                      ? "Tổng định mức tháng này"
                      : "Total budget this month"}
                  </p>
                </CardContent>
              </Panel>
              <Panel className="bg-gradient-to-br from-danger/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "vi" ? "Đã chi tiêu" : "Spent"}
                  </CardTitle>
                  <TrendingDown
                    className="h-4 w-4 text-danger"
                    aria-hidden="true"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">
                    {totalSpentInBudgets.toLocaleString(currencyFormat)}{" "}
                    {currencySymbol}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {totalBudgeted > 0
                      ? lang === "vi"
                        ? `${Math.round((totalSpentInBudgets / totalBudgeted) * 100)}% hạn mức đã dùng`
                        : `${Math.round((totalSpentInBudgets / totalBudgeted) * 100)}% budget used`
                      : lang === "vi"
                        ? "Chưa thiết lập hạn mức"
                        : "No budget set up"}
                  </p>
                </CardContent>
              </Panel>
              <Panel className="bg-gradient-to-br from-success/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "vi" ? "Còn lại" : "Remaining"}
                  </CardTitle>
                  <PiggyBank
                    className="h-4 w-4 text-success"
                    aria-hidden="true"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">
                    {remainingBudget.toLocaleString(currencyFormat)}{" "}
                    {currencySymbol}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    {remainingBudget > (lang === "vi" ? 500000 : 25)
                      ? lang === "vi"
                        ? "Bạn đang làm rất tốt!"
                        : "You are doing great!"
                      : lang === "vi"
                        ? "Hãy chú ý chi tiêu hơn"
                        : "Be careful with spending"}
                  </p>
                </CardContent>
              </Panel>
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            ) : budgets.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title={
                  lang === "vi" ? "Chưa có ngân sách nào" : "No budgets yet"
                }
                description={
                  lang === "vi"
                    ? "Thiết lập ngân sách giúp bạn kiểm soát chi tiêu tốt hơn. Bạn có thể đặt hạn mức riêng cho từng danh mục như Ăn uống, Giải trí..."
                    : "Setting a budget helps you control spending better. You can set individual limits for categories like Food, Entertainment..."
                }
                action={
                  <Button
                    onClick={handleOpenAddDialog}
                    className="rounded-lg px-8 h-11 font-semibold"
                  >
                    {lang === "vi" ? "Bắt đầu ngay" : "Start now"}
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {budgets.map((budget) => {
                  const spent = monthlyExpenses[budget.category_id] || 0;
                  const percent = Math.round((spent / budget.amount) * 100);
                  const progressWidth = Math.min(percent, 100);
                  const isOver = spent > budget.amount;
                  const isWarning = percent > 85 && !isOver;

                  return (
                    <Panel
                      key={budget.id}
                      className="group overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm"
                            style={{
                              backgroundColor: categoryColor(
                                budget.categories?.color,
                              ),
                            }}
                          >
                            <Wallet
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <CardTitle className="text-lg font-bold">
                            {budget.categories?.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                              lang === "vi" ? "Chỉnh sửa ngân sách" : "Edit budget"
                            }
                            title={lang === "vi" ? "Chỉnh sửa" : "Edit"}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenEditDialog(budget)}
                          >
                            <Pencil
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                              lang === "vi" ? "Xóa ngân sách" : "Delete budget"
                            }
                            title={lang === "vi" ? "Xóa" : "Delete"}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteBudget(budget.id)}
                          >
                            <Trash2
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-5">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-black tracking-tight sm:text-2xl">
                                {spent.toLocaleString(currencyFormat)}{" "}
                                {currencySymbol}
                              </p>
                              <p className="text-xs font-medium text-muted-foreground">
                                {lang === "vi" ? "mục tiêu" : "target"}:{" "}
                                {budget.amount.toLocaleString(currencyFormat)}{" "}
                                {currencySymbol}
                              </p>
                            </div>
                            <Badge
                              variant={
                                isOver
                                  ? "destructive"
                                  : isWarning
                                    ? "outline"
                                    : "secondary"
                              }
                              className={cn(
                                "rounded-full px-3 py-1 font-bold",
                                isWarning &&
                                  "border-warning bg-warning-muted text-warning",
                              )}
                            >
                              {isOver ? (
                                <div className="flex items-center gap-1">
                                  <AlertCircle
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  -{Math.round(percent - 100)}%
                                </div>
                              ) : (
                                `${percent}%`
                              )}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  "h-full transition-all duration-700 ease-out",
                                  isOver
                                    ? "bg-danger"
                                    : isWarning
                                      ? "bg-warning"
                                      : "bg-primary",
                                )}
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              <span>
                                {percent <= 100
                                  ? lang === "vi"
                                    ? "Đã sử dụng"
                                    : "Used"
                                  : lang === "vi"
                                    ? "Vượt mức"
                                    : "Over limit"}
                              </span>
                              <span>
                                {isOver
                                  ? lang === "vi"
                                    ? "Vượt: "
                                    : "Over: "
                                  : lang === "vi"
                                    ? "Còn: "
                                    : "Rem: "}
                                {Math.abs(budget.amount - spent).toLocaleString(
                                  currencyFormat,
                                )}{" "}
                                {currencySymbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Panel>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recurring" className="mt-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {lang === "vi"
                    ? "Giao dịch lặp lại"
                    : "Recurring Transactions"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {lang === "vi"
                    ? "Quản lý các khoản thu chi cố định (tiền nhà, tiền mạng...)"
                    : "Manage fixed income/expenses like rent, internet..."}
                </p>
              </div>
              <Button
                onClick={handleOpenAddRecurring}
                className="h-11 rounded-lg px-6 font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                {lang === "vi" ? "Thêm khoản cố định" : "Add recurring"}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                <ListSkeleton rows={4} />
              </div>
            ) : recurringTransactions.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title={
                  lang === "vi"
                    ? "Chưa có khoản cố định nào"
                    : "No recurring items yet"
                }
                description={
                  lang === "vi"
                    ? "Thêm các khoản thu chi định kỳ để Levi AI tự động ghi nhận giúp bạn."
                    : "Add recurring income/expenses and let Levi AI record them for you."
                }
              />
            ) : (
              <div className="grid gap-4">
                {recurringTransactions.map((item) => (
                  <Panel
                    key={item.id}
                    className={cn(
                      "overflow-hidden",
                      !item.is_active && "opacity-60 grayscale-[0.5]",
                    )}
                  >
                    <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          backgroundColor: categoryColor(
                            item.categories?.color,
                            "var(--muted-foreground)",
                          ),
                        }}
                      >
                        {item.type === "expense" ? (
                          <ArrowDownRight
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUpRight
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate font-bold">
                            {item.note || item.categories?.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className="h-4 px-1 text-[10px]"
                          >
                            {item.categories?.name}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Repeat
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {item.frequency === "monthly"
                              ? lang === "vi"
                                ? "Hàng tháng"
                                : "Monthly"
                              : item.frequency === "weekly"
                                ? lang === "vi"
                                  ? "Hàng tuần"
                                  : "Weekly"
                                : item.frequency === "yearly"
                                  ? lang === "vi"
                                    ? "Hàng năm"
                                    : "Yearly"
                                  : "Hàng ngày"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarClock
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {lang === "vi" ? "Kỳ tới: " : "Next: "}{" "}
                            {new Date(item.next_date).toLocaleDateString(
                              currencyFormat,
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={cn(
                            "text-lg font-black",
                            amountTone(item.type),
                          )}
                        >
                          {item.type === "income" ? "+" : "-"}
                          {item.amount.toLocaleString(currencyFormat)}{" "}
                          {currencySymbol}
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                              item.is_active
                                ? lang === "vi"
                                  ? "Tạm dừng khoản cố định"
                                  : "Pause recurring item"
                                : lang === "vi"
                                  ? "Tiếp tục khoản cố định"
                                  : "Resume recurring item"
                            }
                            title={
                              item.is_active
                                ? lang === "vi"
                                  ? "Tạm dừng"
                                  : "Pause"
                                : lang === "vi"
                                  ? "Tiếp tục"
                                  : "Resume"
                            }
                            className="h-8 w-8 rounded-lg transition-all active:scale-95 sm:h-7 sm:w-7"
                            onClick={() => toggleRecurringActive(item)}
                          >
                            {item.is_active ? (
                              <Pause
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <Play
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                              lang === "vi"
                                ? "Chỉnh sửa khoản cố định"
                                : "Edit recurring item"
                            }
                            title={lang === "vi" ? "Chỉnh sửa" : "Edit"}
                            className="h-8 w-8 rounded-lg transition-all active:scale-95 sm:h-7 sm:w-7"
                            onClick={() => handleOpenEditRecurring(item)}
                          >
                            <Pencil
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                              lang === "vi"
                                ? "Xóa khoản cố định"
                                : "Delete recurring item"
                            }
                            title={lang === "vi" ? "Xóa" : "Delete"}
                            className="h-8 w-8 rounded-lg text-muted-foreground transition-all hover:text-destructive active:scale-95 sm:h-7 sm:w-7"
                            onClick={() => handleDeleteRecurring(item.id)}
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Budgets Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingBudget
                  ? lang === "vi"
                    ? "Sửa ngân sách"
                    : "Edit budget"
                  : lang === "vi"
                    ? "Thiết lập ngân sách mới"
                    : "Set up new budget"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {lang === "vi"
                  ? "Chọn danh mục, hạn mức và chu kỳ cho ngân sách."
                  : "Choose a category, limit and period for the budget."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-bold">
                    {lang === "vi" ? "Danh mục chi tiêu" : "Spending category"}
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, categoryId: val })
                    }
                    disabled={!!editingBudget}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-11 w-full rounded-lg"
                    >
                      <SelectValue
                        placeholder={
                          lang === "vi"
                            ? "Chọn danh mục..."
                            : "Select category..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editingBudget && (
                    <p className="text-[10px] italic text-muted-foreground">
                      {lang === "vi"
                        ? "* Không thể đổi danh mục khi đang sửa hạn mức."
                        : "* Cannot change category while editing budget limit."}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-bold">
                    {lang === "vi"
                      ? `Số tiền hạn mức (${currencySymbol})`
                      : `Budget limit (${currencySymbol})`}
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder={
                        lang === "vi" ? "Ví dụ: 2000000" : "Example: 100"
                      }
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="h-11 rounded-lg pl-9"
                      required
                    />
                    <Wallet
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period" className="text-sm font-bold">
                    {lang === "vi" ? "Chu kỳ" : "Period"}
                  </Label>
                  <Select
                    value={formData.period}
                    onValueChange={(val) =>
                      setFormData({ ...formData, period: val })
                    }
                  >
                    <SelectTrigger
                      id="period"
                      className="h-11 w-full rounded-lg"
                    >
                      <SelectValue
                        placeholder={
                          lang === "vi" ? "Chọn chu kỳ..." : "Select period..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">
                        {lang === "vi" ? "Hàng tháng" : "Monthly"}
                      </SelectItem>
                      <SelectItem value="weekly">
                        {lang === "vi" ? "Hàng tuần" : "Weekly"}
                      </SelectItem>
                      <SelectItem value="yearly">
                        {lang === "vi" ? "Hàng năm" : "Yearly"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-11 rounded-lg"
                >
                  {lang === "vi" ? "Hủy bỏ" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitLoading}
                  aria-busy={isSubmitLoading}
                  className="h-11 rounded-lg px-8 font-bold"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      {lang === "vi" ? "Đang lưu..." : "Saving..."}
                    </>
                  ) : editingBudget ? (
                    lang === "vi" ? (
                      "Cập nhật"
                    ) : (
                      "Update"
                    )
                  ) : lang === "vi" ? (
                    "Lưu ngân sách"
                  ) : (
                    "Save budget"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Recurring Dialog */}
        <Dialog
          open={isRecurringDialogOpen}
          onOpenChange={setIsRecurringDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingRecurring
                  ? lang === "vi"
                    ? "Sửa khoản cố định"
                    : "Edit recurring"
                  : lang === "vi"
                    ? "Thêm khoản cố định"
                    : "Add recurring"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {lang === "vi"
                  ? "Thiết lập khoản thu chi định kỳ và chu kỳ lặp lại."
                  : "Set up a recurring income/expense and its frequency."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRecurringSubmit} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rec-type" className="text-sm font-bold">
                      {lang === "vi" ? "Loại" : "Type"}
                    </Label>
                    <Select
                      value={recurringFormData.type}
                      onValueChange={(val: "income" | "expense") =>
                        setRecurringFormData({
                          ...recurringFormData,
                          type: val,
                        })
                      }
                    >
                      <SelectTrigger id="rec-type" className="h-11 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">
                          {lang === "vi" ? "Chi tiêu" : "Expense"}
                        </SelectItem>
                        <SelectItem value="income">
                          {lang === "vi" ? "Thu nhập" : "Income"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rec-frequency" className="text-sm font-bold">
                      {lang === "vi" ? "Chu kỳ" : "Frequency"}
                    </Label>
                    <Select
                      value={recurringFormData.frequency}
                      onValueChange={(
                        val: "daily" | "weekly" | "monthly" | "yearly",
                      ) =>
                        setRecurringFormData({
                          ...recurringFormData,
                          frequency: val,
                        })
                      }
                    >
                      <SelectTrigger
                        id="rec-frequency"
                        className="h-11 rounded-lg"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">
                          {lang === "vi" ? "Hàng ngày" : "Daily"}
                        </SelectItem>
                        <SelectItem value="weekly">
                          {lang === "vi" ? "Hàng tuần" : "Weekly"}
                        </SelectItem>
                        <SelectItem value="monthly">
                          {lang === "vi" ? "Hàng tháng" : "Monthly"}
                        </SelectItem>
                        <SelectItem value="yearly">
                          {lang === "vi" ? "Hàng năm" : "Yearly"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec-category" className="text-sm font-bold">
                    {lang === "vi" ? "Danh mục" : "Category"}
                  </Label>
                  <Select
                    value={recurringFormData.categoryId}
                    onValueChange={(val) =>
                      setRecurringFormData({
                        ...recurringFormData,
                        categoryId: val,
                      })
                    }
                  >
                    <SelectTrigger
                      id="rec-category"
                      className="h-11 rounded-lg"
                    >
                      <SelectValue
                        placeholder={
                          lang === "vi"
                            ? "Chọn danh mục..."
                            : "Select category..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories
                        .filter((c) => c.type === recurringFormData.type)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec-amount" className="text-sm font-bold">
                    {lang === "vi" ? "Số tiền" : "Amount"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="rec-amount"
                      type="number"
                      value={recurringFormData.amount}
                      onChange={(e) =>
                        setRecurringFormData({
                          ...recurringFormData,
                          amount: e.target.value,
                        })
                      }
                      className="h-11 rounded-lg pl-9"
                      required
                    />
                    <Wallet
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec-date" className="text-sm font-bold">
                    {lang === "vi"
                      ? "Ngày bắt đầu / Ngày kỳ tới"
                      : "Start / Next Date"}
                  </Label>
                  <Input
                    id="rec-date"
                    type="date"
                    value={recurringFormData.nextDate}
                    onChange={(e) =>
                      setRecurringFormData({
                        ...recurringFormData,
                        nextDate: e.target.value,
                      })
                    }
                    className="h-11 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec-note" className="text-sm font-bold">
                    {lang === "vi" ? "Ghi chú" : "Note"}
                  </Label>
                  <Input
                    id="rec-note"
                    value={recurringFormData.note}
                    onChange={(e) =>
                      setRecurringFormData({
                        ...recurringFormData,
                        note: e.target.value,
                      })
                    }
                    placeholder={
                      lang === "vi" ? "Vd: Tiền nhà tháng" : "e.g. Monthly rent"
                    }
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRecurringDialogOpen(false)}
                  className="h-11 rounded-lg"
                >
                  {lang === "vi" ? "Hủy" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitLoading}
                  aria-busy={isSubmitLoading}
                  className="h-11 rounded-lg px-8 font-bold"
                >
                  {isSubmitLoading ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : editingRecurring ? (
                    lang === "vi" ? (
                      "Cập nhật"
                    ) : (
                      "Update"
                    )
                  ) : lang === "vi" ? (
                    "Lưu"
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageShell>
    </DashboardLayout>
  );
}
