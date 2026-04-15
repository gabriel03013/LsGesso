import { IconCurrencyDollar, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import { getKpiIcon } from "@/lib/kpi-icon-helper";

interface DashboardCardProps {
  title: string,
  data: string,
  type: "money" | "number" | "percentage",
  description?: string,
  icon?: string,
  isTrendingUp?: boolean,
  trendingPercentage?: number,
}


export function DashboardCard({ title, data, type, description, icon, isTrendingUp, trendingPercentage }: DashboardCardProps) {
  if(type === "money") {
    data = formatCurrency(+data);
  } else if(type === "percentage") {
    data = `${data}%`;
  } else {
    data = data.toString();
  }
  const iconElement = getKpiIcon(icon || "");

  return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex gap-2 items-center">{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data}
          </CardTitle>
          
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {description}
          </div>
        </CardFooter>
      </Card>
  );
}
