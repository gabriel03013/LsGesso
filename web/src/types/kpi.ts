export type KPI = {
  title: string;
  data: string;
  category: "financial" | "order" | "product";
  description?: string;
  icon?: string;
  type: "money" | "number" | "percentage";
  isTrendingUp?: boolean;
  trendingPercentage?: number;
};
