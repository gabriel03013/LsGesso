import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteOrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  created_by_id: number;

  @ApiProperty({ example: 1001 })
  order_no: number;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  client_cpf: string | null;

  @ApiPropertyOptional({ example: '11999999999' })
  client_phone: string | null;

  @ApiPropertyOptional({ example: 'Maria Oliveira' })
  client_name: string | null;

  @ApiPropertyOptional({ example: 'Em andamento', enum: ['Em andamento', 'Concluído', 'Cancelado', 'Pago', 'Orçamento', 'Manutenção'] })
  status: string | null;

  @ApiPropertyOptional({ example: '2025-01-15' })
  created_at: Date | null;

  @ApiPropertyOptional({ example: '2025-02-01' })
  deliver_date: Date | null;

  @ApiPropertyOptional({ example: 1500.0 })
  gross_amount: number | null;

  @ApiPropertyOptional({ example: 100.0 })
  discount_amount: number | null;

  @ApiPropertyOptional({ example: 1400.0 })
  net_amount: number | null;
}

export class CreateCompleteOrderDto {
  @ApiProperty({ description: 'Relação com employee (created_by)', example: { connect: { id: 1 } } })
  employee: { connect: { id: number } };

  @ApiPropertyOptional({ example: '123.456.789-00' })
  client_cpf?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  client_phone?: string;

  @ApiPropertyOptional({ example: 'Maria Oliveira' })
  client_name?: string;

  @ApiPropertyOptional({ example: 'Orçamento', enum: ['Em andamento', 'Concluído', 'Cancelado', 'Pago', 'Orçamento', 'Manutenção'] })
  status?: string;

  @ApiPropertyOptional({ example: '2025-01-15' })
  created_at?: string;

  @ApiPropertyOptional({ example: '2025-02-01' })
  deliver_date?: string;

  @ApiPropertyOptional({ example: 1500.0 })
  gross_amount?: number;

  @ApiPropertyOptional({ example: 100.0 })
  discount_amount?: number;

  @ApiPropertyOptional({ example: 1400.0 })
  net_amount?: number;
}

export class UpdateCompleteOrderDto {
  @ApiPropertyOptional({ example: 'Maria Oliveira' })
  client_name?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  client_cpf?: string;

  @ApiPropertyOptional({ example: 'Pago', enum: ['Em andamento', 'Concluído', 'Cancelado', 'Pago', 'Orçamento', 'Manutenção'] })
  status?: string;

  @ApiPropertyOptional({ example: '2025-02-01' })
  deliver_date?: string;

  @ApiPropertyOptional({ example: 1500.0 })
  gross_amount?: number;

  @ApiPropertyOptional({ example: 100.0 })
  discount_amount?: number;

  @ApiPropertyOptional({ example: 1400.0 })
  net_amount?: number;
}

export class ChangeStatusDto {
  @ApiProperty({ example: 'Pago', enum: ['Em andamento', 'Concluído', 'Cancelado', 'Pago', 'Orçamento', 'Manutenção'] })
  status: string;
}

export class CompleteOrderSummaryDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 10 })
  pending: number;

  @ApiProperty({ example: 30 })
  finished: number;
}

export class CompleteOrderListingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1001 })
  order_no: number;

  @ApiPropertyOptional({ example: 'Maria Oliveira' })
  client_name: string | null;

  @ApiPropertyOptional({ example: 'Pago' })
  status: string | null;
}
