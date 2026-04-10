import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  order_id: number;

  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 5 })
  quantity: number;

  @ApiPropertyOptional({ example: 127.5 })
  gross_amount: number | null;
}

export class CreateOrderProductDto {
  @ApiProperty({ example: 1 })
  order_id: number;

  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 5 })
  quantity: number;
}

export class UpdateOrderProductDto {
  @ApiPropertyOptional({ example: 2 })
  product_id?: number;

  @ApiPropertyOptional({ example: 10 })
  quantity?: number;

  @ApiPropertyOptional({ example: 1 })
  order_id?: number;
}
