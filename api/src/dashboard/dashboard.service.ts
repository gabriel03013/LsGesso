import { Injectable } from '@nestjs/common';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardFinancialService } from './dashboard-financial.service';
import { DashboardProductsService } from './dashboard-products.service';
import { ChartType } from './enums/chart-type.enum';
import { IResponseDashboardKPIs } from './interfaces/dashboard-kpi-response.interface';

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
  async getOrdersCharts(startDate?: Date, endDate?: Date) {
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
        chartType: ChartType.AREA,
        data: monthlyTrend,
      },
      topEmployees: {
        title: 'Top Funcionários por Receita',
        chartType: ChartType.BAR,
        data: topEmployees,
      },
      roomsPerOrder: {
        title: 'Cômodos por Pedido',
        chartType: ChartType.BAR,
        data: roomsPerOrder,
      },
      byStatus: {
        title: 'Pedidos por Status',
        chartType: ChartType.PIE,
        data: byStatus,
      },
    };
  }

  // All charts for the "Financial" tab
  async getFinancialCharts(startDate?: Date, endDate?: Date) {
    const [discountImpact, monthlyGrossVsNet, overview] =
      await Promise.all([
        this.financial.getDiscountImpact(startDate, endDate),
        this.financial.getMonthlyGrossVsNet(startDate, endDate),
        this.financial.getFinancialOverview(startDate, endDate),
      ]);

    return {
      discountImpact: {
        title: 'Impacto dos Descontos',
        chartType: ChartType.BAR,
        data: discountImpact,
      },
      monthlyGrossVsNet: {
        title: 'Receita Bruta vs Líquida',
        chartType: ChartType.AREA,
        data: monthlyGrossVsNet,
      },
      overview,
    };
  }

  // All charts for the "Products" tab
  async getProductsCharts(startDate?: Date, endDate?: Date) {
    const [topSelling, revenueByType] = await Promise.all([
      this.products.getTopSellingProducts(startDate, endDate, 10),
      this.products.getRevenueByProductType(startDate, endDate),
    ]);

    return {
      topSelling: {
        title: 'Produtos Mais Vendidos',
        chartType: ChartType.BAR,
        data: topSelling,
      },
      revenueByType: {
        title: 'Receita por Categoria',
        chartType: ChartType.PIE,
        data: revenueByType,
      },
    };
  }

  // Everything — KPIs + all charts in a single request
  async getAll(startDate?: Date, endDate?: Date) {
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
