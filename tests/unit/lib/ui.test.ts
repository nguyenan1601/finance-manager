import { describe, expect, it } from "vitest";

import { amountTone, amountToneBg, categoryColor } from "@/lib/ui";

describe("amountTone", () => {
  it("maps income to the success token and expense to the danger token", () => {
    expect(amountTone("income")).toBe("text-success");
    expect(amountTone("expense")).toBe("text-danger");
  });
});

describe("amountToneBg", () => {
  it("returns a token-backed background + foreground pair", () => {
    expect(amountToneBg("income")).toBe("bg-success-muted text-success");
    expect(amountToneBg("expense")).toBe("bg-danger-muted text-danger");
  });
});

describe("categoryColor", () => {
  it("keeps a category colour when present", () => {
    expect(categoryColor("#ff0000")).toBe("#ff0000");
  });

  it("falls back to the chart-1 token for missing colours", () => {
    expect(categoryColor(null)).toBe("var(--chart-1)");
    expect(categoryColor(undefined)).toBe("var(--chart-1)");
    expect(categoryColor("")).toBe("var(--chart-1)");
  });

  it("accepts a custom fallback", () => {
    expect(categoryColor(undefined, "var(--muted-foreground)")).toBe(
      "var(--muted-foreground)",
    );
  });
});
