import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { CompleteOrderOrderBy } from 'src/complete-order/enums/complete-order-order-by.enum';

export class QueryCompleteOrderDto {
    @ApiPropertyOptional({ description: 'Pular N registros', example: 0 })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    skip?: number;

    @ApiPropertyOptional({ description: 'Limite de registros', example: 10 })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    take?: number;

    @ApiPropertyOptional({ description: 'Busca por nome do cliente ou número do pedido', example: 'Maria' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Campo para ordenação', enum: CompleteOrderOrderBy })
    @IsOptional()
    @IsEnum(CompleteOrderOrderBy)
    orderBy?: CompleteOrderOrderBy;

    @ApiPropertyOptional({ description: 'Direção da ordenação', enum: OrderDirection })
    @IsEnum(OrderDirection)
    @IsOptional()
    order?: OrderDirection;

    @ApiPropertyOptional({ description: 'Filtrar por status', enum: CompleteOrderStatus })
    @IsOptional()
    @IsEnum(CompleteOrderStatus)
    status?: CompleteOrderStatus;
}
