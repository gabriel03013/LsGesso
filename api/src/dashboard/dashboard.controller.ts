import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardService } from './dashboard.service';
import { DashboardFinancialService } from './dashboard-financial.service';
import { DashboardProductsService } from './dashboard-products.service';
import {
  KpiCardDto,
  FinancialOverviewDto,
  OrdersByStatusItemDto,
  OrdersPerDayItemDto,
  OrdersMonthlyTrendItemDto,
  TopEmployeeItemDto,
  RoomsPerOrderItemDto,
  DiscountImpactItemDto,
  MonthlyGrossVsNetItemDto,
  TopSellingProductItemDto,
  RevenueByProductTypeItemDto,
  OrdersChartsDto,
  FinancialChartsDto,
  ProductsChartsDto,
  DashboardAllDto,
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
    private readonly dashboardProductsService: DashboardProductsService,
  ) {}

  // * ALL (KPIs + all charts — single mega request)

  @Get('all')
  @ApiOperation({ summary: 'Tudo: KPIs + gráficos de pedidos + financeiro + produtos em uma request' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Data início (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Data fim (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Dashboard completo', type: DashboardAllDto })
  async getAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getAll(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * OVERVIEW (KPIs — single request for all cards)

  @Get('overview')
  @ApiOperation({ summary: 'KPIs do dashboard (pedidos + financeiro + descontos + cômodos)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Data início (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Data fim (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'KPI cards flat array', type: [KpiCardDto] })
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getOverview(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * GROUPED CHARTS (one request per tab)

  @Get('orders/charts')
  @ApiOperation({ summary: 'Todos os gráficos da aba Pedidos (tendência mensal, ranking funcionários, cômodos, status)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Gráficos de pedidos', type: OrdersChartsDto })
  async getOrdersCharts(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getOrdersCharts(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('financial/charts')
  @ApiOperation({ summary: 'Todos os gráficos da aba Financeiro (desconto impact, bruto vs líquido, overview)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Gráficos financeiros', type: FinancialChartsDto })
  async getFinancialCharts(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getFinancialCharts(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('products/charts')
  @ApiOperation({ summary: 'Todos os gráficos da aba Produtos (mais vendidos, receita por categoria)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Gráficos de produtos', type: ProductsChartsDto })
  async getProductsCharts(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getProductsCharts(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * INDIVIDUAL ENDPOINTS (kept for flexibility)

  @Get('orders/overview')
  @ApiOperation({ summary: 'Resumo de pedidos (total, pagos, pendentes, cancelados)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Resumo de pedidos (cada campo é um KPI card)' })
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

  @Get('orders/monthly-trend')
  @ApiOperation({ summary: 'Tendência mensal: quantidade de pedidos + receita líquida por mês' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Pedidos e receita por mês', type: [OrdersMonthlyTrendItemDto] })
  async getOrdersMonthlyTrend(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getOrdersMonthlyTrend(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('orders/top-employees')
  @ApiOperation({ summary: 'Ranking de funcionários por receita gerada' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de resultados (padrão 10)' })
  @ApiResponse({ status: 200, description: 'Ranking de funcionários', type: [TopEmployeeItemDto] })
  async getTopEmployeesByRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardOrdersService.getTopEmployeesByRevenue(
      this.parseDate(startDate),
      this.parseDate(endDate),
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('orders/rooms-per-order')
  @ApiOperation({ summary: 'Distribuição de cômodos por pedido (quantos pedidos têm 1, 2, 3+ cômodos)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Distribuição de cômodos', type: [RoomsPerOrderItemDto] })
  async getAverageRoomsPerOrder(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardOrdersService.getAverageRoomsPerOrder(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * FINANCIAL CHARTS

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

  @Get('financial/discount-impact')
  @ApiOperation({ summary: 'Impacto dos descontos: pedidos com vs sem desconto (quantidade, ticket médio, receita)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Comparação com/sem desconto', type: [DiscountImpactItemDto] })
  async getDiscountImpact(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardFinancialService.getDiscountImpact(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  @Get('financial/monthly-gross-vs-net')
  @ApiOperation({ summary: 'Receita bruta vs líquida vs descontos por mês' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Bruto vs líquido vs desconto mensal', type: [MonthlyGrossVsNetItemDto] })
  async getMonthlyGrossVsNet(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardFinancialService.getMonthlyGrossVsNet(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }

  // * PRODUCTS CHARTS

  @Get('products/top-selling')
  @ApiOperation({ summary: 'Ranking dos produtos mais vendidos por quantidade' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de resultados (padrão 10)' })
  @ApiResponse({ status: 200, description: 'Produtos mais vendidos', type: [TopSellingProductItemDto] })
  async getTopSellingProducts(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardProductsService.getTopSellingProducts(
      this.parseDate(startDate),
      this.parseDate(endDate),
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('products/revenue-by-type')
  @ApiOperation({ summary: 'Receita agrupada por categoria de produto (placa, forro, moldura, etc.)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receita por tipo de produto', type: [RevenueByProductTypeItemDto] })
  async getRevenueByProductType(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardProductsService.getRevenueByProductType(
      this.parseDate(startDate),
      this.parseDate(endDate),
    );
  }
}
