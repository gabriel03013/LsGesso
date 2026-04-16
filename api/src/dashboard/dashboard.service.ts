import { Injectable } from '@nestjs/common';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardFinancialService } from './dashboard-financial.service';
import { DashboardProductsService } from './dashboard-products.service';
import { ChartType } from './enums/chart-type.enum';
import { IResponseDashboardKPIs } from './interfaces/dashboard-kpi-response.interface';
import {
  OrdersChartsDto,
  FinancialChartsDto,
  ProductsChartsDto,
  DashboardAllDto,
} from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly orders: DashboardOrdersService,
    private readonly financial: DashboardFinancialService,
    private readonly products: DashboardProductsService,
  ) {}

  // KPI cards — flat array, frontend just does data.map(kpi => <Card {...kpi} />)
  async getOverview(startDate?: Date, endDate?: Date): Promise<IResponseDashboardKPIs[]> {
    const [ordersKpis, financialKpis] = await Promise.all([
      this.orders.getOrdersOverview(startDate, endDate),
      this.financial.getFinancialOverview(startDate, endDate),
    ]);

    return [
      ...Object.values(financialKpis),
      ...Object.values(ordersKpis),
    ];
  }

  // All charts for the "Orders" tab
  async getOrdersCharts(startDate?: Date, endDate?: Date): Promise<OrdersChartsDto> {
    const [monthlyTrend, topEmployees, roomsPerOrder, byStatus] =
      await Promise.all([
        this.orders.getOrdersMonthlyTrend(startDate, endDate),
        this.orders.getTopEmployeesByRevenue(startDate, endDate, 10),
        this.orders.getAverageRoomsPerOrder(startDate, endDate),
        this.orders.getOrdersCountByStatus(startDate, endDate),
      ]);

    return {
      monthlyTrend: {
        title: 'Tendência Mensal',
        description: 'Evolução de pedidos e receita ao longo dos meses',
        chartType: ChartType.AREA,
        xKey: 'month',
        series: [
          { dataKey: 'orders_count', label: 'Qtd. Pedidos', color: 'var(--chart-1)' },
          { dataKey: 'net_revenue', label: 'Receita Líquida', color: 'var(--chart-2)' },
        ],
        data: monthlyTrend,
      },
      topEmployees: {
        title: 'Top Funcionários por Receita',
        description: 'Ranking dos funcionários que mais geraram receita',
        chartType: ChartType.BAR,
        xKey: 'name',
        series: [
          { dataKey: 'total_revenue', label: 'Receita', color: 'var(--chart-1)' },
          { dataKey: 'orders_count', label: 'Pedidos', color: 'var(--chart-2)' },
        ],
        data: topEmployees,
      },
      roomsPerOrder: {
        title: 'Cômodos por Pedido',
        description: 'Quantos pedidos têm 1, 2, 3 ou mais cômodos',
        chartType: ChartType.BAR,
        xKey: 'rooms',
        series: [
          { dataKey: 'total', label: 'Qtd. Pedidos', color: 'var(--chart-1)' },
        ],
        data: roomsPerOrder,
      },
      byStatus: {
        title: 'Pedidos por Status',
        description: 'Distribuição dos pedidos por situação atual',
        chartType: ChartType.PIE,
        xKey: 'status',
        series: [
          { dataKey: 'total', label: 'Pedidos' },
        ],
        data: byStatus,
      },
    };
  }

  // All charts for the "Financial" tab
  async getFinancialCharts(startDate?: Date, endDate?: Date): Promise<FinancialChartsDto> {
    const [discountImpact, monthlyGrossVsNet, overview] =
      await Promise.all([
        this.financial.getDiscountImpact(startDate, endDate),
        this.financial.getMonthlyGrossVsNet(startDate, endDate),
        this.financial.getFinancialOverview(startDate, endDate),
      ]);

    return {
      discountImpact: {
        title: 'Impacto dos Descontos',
        description: 'Comparação entre pedidos com e sem desconto aplicado',
        chartType: ChartType.BAR,
        xKey: 'group',
        series: [
          { dataKey: 'orders_count', label: 'Qtd. Pedidos', color: 'var(--chart-1)' },
          { dataKey: 'avg_ticket', label: 'Ticket Médio', color: 'var(--chart-2)' },
          { dataKey: 'total_revenue', label: 'Receita Total', color: 'var(--chart-3)' },
        ],
        data: discountImpact,
      },
      monthlyGrossVsNet: {
        title: 'Receita Bruta vs Líquida',
        description: 'Comparação mensal entre receita bruta, líquida e descontos',
        chartType: ChartType.AREA,
        xKey: 'month',
        series: [
          { dataKey: 'gross_revenue', label: 'Receita Bruta', color: 'var(--chart-1)' },
          { dataKey: 'net_revenue', label: 'Receita Líquida', color: 'var(--chart-2)' },
          { dataKey: 'total_discount', label: 'Descontos', color: 'var(--chart-3)' },
        ],
        data: monthlyGrossVsNet,
      },
      overview,
    };
  }

  // All charts for the "Products" tab
  async getProductsCharts(startDate?: Date, endDate?: Date): Promise<ProductsChartsDto> {
    const [topSelling, revenueByType] = await Promise.all([
      this.products.getTopSellingProducts(startDate, endDate, 10),
      this.products.getRevenueByProductType(startDate, endDate),
    ]);

    return {
      topSelling: {
        title: 'Produtos Mais Vendidos',
        description: 'Ranking dos produtos com maior volume de vendas',
        chartType: ChartType.BAR,
        xKey: 'name',
        series: [
          { dataKey: 'total_quantity', label: 'Qtd. Vendida', color: 'var(--chart-1)' },
          { dataKey: 'total_revenue', label: 'Receita', color: 'var(--chart-2)' },
        ],
        data: topSelling,
      },
      revenueByType: {
        title: 'Receita por Categoria',
        description: 'Proporção do faturamento por tipo de produto',
        chartType: ChartType.PIE,
        xKey: 'type',
        series: [
          { dataKey: 'total_revenue', label: 'Receita' },
        ],
        data: revenueByType,
      },
    };
  }

  // Everything — KPIs + all charts in a single request
  async getAll(startDate?: Date, endDate?: Date): Promise<DashboardAllDto> {
    const [overview, ordersCharts, financialCharts, productsCharts] =
      await Promise.all([
        this.getOverview(startDate, endDate),
        this.getOrdersCharts(startDate, endDate),
        this.getFinancialCharts(startDate, endDate),
        this.getProductsCharts(startDate, endDate),
      ]);

    return {
      overview,
      ordersCharts,
      financialCharts,
      productsCharts,
    };
  }
}
