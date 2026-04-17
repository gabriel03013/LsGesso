import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardAction,
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
  const hasTrending =
    isTrendingUp !== undefined && trendingPercentage !== undefined;

  return (
    <Card className={cn("@container/card py-5", className)}>
      <CardHeader className="gap-2 px-5">
        <CardDescription className="flex items-center gap-2">
          {iconElement && (
            <div className="rounded-lg bg-muted p-1.5 text-muted-foreground [&>svg]:size-4">
              {iconElement}
            </div>
          )}
          {title}
        </CardDescription>
        <CardTitle className="text-[26px] tabular-nums">
          {formattedData}
        </CardTitle>
      </CardHeader>

      {(description || hasTrending) && (
        <CardFooter className="gap-2 px-5 text-sm text-muted-foreground">
          {hasTrending && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                isTrendingUp ? "text-success" : "text-destructive"
              )}
            >
              {isTrendingUp ? (
                <IconTrendingUp className="size-3.5" />
              ) : (
                <IconTrendingDown className="size-3.5" />
              )}
              {trendingPercentage}%
            </span>
          )}
          {description && (
            <span className="line-clamp-2">{description}</span>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
