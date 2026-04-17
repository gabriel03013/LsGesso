import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ChartCardProps = {
  chart: {
    title: string;
    description: string;
  };
  children: ReactNode;
  className?: string;
};

export default function ChartCard({
  chart: { title, description },
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("@container/card py-5", className)}>
      <CardHeader className="gap-1 px-5 pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-4 pb-2">
        {children}
      </CardContent>
    </Card>
  );
}
