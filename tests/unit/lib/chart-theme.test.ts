import { describe, expect, it } from "vitest";

import { CHART_COLORS, chartColor } from "@/lib/chart-theme";

describe("chartColor", () => {
  it("exposes five chart tokens in order", () => {
    expect(CHART_COLORS).toEqual([
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ]);
  });

  it("walks the palette and wraps around", () => {
    expect(chartColor(0)).toBe("var(--chart-1)");
    expect(chartColor(4)).toBe("var(--chart-5)");
    expect(chartColor(5)).toBe("var(--chart-1)");
    expect(chartColor(12)).toBe("var(--chart-3)");
  });
});
