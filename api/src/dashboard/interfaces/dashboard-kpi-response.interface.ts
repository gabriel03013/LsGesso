import { KpiCategory } from '../enums/kpi-category.enum';
import { KpiIcon } from '../enums/kpi-icon.enum';

export interface IResponseDashboardKPIs {
  title: string;
  description: string;
  data: string;
  type: 'money' | 'number' | 'percentage';
  icon: KpiIcon;
  category: KpiCategory;
  isTrendingUp?: boolean;
  trendingPercentage?: number;
}
