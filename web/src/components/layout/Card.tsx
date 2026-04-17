import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { getKpiIcon } from "@/lib/kpi-icon-helper";

interface DashboardCardProps {
  title: string;
  data: string;
  type: "money" | "number" | "percentage";
  description?: string;
  icon?: string;
  isTrendingUp?: boolean;
  trendingPercentage?: number;
  className?: string;
}

export function DashboardCard({
  title,
  data,
  type,
  description,
  icon,
  isTrendingUp,
  trendingPercentage,
  className,
}: DashboardCardProps) {
  let formattedData = data;
  if (type === "money") {
    formattedData = formatCurrency(+data);
  } else if (type === "percentage") {
    formattedData = `${data}%`;
  }

  const iconElement = icon ? getKpiIcon(icon) : null;
  const hasTrending = isTrendingUp !== undefined && trendingPercentage !== undefined;

  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <CardDescription className="text-xs font-medium uppercase tracking-widest">
            {title}
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {formattedData}
          </CardTitle>
        </div>
        {iconElement && (
          <div className="rounded-md bg-primary/10 p-2 text-primary shrink-0 [&>svg]:size-4">
            {iconElement}
          </div>
        )}
      </CardHeader>

      {(description || hasTrending) && (
        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground">
          {hasTrending && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                isTrendingUp ? "text-success" : "text-destructive"
              )}
            >
              {isTrendingUp ? (
                <IconTrendingUp className="size-3" />
              ) : (
                <IconTrendingDown className="size-3" />
              )}
              {trendingPercentage}%
            </span>
          )}
          {description && (
            <span className="line-clamp-1">{description}</span>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
