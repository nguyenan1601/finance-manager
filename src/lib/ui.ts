export type AmountType = "income" | "expense";

export function amountTone(type: AmountType): string {
  return type === "income" ? "text-success" : "text-danger";
}

export function amountToneBg(type: AmountType): string {
  return type === "income"
    ? "bg-success-muted text-success"
    : "bg-danger-muted text-danger";
}

export function categoryColor(
  color?: string | null,
  fallback = "var(--chart-1)",
): string {
  return color || fallback;
}
