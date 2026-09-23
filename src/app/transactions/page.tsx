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
import { CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Filter,
  Search,
  Download,
  Pencil,
  Trash2,
  Receipt,
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
import { PageHeader } from "@/components/common/page-header";
import { PageShell } from "@/components/common/page-shell";
import { Panel } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { ListSkeleton, TableSkeleton } from "@/components/common/skeletons";
import { amountTone } from "@/lib/ui";

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
      <PageShell>
        <PageHeader
          title={t("common.transactions")}
          description={
            lang === "vi"
              ? "Theo dõi và quản lý toàn bộ các khoản thu chi của bạn."
              : "Track and manage all your income and expenses."
          }
          actions={
            <>
              <div className="flex items-center gap-2 sm:hidden">
                <BillScanner onSuccess={fetchTransactions} />
                <Button
                  size="sm"
                  aria-label={t("common.new")}
                  className="h-9 rounded-lg shadow-lg shadow-primary/20"
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <BillScanner onSuccess={fetchTransactions} />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
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
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("common.new")}
                </Button>
              </div>
            </>
          }
        />

        <AddTransactionDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onAdd={() => fetchTransactions()}
          editData={editingTransaction}
        />

        <Panel>
          <CardHeader className="border-b bg-muted/5 pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  aria-label={t("common.searchPlaceholder")}
                  placeholder={t("common.searchPlaceholder")}
                  className="rounded-lg border-muted bg-background pl-10"
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
                      <Filter className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
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
              <>
                <div className="p-4 md:hidden">
                  <ListSkeleton rows={6} />
                </div>
                <div className="hidden p-4 md:block">
                  <TableSkeleton rows={6} cols={6} />
                </div>
              </>
            ) : filteredTransactions.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title={t("common.noTransactions")}
                description={
                  lang === "vi"
                    ? "Hãy thêm giao dịch mới hoặc điều chỉnh bộ lọc để xem dữ liệu."
                    : "Add a new transaction or adjust the filters to see data."
                }
                className="m-4"
              />
            ) : (
              <>
                {/* Mobile/Tablet List View */}
                <div className="divide-y divide-border md:hidden">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-bold leading-tight line-clamp-2">
                            {transaction.note ||
                              transaction.name ||
                              (lang === "vi"
                                ? "Không có ghi chú"
                                : "No note")}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium uppercase text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString(
                                currencyFormat,
                              )}
                            </span>
                            <Badge
                              variant="secondary"
                              className="h-4 border-none bg-muted/50 px-1.5 text-[10px] font-normal"
                            >
                              {transaction.categories?.name ||
                                (lang === "vi" ? "Khác" : "Other")}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={cn(
                              "text-sm font-bold",
                              amountTone(transaction.type),
                            )}
                          >
                            <span className="sr-only">
                              {transaction.type === "income"
                                ? t("common.income")
                                : t("common.expense")}
                              :{" "}
                            </span>
                            {transaction.type === "income" ? "+" : "-"}
                            {Number(transaction.amount).toLocaleString(
                              currencyFormat,
                            )}{" "}
                            {currencySymbol}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-3 text-muted-foreground transition-all hover:text-primary active:scale-95"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Pencil
                            className="mr-1.5 h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span className="text-xs">{t("common.edit")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-3 text-muted-foreground transition-all hover:text-destructive active:scale-95"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2
                            className="mr-1.5 h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span className="text-xs">{t("common.delete")}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="min-w-[100px] py-4 font-bold">
                          {t("common.date")}
                        </TableHead>
                        <TableHead className="min-w-[200px] font-bold">
                          {t("common.description")}
                        </TableHead>
                        <TableHead className="font-bold">
                          {t("common.category")}
                        </TableHead>
                        <TableHead className="text-right font-bold">
                          {t("common.amount")}
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          {t("common.status")}
                        </TableHead>
                        <TableHead className="w-[120px] text-center font-bold">
                          {lang === "vi" ? "Thao tác" : "Actions"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <TableCell className="font-medium text-muted-foreground">
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
                              className="border-none bg-muted/50 font-medium"
                            >
                              {transaction.categories?.name ||
                                (lang === "vi" ? "Khác" : "Other")}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right text-base font-bold",
                              amountTone(transaction.type),
                            )}
                          >
                            <span className="sr-only">
                              {transaction.type === "income"
                                ? t("common.income")
                                : t("common.expense")}
                              :{" "}
                            </span>
                            {transaction.type === "income" ? "+" : "-"}
                            {Number(transaction.amount).toLocaleString(
                              currencyFormat,
                            )}{" "}
                            {currencySymbol}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full bg-success ring-2 ring-success/20"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                {lang === "vi" ? "Hoàn thành" : "Completed"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={lang === "vi" ? "Chỉnh sửa" : "Edit"}
                                title={lang === "vi" ? "Chỉnh sửa" : "Edit"}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Pencil
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={lang === "vi" ? "Xóa" : "Delete"}
                                title={lang === "vi" ? "Xóa" : "Delete"}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="border-t p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    {lang === "vi"
                      ? `Hiển thị ${filteredTransactions.length} giao dịch`
                      : `Showing ${filteredTransactions.length} transactions`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Panel>
      </PageShell>
    </DashboardLayout>
  );
}
