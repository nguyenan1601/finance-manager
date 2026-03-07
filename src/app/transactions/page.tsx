"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Filter,
  Search,
  Download,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  AddTransactionDialog,
  TransactionFormData,
} from "@/components/dashboard/add-transaction-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BillScanner } from "@/components/dashboard/bill-scanner";

interface Transaction {
  id: string;
  date: string;
  note?: string;
  name?: string;
  type: "income" | "expense";
  amount: number;
  category_id?: string;
  categories?: {
    name: string;
  };
}

import { useTranslation } from "@/hooks/use-translation";

export default function TransactionsPage() {
  const { t, lang } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionFormData | null>(null);

  // States for filtering
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await db.getTransactions();
      setTransactions(data || []);
    } catch (error: unknown) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || t.type === filterType;

    const matchesCategory =
      filterCategory === "all" || t.categories?.name === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setSearchTerm("");
  };

  const hasActiveFilters =
    filterType !== "all" || filterCategory !== "all" || searchTerm !== "";

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: String(transaction.amount),
      type: transaction.type,
      category_id: transaction.category_id || "",
      note: transaction.note || "",
      date: transaction.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isVi = lang === "vi";
    const confirmMsg = isVi
      ? "Bạn có chắc chắn muốn xóa giao dịch này?"
      : "Are you sure you want to delete this transaction?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await db.deleteTransaction(id);
      toast.success(
        isVi ? "Đã xóa giao dịch thành công!" : "Transaction deleted!",
      );
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(isVi ? "Lỗi khi xóa giao dịch." : "Error deleting.");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  };

  const handleExport = () => {
    const isVi = lang === "vi";
    try {
      if (filteredTransactions.length === 0) {
        toast.error(
          isVi
            ? "Không có giao dịch nào để xuất báo cáo."
            : "No transactions to export.",
        );
        return;
      }

      const headers = isVi
        ? ["Ngày", "Mô tả", "Danh mục", "Loại", "Số tiền (VND)"]
        : ["Date", "Description", "Category", "Type", "Amount"];

      const currencyFormat = isVi ? "vi-VN" : "en-US";

      const rows = filteredTransactions.map((t) => [
        new Date(t.date).toLocaleDateString(currencyFormat),
        t.note || t.name || (isVi ? "Không có ghi chú" : "No note"),
        t.categories?.name || (isVi ? "Khác" : "Other"),
        t.type === "income"
          ? isVi
            ? "Thu nhập"
            : "Income"
          : isVi
            ? "Chi tiêu"
            : "Expense",
        t.amount,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${isVi ? "bao-cao-giao-dich" : "transaction-report"}-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        isVi ? "Đã xuất báo cáo thành công!" : "Report exported successfully!",
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error(isVi ? "Lỗi khi xuất báo cáo." : "Error exporting report.");
    }
  };

  const currencyFormat = lang === "vi" ? "vi-VN" : "en-US";
  const currencySymbol = lang === "vi" ? "₫" : "$";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("common.transactions")}
              </h1>
              <div className="flex items-center gap-2 sm:hidden">
                <BillScanner onSuccess={fetchTransactions} />
                <Button
                  size="sm"
                  className="rounded-lg shadow-lg shadow-primary/20 h-9"
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {lang === "vi"
                ? "Theo dõi và quản lý toàn bộ các khoản thu chi của bạn."
                : "Track and manage all your income and expenses."}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <BillScanner onSuccess={fetchTransactions} />
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex rounded-lg"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("common.export")}
            </Button>
            <Button
              size="sm"
              className="rounded-lg shadow-lg shadow-primary/20"
              onClick={() => {
                setEditingTransaction(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("common.new")}
            </Button>
          </div>
        </div>

        <AddTransactionDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onAdd={() => fetchTransactions()}
          editData={editingTransaction}
        />

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("common.searchPlaceholder")}
                  className="pl-10 rounded-xl bg-background border-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        filterType !== "all" || filterCategory !== "all"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      <Filter className="mr-2 h-3.5 w-3.5" />
                      {t("common.filter")}
                      {(filterType !== "all" || filterCategory !== "all") && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-4 px-1 text-[10px]"
                        >
                          !
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {lang === "vi" ? "Theo loại" : "By type"}
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <DropdownMenuRadioItem value="all">
                        {lang === "vi" ? "Tất cả" : "All"}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="income">
                        {t("common.income")}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="expense">
                        {t("common.expense")}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>
                      {t("common.category")}
                    </DropdownMenuLabel>
                    <div className="max-h-60 overflow-y-auto">
                      <DropdownMenuRadioGroup
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <DropdownMenuRadioItem value="all">
                          {lang === "vi" ? "Tất cả danh mục" : "All categories"}
                        </DropdownMenuRadioItem>
                        {Array.from(
                          new Set(
                            transactions
                              .map((t) => t.categories?.name)
                              .filter(Boolean),
                          ),
                        ).map((catName) => (
                          <DropdownMenuRadioItem
                            key={catName}
                            value={catName as string}
                          >
                            {catName}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </div>

                    {hasActiveFilters && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={clearFilters}
                          >
                            {lang === "vi"
                              ? "Xóa tất cả bộ lọc"
                              : "Clear all filters"}
                          </Button>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("common.loading")}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile/Tablet List View */}
                <div className="md:hidden divide-y divide-border">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-muted/5">
                      {t("common.noTransactions")}
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 flex flex-col gap-2 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-bold text-sm leading-tight line-clamp-2">
                              {transaction.note ||
                                transaction.name ||
                                (lang === "vi"
                                  ? "Không có ghi chú"
                                  : "No note")}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                {new Date(transaction.date).toLocaleDateString(
                                  currencyFormat,
                                )}
                              </span>
                              <Badge
                                variant="secondary"
                                className="h-4 px-1.5 text-[10px] bg-muted/50 font-normal border-none"
                              >
                                {transaction.categories?.name ||
                                  (lang === "vi" ? "Khác" : "Other")}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className={cn(
                                "font-bold text-sm",
                                transaction.type === "income"
                                  ? "text-emerald-600"
                                  : "text-rose-600",
                              )}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {Number(transaction.amount).toLocaleString(
                                currencyFormat,
                              )}{" "}
                              {currencySymbol}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 text-muted-foreground hover:text-primary active:scale-95 transition-all"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">{t("common.edit")}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 text-muted-foreground hover:text-destructive active:scale-95 transition-all"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">
                              {t("common.delete")}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="font-bold py-4 min-w-[100px]">
                          {t("common.date")}
                        </TableHead>
                        <TableHead className="font-bold min-w-[200px]">
                          {t("common.description")}
                        </TableHead>
                        <TableHead className="font-bold">
                          {t("common.category")}
                        </TableHead>
                        <TableHead className="font-bold text-right">
                          {t("common.amount")}
                        </TableHead>
                        <TableHead className="font-bold text-center">
                          {t("common.status")}
                        </TableHead>
                        <TableHead className="font-bold text-center w-[120px]">
                          {lang === "vi" ? "Thao tác" : "Actions"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-muted-foreground"
                          >
                            {t("common.noTransactions")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="text-muted-foreground font-medium">
                              {new Date(transaction.date).toLocaleDateString(
                                currencyFormat,
                              )}
                            </TableCell>
                            <TableCell className="font-bold">
                              {transaction.note ||
                                transaction.name ||
                                (lang === "vi"
                                  ? "Không có ghi chú"
                                  : "No note")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="font-medium bg-muted/50 border-none"
                              >
                                {transaction.categories?.name ||
                                  (lang === "vi" ? "Khác" : "Other")}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right font-bold text-base",
                                transaction.type === "income"
                                  ? "text-emerald-600"
                                  : "text-rose-600",
                              )}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {Number(transaction.amount).toLocaleString(
                                currencyFormat,
                              )}{" "}
                              {currencySymbol}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => handleEdit(transaction)}
                                  title={lang === "vi" ? "Chỉnh sửa" : "Edit"}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(transaction.id)}
                                  title={lang === "vi" ? "Xóa" : "Delete"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    {lang === "vi"
                      ? `Hiển thị ${filteredTransactions.length} giao dịch`
                      : `Showing ${filteredTransactions.length} transactions`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
