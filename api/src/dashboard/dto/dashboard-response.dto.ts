import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// * OVERVIEW

export class OrdersOverviewDto {
  @ApiProperty({ example: 200 })
  total: number;

  @ApiProperty({
    example: { paid: 90, inProgress: 20, completed: 50, canceled: 6, budget: 12, maintenance: 22 },
  })
  byStatus: {
    paid: number;
    inProgress: number;
    completed: number;
    canceled: number;
    budget: number;
    maintenance: number;
  };
}

export class FinancialOverviewDto {
  @ApiProperty({ example: 45000.0 })
  totalNetRevenue: number;

  @ApiProperty({ example: 50000.0 })
  totalGrossRevenue: number;

  @ApiProperty({ example: 5000.0 })
  totalDiscount: number;

  @ApiProperty({ example: 35000.0 })
  paidNetRevenue: number;
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

export class DashboardOverviewDto {
  @ApiProperty({ type: OrdersOverviewDto })
  orders: OrdersOverviewDto;

  @ApiProperty({ type: FinancialOverviewDto })
  financial: FinancialOverviewDto;

  @ApiProperty({ type: [DiscountImpactItemDto] })
  discountImpact: DiscountImpactItemDto[];

  @ApiProperty({ type: [RoomsPerOrderItemDto] })
  avgRoomsPerOrder: RoomsPerOrderItemDto[];
}

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

// * GROUPED CHART RESPONSES (one per tab)

export class OrdersChartsDto {
  @ApiProperty({ type: [OrdersMonthlyTrendItemDto] })
  monthlyTrend: OrdersMonthlyTrendItemDto[];

  @ApiProperty({ type: [TopEmployeeItemDto] })
  topEmployees: TopEmployeeItemDto[];

  @ApiProperty({ type: [RoomsPerOrderItemDto] })
  roomsPerOrder: RoomsPerOrderItemDto[];

  @ApiProperty({ type: [OrdersByStatusItemDto] })
  byStatus: OrdersByStatusItemDto[];
}

export class FinancialChartsDto {
  @ApiProperty({ type: [DiscountImpactItemDto] })
  discountImpact: DiscountImpactItemDto[];

  @ApiProperty({ type: [MonthlyGrossVsNetItemDto] })
  monthlyGrossVsNet: MonthlyGrossVsNetItemDto[];

  @ApiProperty({ type: FinancialOverviewDto })
  overview: FinancialOverviewDto;
}

export class ProductsChartsDto {
  @ApiProperty({ type: [TopSellingProductItemDto] })
  topSelling: TopSellingProductItemDto[];

  @ApiProperty({ type: [RevenueByProductTypeItemDto] })
  revenueByType: RevenueByProductTypeItemDto[];
}

export class DashboardAllDto {
  @ApiProperty({ type: DashboardOverviewDto })
  overview: DashboardOverviewDto;

  @ApiProperty({ type: OrdersChartsDto })
  ordersCharts: OrdersChartsDto;

  @ApiProperty({ type: FinancialChartsDto })
  financialCharts: FinancialChartsDto;

  @ApiProperty({ type: ProductsChartsDto })
  productsCharts: ProductsChartsDto;
}
