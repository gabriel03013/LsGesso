import { Injectable } from '@nestjs/common';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardFinancialService } from './dashboard-financial.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly orders: DashboardOrdersService,
    private readonly financial: DashboardFinancialService,
  ) {}

  async getOverview(startDate?: Date, endDate?: Date) {
    const [orders, financial] = await Promise.all([
      this.orders.getOrdersOverview(startDate, endDate),
      this.financial.getFinancialOverview(startDate, endDate),
    ]);

    return {
      orders,
      financial,
    };
  }
}
