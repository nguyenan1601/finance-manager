import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { amountTone, amountToneBg } from "@/lib/ui";
import { useTranslation } from "@/hooks/use-translation";

interface TransactionItemProps {
  name: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  icon?: LucideIcon;
  className?: string;
}

export function TransactionItem({
  name,
  category,
  amount,
  type,
  date,
  icon: Icon,
  className,
}: TransactionItemProps) {
  const { t } = useTranslation();
  const isIncome = type === "income";

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 transition-colors hover:bg-muted/30 rounded-lg px-2 -mx-2",
        className,
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            amountToneBg(type),
          )}
        >
          {Icon ? (
            <Icon className="h-5 w-5" aria-hidden="true" />
          ) : isIncome ? (
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {category} • {date}
          </p>
        </div>
      </div>
      <div className="text-right ml-4 shrink-0">
        <p className={cn("text-sm font-bold", amountTone(type))}>
          <span className="sr-only">
            {isIncome ? t("common.income") : t("common.expense")}:{" "}
          </span>
          {amount}
        </p>
      </div>
    </div>
  );
}
