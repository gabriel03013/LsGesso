import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrdersOverviewDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({
    example: { paid: 30, pending: 10, canceled: 10 },
  })
  byStatus: {
    paid: number;
    pending: number;
    canceled: number;
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

export class DashboardOverviewDto {
  @ApiProperty({ type: OrdersOverviewDto })
  orders: OrdersOverviewDto;

  @ApiProperty({ type: FinancialOverviewDto })
  financial: FinancialOverviewDto;
}

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
