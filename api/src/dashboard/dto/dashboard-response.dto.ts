import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChartType } from '../enums/chart-type.enum';
import { KpiCategory } from '../enums/kpi-category.enum';
import { KpiIcon } from '../enums/kpi-icon.enum';

// * OVERVIEW — flat KPI card array (matches IResponseDashboardKPIs)

export class KpiCardDto {
  @ApiProperty({ example: 'Total de Pedidos' })
  title: string;

  @ApiProperty({ example: 'Todos os pedidos no período' })
  description: string;

  @ApiProperty({ example: '200' })
  data: string;

  @ApiProperty({ enum: ['money', 'number', 'percentage'], example: 'number' })
  type: 'money' | 'number' | 'percentage';

  @ApiProperty({ enum: KpiIcon, example: KpiIcon.CLIPBOARD_LIST })
  icon: KpiIcon;

  @ApiProperty({ enum: KpiCategory, example: KpiCategory.ORDER })
  category: KpiCategory;

  @ApiPropertyOptional({ example: true })
  isTrendingUp?: boolean;

  @ApiPropertyOptional({ example: 12.5 })
  trendingPercentage?: number;
}

// kept for financial charts tab — each field is a KPI card
export class FinancialOverviewDto {
  @ApiProperty({ type: KpiCardDto })
  totalNetRevenue: KpiCardDto;

  @ApiProperty({ type: KpiCardDto })
  totalGrossRevenue: KpiCardDto;

  @ApiProperty({ type: KpiCardDto })
  totalDiscount: KpiCardDto;

  @ApiProperty({ type: KpiCardDto })
  paidNetRevenue: KpiCardDto;
}

export class DiscountImpactItemDto {
  @ApiProperty({ example: 'with_discount', enum: ['with_discount', 'without_discount'] })
  group: string;

  @ApiProperty({ example: 140 })
  orders_count: number;

  @ApiProperty({ example: 2379.95 })
  avg_ticket: number;

  @ApiProperty({ example: 333193.5 })
  total_revenue: number;
}

export class RoomsPerOrderItemDto {
  @ApiProperty({ example: 2 })
  rooms: number;

  @ApiProperty({ example: 200 })
  total: number;
}

// DashboardOverviewDto is now just KpiCardDto[] — no wrapper class needed.
// The endpoint returns KpiCardDto[] directly.

// * ORDERS CHARTS

export class OrdersByStatusItemDto {
  @ApiPropertyOptional({ example: 'Pago' })
  status: string | null;

  @ApiProperty({ example: 15 })
  total: number;
}

export class OrdersPerDayItemDto {
  @ApiProperty({ example: '2025-01-15' })
  date: string;

  @ApiProperty({ example: 5 })
  total: number;
}

export class OrdersMonthlyTrendItemDto {
  @ApiProperty({ example: '2025-01' })
  month: string;

  @ApiProperty({ example: 12 })
  orders_count: number;

  @ApiProperty({ example: 23116.0 })
  net_revenue: number;
}

export class TopEmployeeItemDto {
  @ApiProperty({ example: 1 })
  employee_id: number;

  @ApiProperty({ example: 'Patricia Martins' })
  name: string;

  @ApiProperty({ example: 'vendedor' })
  role: string;

  @ApiProperty({ example: 25 })
  orders_count: number;

  @ApiProperty({ example: 52581.5 })
  total_revenue: number;
}

// * FINANCIAL CHARTS

export class MonthlyGrossVsNetItemDto {
  @ApiProperty({ example: '2025-01' })
  month: string;

  @ApiProperty({ example: 24210.0 })
  gross_revenue: number;

  @ApiProperty({ example: 23116.0 })
  net_revenue: number;

  @ApiProperty({ example: 1094.0 })
  total_discount: number;
}

// * PRODUCTS CHARTS

export class TopSellingProductItemDto {
  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 'Nicho de Gesso 30x30' })
  name: string;

  @ApiProperty({ example: 'nicho' })
  type: string;

  @ApiProperty({ example: 204 })
  total_quantity: number;

  @ApiProperty({ example: 13853.1 })
  total_revenue: number;
}

export class RevenueByProductTypeItemDto {
  @ApiProperty({ example: 'placa' })
  type: string;

  @ApiProperty({ example: 6 })
  products_count: number;

  @ApiProperty({ example: 733 })
  total_quantity: number;

  @ApiProperty({ example: 79494.5 })
  total_revenue: number;
}

// * GENERIC CHART WRAPPER

export class ChartSeriesDto {
  @ApiProperty({ example: 'orders_count' })
  dataKey: string;

  @ApiProperty({ example: 'Qtd. Pedidos' })
  label: string;

  @ApiPropertyOptional({ example: 'var(--chart-1)' })
  color?: string;
}

export class ChartResponseDto<T = any> {
  @ApiProperty({ example: 'Tendência Mensal' })
  title: string;

  @ApiProperty({ example: 'Evolução de pedidos e receita ao longo dos meses' })
  description: string;

  @ApiProperty({ enum: ChartType, example: ChartType.AREA })
  chartType: ChartType;

  @ApiProperty({ example: 'month', description: 'Campo usado no eixo X (ou label do pie)' })
  xKey: string;

  @ApiProperty({ type: [ChartSeriesDto], description: 'Séries de dados (eixo Y / fatias)' })
  series: ChartSeriesDto[];

  @ApiPropertyOptional({ example: { Pago: 'var(--success)', Cancelado: 'var(--destructive)' }, description: 'Mapa de cores por valor do xKey (ex: status → cor semântica)' })
  colorMap?: Record<string, string>;

  @ApiProperty()
  data: T[];
}

// * GROUPED CHART RESPONSES (one per tab)

export class OrdersChartsDto {
  @ApiProperty({ type: ChartResponseDto })
  monthlyTrend: ChartResponseDto<OrdersMonthlyTrendItemDto>;

  @ApiProperty({ type: ChartResponseDto })
  topEmployees: ChartResponseDto<TopEmployeeItemDto>;

  @ApiProperty({ type: ChartResponseDto })
  roomsPerOrder: ChartResponseDto<RoomsPerOrderItemDto>;

  @ApiProperty({ type: ChartResponseDto })
  byStatus: ChartResponseDto<OrdersByStatusItemDto>;
}

export class FinancialChartsDto {
  @ApiProperty({ type: ChartResponseDto })
  discountImpact: ChartResponseDto<DiscountImpactItemDto>;

  @ApiProperty({ type: ChartResponseDto })
  monthlyGrossVsNet: ChartResponseDto<MonthlyGrossVsNetItemDto>;

  @ApiProperty({ type: FinancialOverviewDto })
  overview: FinancialOverviewDto;
}

export class ProductsChartsDto {
  @ApiProperty({ type: ChartResponseDto })
  topSelling: ChartResponseDto<TopSellingProductItemDto>;

  @ApiProperty({ type: ChartResponseDto })
  revenueByType: ChartResponseDto<RevenueByProductTypeItemDto>;
}

export class DashboardAllDto {
  @ApiProperty({ type: [KpiCardDto] })
  overview: KpiCardDto[];

  @ApiProperty({ type: OrdersChartsDto })
  ordersCharts: OrdersChartsDto;

  @ApiProperty({ type: FinancialChartsDto })
  financialCharts: FinancialChartsDto;

  @ApiProperty({ type: ProductsChartsDto })
  productsCharts: ProductsChartsDto;
}
