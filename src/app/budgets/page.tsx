"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db, Budget, Transaction, Category } from "@/lib/db";
import { toast } from "sonner";

import { useTranslation } from "@/hooks/use-translation";

export default function BudgetsPage() {
  const { t, lang } = useTranslation();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    period: "monthly",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, transactionData, categoryData] = await Promise.all([
        db.getBudgets(),
        db.getTransactions(),
        db.getCategories("expense"),
      ]);

      setBudgets(budgetData || []);
      setCategories(categoryData || []);

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
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("common.budgets")}
            </h1>
          </div>
          <Button
            onClick={handleOpenAddDialog}
            className="rounded-xl shadow-lg shadow-primary/20 h-11 px-6 font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            {lang === "vi" ? "Thiết lập ngân sách" : "Set up budget"}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {lang === "vi" ? "Tổng hạn mức" : "Total limits"}
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalBudgeted.toLocaleString(currencyFormat)} {currencySymbol}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-primary" />
                {lang === "vi"
                  ? "Tổng định mức tháng này"
                  : "Total budget this month"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/5 to-transparent">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {lang === "vi" ? "Đã chi tiêu" : "Spent"}
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSpentInBudgets.toLocaleString(currencyFormat)}{" "}
                {currencySymbol}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBudgeted > 0
                  ? lang === "vi"
                    ? `${Math.round((totalSpentInBudgets / totalBudgeted) * 100)}% hạn mức đã dùng`
                    : `${Math.round((totalSpentInBudgets / totalBudgeted) * 100)}% budget used`
                  : lang === "vi"
                    ? "Chưa thiết lập hạn mức"
                    : "No budget set up"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500/5 to-transparent">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {lang === "vi" ? "Còn lại" : "Remaining"}
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {remainingBudget.toLocaleString(currencyFormat)}{" "}
                {currencySymbol}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {remainingBudget > (lang === "vi" ? 500000 : 25)
                  ? lang === "vi"
                    ? "Bạn đang làm rất tốt!"
                    : "You are doing great!"
                  : lang === "vi"
                    ? "Hãy chú ý chi tiêu hơn"
                    : "Be careful with spending"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              {lang === "vi"
                ? "Đang phân tích dữ liệu ngân sách..."
                : "Analyzing budget data..."}
            </p>
          </div>
        ) : budgets.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/20 rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="p-6 rounded-2xl bg-primary/10 ring-8 ring-primary/5">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">
                  {lang === "vi" ? "Chưa có ngân sách nào" : "No budgets yet"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {lang === "vi"
                    ? "Thiết lập ngân sách giúp bạn kiểm soát chi tiêu tốt hơn. Bạn có thể đặt hạn mức riêng cho từng danh mục như Ăn uống, Giải trí..."
                    : "Setting a budget helps you control spending better. You can set individual limits for categories like Food, Entertainment..."}
                </p>
              </div>
              <Button
                onClick={handleOpenAddDialog}
                className="mt-2 rounded-xl px-8 h-11 font-semibold"
              >
                {lang === "vi" ? "Bắt đầu ngay" : "Start now"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const spent = monthlyExpenses[budget.category_id] || 0;
              const percent = Math.round((spent / budget.amount) * 100);
              const progressWidth = Math.min(percent, 100);
              const isOver = spent > budget.amount;
              const isWarning = percent > 85 && !isOver;

              return (
                <Card
                  key={budget.id}
                  className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 rounded-2xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{
                          backgroundColor:
                            budget.categories?.color || "#6366f1",
                        }}
                      >
                        <Wallet className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-bold">
                        {budget.categories?.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                        onClick={() => handleOpenEditDialog(budget)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-black tracking-tight">
                            {spent.toLocaleString(currencyFormat)}{" "}
                            {currencySymbol}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
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
                              "border-amber-500 text-amber-600 bg-amber-50",
                          )}
                        >
                          {isOver ? (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />-
                              {Math.round(percent - 100)}%
                            </div>
                          ) : (
                            `${percent}%`
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-700 ease-out",
                              isOver
                                ? "bg-rose-500"
                                : isWarning
                                  ? "bg-amber-500"
                                  : "bg-primary",
                            )}
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
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
                </Card>
              );
            })}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
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
                    <SelectTrigger className="w-full h-11 rounded-xl">
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
                    <p className="text-[10px] text-muted-foreground italic">
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
                      className="h-11 rounded-xl pl-9"
                      required
                    />
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    <SelectTrigger className="w-full h-11 rounded-xl">
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
                  className="rounded-xl h-11"
                >
                  {lang === "vi" ? "Hủy bỏ" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="rounded-xl h-11 px-8 font-bold"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </div>
    </DashboardLayout>
  );
}
