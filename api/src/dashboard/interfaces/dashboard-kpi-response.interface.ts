export interface IResponseDashboardKPIs {
  title: string;
  description: string;
  data: string;
  type: 'money' | 'number' | 'percentage';
  icon: string; // TODO: change to available icons enum
  isTrendingUp?: boolean;
  trendingPercentage?: number;
}
