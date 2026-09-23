export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const CHART_GRID = "var(--border)";
export const CHART_TICK = "var(--muted-foreground)";
export const CHART_CURSOR = "var(--muted)";
export const CHART_EXPENSE = "var(--danger)";
export const CHART_INCOME = "var(--success)";

export const chartAxisTick = { fill: CHART_TICK, fontSize: 12 } as const;

export const chartTooltipProps = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
  labelStyle: { color: "var(--popover-foreground)" },
} as const;

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
