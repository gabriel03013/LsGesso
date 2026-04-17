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
    <Card
      className={cn(
        "@container/card border-border/60 transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-4 sm:px-5">
        {children}
      </CardContent>
    </Card>
  );
}
