import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardService } from './dashboard.service';
import { DashboardFinancialService } from './dashboard-financial.service';
import {
  DashboardOverviewDto,
  OrdersOverviewDto,
  FinancialOverviewDto,
  OrdersByStatusItemDto,
  OrdersPerDayItemDto,
} from './dto/dashboard-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  private parseDate(date?: string): Date | undefined {
    return date ? new Date(date) : undefined;
  }

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardOrdersService: DashboardOrdersService,
    private readonly dashboardFinancialService: DashboardFinancialService,
  ) {}

  // * OVERVIEW

  @Get('overview')
  @ApiOperation({ summary: 'Visão geral do dashboard (pedidos + financeiro)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Data início (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Data fim (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Overview completo', type: DashboardOverviewDto })
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * ORDERS

  @Get('orders/overview')
  @ApiOperation({ summary: 'Resumo de pedidos (total, pagos, pendentes, cancelados)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Resumo de pedidos', type: OrdersOverviewDto })
  async getOrdersOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getOrdersOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('orders/daily')
  @ApiOperation({ summary: 'Pedidos por dia (últimos 30 dias por padrão)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Pedidos agrupados por dia', type: [OrdersPerDayItemDto] })
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

  @Get('orders/by-status')
  @ApiOperation({ summary: 'Contagem de pedidos agrupados por status' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Contagem por status', type: [OrdersByStatusItemDto] })
  async getOrdersCountByStatus(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getOrdersCountByStatus(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * FINANCIAL

  @Get('financial/overview')
  @ApiOperation({ summary: 'Visão geral financeira (receita líquida, bruta, desconto, receita paga)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Overview financeiro', type: FinancialOverviewDto })
  async getFinancialOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardFinancialService.getFinancialOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('financial/avg-ticket')
  @ApiOperation({ summary: 'Ticket médio por status' })
  @ApiQuery({ name: 'status', required: false, enum: CompleteOrderStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Ticket médio', type: Number })
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

  @Get('financial/net-revenue')
  @ApiOperation({ summary: 'Receita líquida total (opcionalmente por status)' })
  @ApiQuery({ name: 'status', required: false, enum: CompleteOrderStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receita líquida', type: Number })
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

  @Get('financial/gross-revenue')
  @ApiOperation({ summary: 'Receita bruta total (opcionalmente por status)' })
  @ApiQuery({ name: 'status', required: false, enum: CompleteOrderStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receita bruta', type: Number })
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

  @Get('financial/discount')
  @ApiOperation({ summary: 'Total de descontos (opcionalmente por status)' })
  @ApiQuery({ name: 'status', required: false, enum: CompleteOrderStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Total de descontos', type: Number })
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
