import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardService } from './dashboard.service';
import { DashboardFinancialService } from './dashboard-financial.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  // * HELPER

  // Parse date
  private parseDate(date?: string): Date | undefined {
    return date ? new Date(date) : undefined;
  }

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardOrdersService: DashboardOrdersService,
    private readonly dashboardFinancialService: DashboardFinancialService,
  ) {}

  // * OVERVIEW ENDPOINTS

  // Overview
  @Get('overview')
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * ORDERS ENDPOINTS

  // Orders overview
  @Get('orders/overview')
  async getOrdersOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getOrdersOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // Orders per day
  @Get('orders/daily')
  async getOrdersPerDay(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const end = this.parseDate(endDate) ?? new Date();
    const start =
      this.parseDate(startDate) ??
      new Date(new Date().setDate(end.getDate() - 30));

    return this.dashboardOrdersService.getOrdersPerDay(start, end);
  }

  // Orders count by status
  @Get('orders/by-status')
  async getOrdersCountByStatus(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getOrdersCountByStatus(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * FINANCIAL ENDPOINTS

  // Financial overview
  @Get('financial/overview')
  async getFinancialOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardFinancialService.getFinancialOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // Average ticket
  @Get('financial/avg-ticket')
  async getAverageTicket(
    @Query('status') status?: CompleteOrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardFinancialService.getAverageTicket(
      status,
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // Total net revenue
  @Get('financial/net-revenue')
  async getTotalNetRevenue(
    @Query('status') status?: CompleteOrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (status) {
      return this.dashboardFinancialService.getTotalNetRevenueByStatus(
        status,
        start,
        end,
      );
    }
    return this.dashboardFinancialService.getTotalNetRevenue(start, end);
  }

  // Total gross revenue
  @Get('financial/gross-revenue')
  async getTotalGrossRevenue(
    @Query('status') status?: CompleteOrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (status) {
      return this.dashboardFinancialService.getTotalGrossRevenueByStatus(
        status,
        start,
        end,
      );
    }
    return this.dashboardFinancialService.getTotalGrossRevenue(start, end);
  }

  // Total discount
  @Get('financial/discount')
  async getTotalDiscount(
    @Query('status') status?: CompleteOrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (status) {
      return this.dashboardFinancialService.getTotalDiscountByStatus(
        status,
        start,
        end,
      );
    }
    return this.dashboardFinancialService.getTotalDiscount(start, end);
  }
}
