import { enUS } from "date-fns/locale";
import { describe, expect, it } from "vitest";

import {
  buildCashflowMonths,
  getBudgetProgress,
  getBudgetTotals,
  getCategoryBreakdown,
  getDashboardStats,
  getMonthlyExpensesByCategory,
  summarizeCashflow,
  TREND_MONTHS,
  type TransactionLike,
} from "@/lib/analytics";

// Mid-month dates keep these assertions independent of the machine timezone.
const NOW = new Date(2026, 2, 15); // 15 Mar 2026

const PALETTE = ["c0", "c1", "c2"] as const;

function tx(partial: Partial<TransactionLike> & { amount: number }): TransactionLike {
  return {
    type: "expense",
    date: "2026-03-10",
    ...partial,
  } as TransactionLike;
}

describe("getDashboardStats", () => {
  const transactions: TransactionLike[] = [
    tx({ amount: 1_000_000, type: "income", date: "2026-03-10" }),
    tx({ amount: 300_000, date: "2026-03-12" }),
    tx({ amount: 200_000, date: "2026-02-20" }),
    tx({ amount: 500_000, type: "income", date: "2025-12-05" }),
  ];

  it("computes lifetime balance across every transaction", () => {
    expect(getDashboardStats(transactions, NOW).totalBalance).toBe(1_000_000);
  });

  it("only counts the current month for monthly figures and count", () => {
    const stats = getDashboardStats(transactions, NOW);
    expect(stats.monthlyIncome).toBe(1_000_000);
    expect(stats.monthlyExpense).toBe(300_000);
    expect(stats.transactionCount).toBe(2);
  });

  it("handles an empty list", () => {
    expect(getDashboardStats([], NOW)).toEqual({
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      transactionCount: 0,
    });
  });
});

describe("buildCashflowMonths", () => {
  const transactions: TransactionLike[] = [
    tx({ amount: 1_000_000, type: "income", date: "2026-03-10" }),
    tx({ amount: 300_000, date: "2026-03-12" }),
    tx({ amount: 200_000, date: "2026-02-20" }),
    tx({ amount: 500_000, type: "income", date: "2025-12-05" }),
  ];

  it("returns TREND_MONTHS buckets, oldest first", () => {
    const months = buildCashflowMonths(transactions, NOW, enUS);
    expect(months).toHaveLength(TREND_MONTHS);
    expect(months.map((m) => m.name)).toEqual([
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ]);
  });

  it("buckets income and expense into the right month", () => {
    const months = buildCashflowMonths(transactions, NOW, enUS);
    expect(months.at(-1)).toMatchObject({ income: 1_000_000, expense: 300_000 });
    expect(months.at(-2)).toMatchObject({ income: 0, expense: 200_000 });
    expect(months.at(2)).toMatchObject({ income: 500_000, expense: 0 });
  });

  it("ignores transactions outside the window", () => {
    const months = buildCashflowMonths(
      [tx({ amount: 999, type: "income", date: "2024-01-10" })],
      NOW,
      enUS,
    );
    expect(months.every((m) => m.income === 0 && m.expense === 0)).toBe(true);
  });
});

describe("summarizeCashflow", () => {
  it("averages over the months that have data (minimum 1)", () => {
    const months = buildCashflowMonths(
      [
        tx({ amount: 1_000_000, type: "income", date: "2026-03-10" }),
        tx({ amount: 300_000, date: "2026-03-12" }),
        tx({ amount: 200_000, date: "2026-02-20" }),
        tx({ amount: 500_000, type: "income", date: "2025-12-05" }),
      ],
      NOW,
      enUS,
    );
    const summary = summarizeCashflow(months);

    expect(summary.totalSavings).toBe(1_000_000);
    expect(summary.avgIncome).toBeCloseTo(1_500_000 / 3);
    expect(summary.avgExpense).toBeCloseTo(500_000 / 3);
  });

  it("divides by 1 when no month has data", () => {
    const summary = summarizeCashflow(buildCashflowMonths([], NOW, enUS));
    expect(summary.avgIncome).toBe(0);
    expect(summary.avgExpense).toBe(0);
    expect(summary.totalSavings).toBe(0);
  });
});

