import { IResponseDashboardKPIs } from './dashboard-kpi-response.interface';

export interface IDashboardOrdersResponse {
  total: IResponseDashboardKPIs;
  paid: IResponseDashboardKPIs;
  pending: IResponseDashboardKPIs;
  cancelled: IResponseDashboardKPIs;
  budget: IResponseDashboardKPIs;
  maintenance: IResponseDashboardKPIs;
  completed: IResponseDashboardKPIs;
}
