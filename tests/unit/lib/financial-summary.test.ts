import { describe, expect, it } from "vitest";

import { buildFinancialSummary } from "@/lib/financial-summary";

const transactions = [
  {
    date: "2026-03-10",
    type: "income" as const,
    amount: 1_000_000,
    note: "salary",
    categories: { name: "Lương" },
  },
  {
    date: "2026-03-12",
    type: "expense" as const,
    amount: 300_000,
    note: "lunch",
    categories: { name: "Ăn uống" },
  },
];

describe("buildFinancialSummary", () => {
  it("explains an empty ledger in both languages", () => {
    expect(buildFinancialSummary([], "vi")).toBe(
      "Người dùng chưa có giao dịch nào.",
    );
    expect(buildFinancialSummary([], "en")).toBe(
      "User has no transactions yet.",
    );
  });

  it("produces a Vietnamese briefing with the header, totals and categories", () => {
    const summary = buildFinancialSummary(transactions, "vi");

    expect(summary).toContain("TỔNG QUAN TÀI CHÍNH:");
    expect(summary).toContain("CHI TIÊU THEO DANH MỤC:");
    expect(summary).toContain("- Số giao dịch: 2");
    expect(summary).toContain((1_000_000).toLocaleString("vi-VN"));
    expect(summary).toContain((300_000).toLocaleString("vi-VN"));
    expect(summary).toContain("- Ăn uống:");
  });

  it("produces an English briefing for lang=en", () => {
    const summary = buildFinancialSummary(transactions, "en");

    expect(summary).toContain("FINANCIAL OVERVIEW:");
    expect(summary).toContain("EXPENSES BY CATEGORY:");
    expect(summary).toContain("- Number of Transactions: 2");
    // Category labels come from the data, so they are not translated.
    expect(summary).not.toContain("Food");
    expect(summary).toContain("- Ăn uống:");
  });

  it("sorts the category breakdown by amount descending", () => {
    const summary = buildFinancialSummary(
      [
        { date: "2026-03-01", type: "expense", amount: 100, categories: { name: "Small" } },
        { date: "2026-03-02", type: "expense", amount: 900, categories: { name: "Big" } },
      ],
      "en",
    );

    expect(summary.indexOf("- Big:")).toBeLessThan(summary.indexOf("- Small:"));
  });

  it("caps the recent list at 15 entries", () => {
    const many = Array.from({ length: 20 }, (_, index) => ({
      date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      type: "expense" as const,
      amount: 1_000,
      note: `#${index}`,
      categories: { name: "Khác" },
    }));

    const summary = buildFinancialSummary(many, "vi");
    expect(summary).toContain("GIAO DỊCH GẦN ĐÂY (15 gần nhất):");
  });
});
