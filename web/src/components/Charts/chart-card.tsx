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
    <Card className={cn("@container/card overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 pb-4 sm:px-6">
        {children}
      </CardContent>
    </Card>
  );
}