describe("getCategoryBreakdown", () => {
  it("groups current-month expenses by category name, keeping order of first appearance", () => {
    const slices = getCategoryBreakdown(
      [
        tx({
          amount: 300_000,
          date: "2026-03-12",
          categories: { name: "Ăn uống", color: "#f97316" },
        }),
        tx({ amount: 100_000, date: "2026-03-14" }), // no category -> other + palette
        tx({
          amount: 50_000,
          date: "2026-03-15",
          categories: { name: "Ăn uống", color: "#f97316" },
        }),
        tx({ amount: 999_000, date: "2026-02-20" }), // previous month, excluded
        tx({ amount: 999_000, type: "income", date: "2026-03-11" }), // income, excluded
      ],
      NOW,
      "Khác",
      PALETTE,
    );

    expect(slices).toEqual([
      { name: "Ăn uống", value: 350_000, color: "#f97316" },
      { name: "Khác", value: 100_000, color: "c1" },
    ]);
  });

  it("falls back to the first palette colour when nothing was seen yet", () => {
    const slices = getCategoryBreakdown(
      [tx({ amount: 1, date: "2026-03-14" })],
      NOW,
      "Other",
      PALETTE,
    );
    expect(slices[0].color).toBe("c0");
  });
});

describe("getMonthlyExpensesByCategory", () => {
  it("sums only this month's expenses, keyed by category_id", () => {
    const expenses = getMonthlyExpensesByCategory(
      [
        tx({ amount: 100_000, date: "2026-03-05", category_id: "food" }),
        tx({ amount: 50_000, date: "2026-03-20", category_id: "food" }),
        tx({ amount: 70_000, date: "2026-03-20", category_id: "travel" }),
        tx({ amount: 9_999, date: "2026-02-20", category_id: "food" }),
        tx({ amount: 9_999, type: "income", date: "2026-03-20", category_id: "food" }),
      ],
      NOW,
    );

    expect(expenses).toEqual({ food: 150_000, travel: 70_000 });
  });
});

describe("getBudgetTotals", () => {
  it("sums limits, spend and clamps remaining at zero", () => {
    const totals = getBudgetTotals(
      [
        { amount: 1_000_000, category_id: "food" },
        { amount: 500_000, category_id: "travel" },
      ],
      { food: 1_200_000, travel: 100_000 },
    );

    expect(totals.totalBudgeted).toBe(1_500_000);
    expect(totals.totalSpent).toBe(1_300_000);
    expect(totals.remaining).toBe(200_000);
  });

  it("returns 0 remaining when overspent", () => {
    const totals = getBudgetTotals(
      [{ amount: 100, category_id: "food" }],
      { food: 5_000 },
    );
    expect(totals.remaining).toBe(0);
  });
});

describe("getBudgetProgress", () => {
  it("computes percent and a capped bar width", () => {
    expect(getBudgetProgress(50, 100)).toEqual({
      percent: 50,
      progressWidth: 50,
      isOver: false,
      isWarning: false,
    });
  });

  it("flags warning above 85% but not at exactly 85%", () => {
    expect(getBudgetProgress(85, 100).isWarning).toBe(false);
    expect(getBudgetProgress(86, 100).isWarning).toBe(true);
  });

  it("treats exactly 100% as a warning, not over-limit", () => {
    expect(getBudgetProgress(100, 100)).toMatchObject({
      isOver: false,
      isWarning: true,
    });
  });

  it("caps the bar at 100% when over limit", () => {
    expect(getBudgetProgress(250, 100)).toEqual({
      percent: 250,
      progressWidth: 100,
      isOver: true,
      isWarning: false,
    });
  });
});
