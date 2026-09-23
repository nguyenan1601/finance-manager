import { format, subMonths, type Locale } from "date-fns";

export const TREND_MONTHS = 6;

export interface TransactionLike {
  amount: number | string;
  type: "income" | "expense";
  date: string;
  category_id?: string | null;
  note?: string | null;
  categories?: { name?: string | null; color?: string | null } | null;
}

export interface BudgetLike {
  amount: number;
  category_id: string;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactionCount: number;
}

export interface CashflowMonth {
  date: Date;
  name: string;
  income: number;
  expense: number;
}

export interface CashflowSummary {
  avgIncome: number;
  avgExpense: number;
  totalSavings: number;
  incomeTrend: number;
  expenseTrend: number;
}

export interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

export interface BudgetProgress {
  percent: number;
  progressWidth: number;
  isOver: boolean;
  isWarning: boolean;
}

function startOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/** Lifetime balance plus this-month income/expense/count. */
export function getDashboardStats(
  transactions: TransactionLike[],
  now: Date,
): DashboardStats {
  const firstDayOfMonth = startOfMonth(now);
  let totalBalance = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  let transactionCount = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      totalBalance += amount;
    } else {
      totalBalance -= amount;
    }

    if (new Date(transaction.date) >= firstDayOfMonth) {
      if (transaction.type === "income") {
        monthlyIncome += amount;
      } else {
        monthlyExpense += amount;
      }
      transactionCount += 1;
    }
  }

  return { totalBalance, monthlyIncome, monthlyExpense, transactionCount };
}

/** Oldest-first buckets for the last TREND_MONTHS months, split by income/expense. */
export function buildCashflowMonths(
  transactions: TransactionLike[],
  now: Date,
  locale: Locale,
): CashflowMonth[] {
  const months = Array.from({ length: TREND_MONTHS }, (_, index) => {
    const date = subMonths(now, index);
    return {
      date,
      name: format(date, "MMM", { locale }),
      income: 0,
      expense: 0,
    };
  }).reverse();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const amount = Number(transaction.amount);
    for (const month of months) {
      if (
        date.getMonth() === month.date.getMonth() &&
        date.getFullYear() === month.date.getFullYear()
      ) {
        if (transaction.type === "income") month.income += amount;
        else month.expense += amount;
      }
    }
  }

  return months;
}

/** Averages are taken over the months that actually have data (min 1). */
export function summarizeCashflow(months: CashflowMonth[]): CashflowSummary {
  const totalIncome = months.reduce((sum, month) => sum + month.income, 0);
  const totalExpense = months.reduce((sum, month) => sum + month.expense, 0);
  const count =
    months.filter((month) => month.income > 0 || month.expense > 0).length || 1;

  return {
    avgIncome: totalIncome / count,
    avgExpense: totalExpense / count,
    totalSavings: totalIncome - totalExpense,
    incomeTrend: 0,
    expenseTrend: 0,
  };
}

/** This-month expenses grouped by category name, with a palette fallback colour. */
export function getCategoryBreakdown(
  transactions: TransactionLike[],
  now: Date,
  otherLabel: string,
  palette: readonly string[],
): CategorySlice[] {
  const slices = new Map<string, CategorySlice>();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    if (
      transaction.type !== "expense" ||
      date.getMonth() !== now.getMonth() ||
      date.getFullYear() !== now.getFullYear()
    ) {
      continue;
    }

    const name = transaction.categories?.name || otherLabel;
    const existing = slices.get(name);
    if (existing) {
      existing.value += Number(transaction.amount);
      continue;
    }

    slices.set(name, {
      name,
      value: Number(transaction.amount),
      color:
        transaction.categories?.color ||
        palette[slices.size % palette.length],
    });
  }

  return Array.from(slices.values());
}

/** This-month spend per category_id, used to compare against budget limits. */
export function getMonthlyExpensesByCategory(
  transactions: TransactionLike[],
  now: Date,
): Record<string, number> {
  const firstDayOfMonth = startOfMonth(now);
  const expenses: Record<string, number> = {};

  for (const transaction of transactions) {
    if (
      transaction.type === "expense" &&
      new Date(transaction.date) >= firstDayOfMonth
    ) {
      const key = transaction.category_id as string;
      expenses[key] = (expenses[key] || 0) + Number(transaction.amount);
    }
  }

  return expenses;
}

export function getBudgetTotals(
  budgets: BudgetLike[],
  monthlyExpenses: Record<string, number>,
) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + (monthlyExpenses[budget.category_id] || 0),
    0,
  );

  return {
    totalBudgeted,
    totalSpent,
    remaining: Math.max(0, totalBudgeted - totalSpent),
  };
}

export function getBudgetProgress(
  spent: number,
  limit: number,
): BudgetProgress {
  const percent = Math.round((spent / limit) * 100);
  const isOver = spent > limit;

  return {
    percent,
    progressWidth: Math.min(percent, 100),
    isOver,
    isWarning: percent > 85 && !isOver,
  };
}
