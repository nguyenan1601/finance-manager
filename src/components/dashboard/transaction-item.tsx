import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isIncome = type === "income";

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 transition-colors hover:bg-muted/30 rounded-lg px-2 -mx-2",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
            isIncome
              ? "bg-emerald-100 text-emerald-600"
              : "bg-rose-100 text-rose-600",
          )}
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : isIncome ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : (
            <ArrowDownRight className="h-5 w-5" />
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
        <p
          className={cn(
            "text-sm font-bold",
            isIncome ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {amount}
        </p>
      </div>
    </div>
  );
}
