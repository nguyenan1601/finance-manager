export interface SummaryTransaction {
  date: string;
  type: "income" | "expense";
  amount: number | string;
  note?: string | null;
  categories?: { name?: string | null } | null;
}

/** Compact financial briefing handed to the advisor model as system context. */
export function buildFinancialSummary(
  transactions: SummaryTransaction[],
  lang: string,
): string {
  const isVi = lang === "vi";
  if (!transactions || transactions.length === 0) {
    return isVi
      ? "Người dùng chưa có giao dịch nào."
      : "User has no transactions yet.";
  }

  const currencyFormat = isVi ? "vi-VN" : "en-US";
  const currencySymbol = isVi ? "đ" : "$";

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Group expenses by category
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.categories?.name || (isVi ? "Khác" : "Other");
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(t.amount);
    });

  const categoryBreakdown = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(
      ([cat, amt]) =>
        `  - ${cat}: ${amt.toLocaleString(currencyFormat)}${currencySymbol}`,
    )
    .join("\n");

  const recentList = transactions
    .slice(0, 15)
    .map(
      (t) =>
        `  - ${t.date}: ${t.type === "income" ? (isVi ? "Thu" : "In") : isVi ? "Chi" : "Ex"} ${Number(t.amount).toLocaleString(currencyFormat)}${currencySymbol} - ${t.categories?.name || (isVi ? "Khác" : "Other")} (${t.note || (isVi ? "không ghi chú" : "no note")})`,
    )
    .join("\n");

  if (isVi) {
    return [
      `TỔNG QUAN TÀI CHÍNH:`,
      `- Tổng thu nhập: ${totalIncome.toLocaleString("vi-VN")}đ`,
      `- Tổng chi tiêu: ${totalExpense.toLocaleString("vi-VN")}đ`,
      `- Số dư hiện tại: ${balance.toLocaleString("vi-VN")}đ`,
      `- Số giao dịch: ${transactions.length}`,
      ``,
      `CHI TIÊU THEO DANH MỤC:`,
      categoryBreakdown,
      ``,
      `GIAO DỊCH GẦN ĐÂY (${Math.min(15, transactions.length)} gần nhất):`,
      recentList,
    ].join("\n");
  }

  return [
    `FINANCIAL OVERVIEW:`,
    `- Total Income: ${totalIncome.toLocaleString("en-US")}$`,
    `- Total Expenses: ${totalExpense.toLocaleString("en-US")}$`,
    `- Current Balance: ${balance.toLocaleString("en-US")}$`,
    `- Number of Transactions: ${transactions.length}`,
    ``,
    `EXPENSES BY CATEGORY:`,
    categoryBreakdown,
    ``,
    `RECENT TRANSACTIONS (Last ${Math.min(15, transactions.length)}):`,
    recentList,
  ].join("\n");
}
