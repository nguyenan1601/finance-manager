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
import { Plus, Filter, Search, Download, Loader2 } from "lucide-react";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
// import { BillScanner } from "@/components/dashboard/bill-scanner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface Transaction {
  id: string;
  date: string;
  note?: string;
  name?: string;
  type: "income" | "expense";
  amount: number;
  categories?: {
    name: string;
  };
}

import { useTranslation } from "@/hooks/use-translation";
// import { BillScanner } from "@/components/dashboard/bill-scanner";

export default function TransactionsPage() {
  const { t, lang } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const filteredTransactions = transactions.filter(
    (t) =>
      t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

      // Chuẩn bị header cho CSV
      const headers = isVi
        ? ["Ngày", "Mô tả", "Danh mục", "Loại", "Số tiền (VND)"]
        : ["Date", "Description", "Category", "Type", "Amount"];

      const currencyFormat = isVi ? "vi-VN" : "en-US";

      // Chuyển đổi dữ liệu sang mảng các dòng
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

      // Tạo nội dung CSV
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Thêm BOM (Byte Order Mark) để Excel nhận diện UTF-8 (hiển thị đúng tiếng Việt)
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // Tạo link tải
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
            <h1 className="text-3xl font-bold tracking-tight">
              {t("common.transactions")}
            </h1>
            <p className="text-muted-foreground">
              {lang === "vi"
                ? "Theo dõi và quản lý toàn bộ các khoản thu chi của bạn."
                : "Track and manage all your income and expenses."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex rounded-lg"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("common.export")}
            </Button>
            {/* <BillScanner onSuccess={() => fetchTransactions()} /> */}
            <Button
              size="sm"
              className="rounded-lg shadow-lg shadow-primary/20"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("common.new")}
            </Button>
          </div>
        </div>

        <AddTransactionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAdd={() => fetchTransactions()}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  {t("common.filter")}
                </Button>
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
                <div className="overflow-x-auto">
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-10 text-muted-foreground"
                          >
                            {t("common.noTransactions")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((t) => (
                          <TableRow
                            key={t.id}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="text-muted-foreground font-medium">
                              {new Date(t.date).toLocaleDateString(
                                currencyFormat,
                              )}
                            </TableCell>
                            <TableCell className="font-bold">
                              {t.note ||
                                t.name ||
                                (lang === "vi"
                                  ? "Không có ghi chú"
                                  : "No note")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="font-medium bg-muted/50 border-none"
                              >
                                {t.categories?.name ||
                                  (lang === "vi" ? "Khác" : "Other")}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right font-bold text-md",
                                t.type === "income"
                                  ? "text-emerald-600"
                                  : "text-rose-600",
                              )}
                            >
                              {t.type === "income" ? "+" : "-"}
                              {Number(t.amount).toLocaleString(
                                currencyFormat,
                              )}{" "}
                              {currencySymbol}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
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
