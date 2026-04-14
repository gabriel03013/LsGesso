import { IResponseDashboardKPIs } from './dashboard-kpi-response.interface';

export interface IDashboardFinancialResponse {
  totalNetRevenue: IResponseDashboardKPIs;
  totalGrossRevenue: IResponseDashboardKPIs;
  totalDiscount: IResponseDashboardKPIs;
  paidNetRevenue: IResponseDashboardKPIs;
}
