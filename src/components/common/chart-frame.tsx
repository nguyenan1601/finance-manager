"use client";

import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import { useElementSize } from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";

/**
 * Recharts' own ResponsiveContainer starts at initialDimension {-1, -1} and logs
 * "The width(-1) and height(-1) of chart should be greater than 0" before its
 * first measurement. Measuring here and passing numbers instead means
 * calculateChartDimensions never sees a non-positive size, so the warning is gone
 * and the chart mounts only once the parent actually has room.
 */
export function ResponsiveChart({
  children,
  className,
}: {
  children: ReactElement;
  className?: string;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const ready = size !== null && size.width > 0 && size.height > 0;

  return (
    <div ref={ref} className={cn("h-full w-full", className)}>
      {ready ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
