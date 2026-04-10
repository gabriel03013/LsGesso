import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  complete_order_id: number;

  @ApiPropertyOptional({ example: 'Sala de Estar' })
  room_name: string | null;

  @ApiPropertyOptional({ example: 500.0 })
  gross_amount: number | null;

  @ApiPropertyOptional({ example: '2025-01-15T10:00:00Z' })
  created_at: Date | null;

  @ApiPropertyOptional({ example: 25.5 })
  area_m2: number | null;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Relação com complete_order', example: { connect: { id: 1 } } })
  complete_order: { connect: { id: number } };

  @ApiPropertyOptional({ example: 'Sala de Estar' })
  room_name?: string;

  @ApiPropertyOptional({ example: 500.0 })
  gross_amount?: number;

  @ApiPropertyOptional({ example: 25.5 })
  area_m2?: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'Quarto Principal' })
  room_name?: string;

  @ApiPropertyOptional({ example: 600.0 })
  gross_amount?: number;

  @ApiPropertyOptional({ example: 30.0 })
  area_m2?: number;
}
