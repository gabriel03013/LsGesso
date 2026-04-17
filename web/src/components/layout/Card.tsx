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
    <Card
      className={cn(
        "@container/card group relative border-border/60 transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader>
        <CardDescription className="text-xs font-medium tracking-wide text-muted-foreground/80">
          {title}
        </CardDescription>
        <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xl">
          {formattedData}
        </CardTitle>
        {iconElement && (
          <CardAction>
            <div className="rounded-full bg-primary/8 p-2 text-primary/60 [&>svg]:size-3.5">
              {iconElement}
            </div>
          </CardAction>
        )}
      </CardHeader>

      <CardFooter className="gap-2 text-xs">
        {hasTrending && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
              isTrendingUp
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
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
          <span className="text-muted-foreground/60 line-clamp-2 leading-relaxed">
            {description}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
