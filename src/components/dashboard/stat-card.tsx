import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
  variant?: "default" | "bright";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-none shadow-sm transition-all hover:shadow-md",
        variant === "bright" ? "bg-primary/10" : "bg-card",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <div
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center",
            variant === "bright"
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center mt-2">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium mr-2 px-1.5 py-0.5 rounded-full flex items-center",
                  trend.isUp
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700",
                )}
              >
                {trend.isUp ? "+" : "-"}
                {trend.value}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
