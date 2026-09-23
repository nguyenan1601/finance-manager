import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={className}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <LoadingRegion
      label="Đang tải số liệu..."
      className={cn("rounded-xl bg-card p-4 shadow-sm sm:p-6", className)}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-7 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </LoadingRegion>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <LoadingRegion
      label="Đang tải biểu đồ..."
      className={cn("flex h-full items-end gap-3", className)}
    >
      {[40, 65, 50, 80, 60, 75].map((height, index) => (
        <Skeleton
          key={index}
          className="flex-1 rounded-t-md"
          style={{ height: `${height}%` }}
        />
      ))}
    </LoadingRegion>
  );
}

export function ListSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <LoadingRegion label="Đang tải dữ liệu..." className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16 shrink-0" />
        </div>
      ))}
    </LoadingRegion>
  );
}

export function TableSkeleton({
  rows = 6,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <LoadingRegion label="Đang tải dữ liệu..." className={cn("space-y-3 p-4", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-4", colIndex === 0 ? "w-1/3" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </LoadingRegion>
  );
}
