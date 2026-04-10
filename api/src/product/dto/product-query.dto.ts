import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { ProductType } from 'src/product/enums/product-type.enum';
import { ProductOrderBy } from '../enums/order-by.enum';

export class QueryProductDto {
    @ApiPropertyOptional({ description: 'Pular N registros', example: 0 })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    skip?: number;

    @ApiPropertyOptional({ description: 'Limite de registros (max 50)', example: 10 })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    take?: number;

    @ApiPropertyOptional({ description: 'Busca por nome', example: 'gesso' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Campo para ordenação', enum: ProductOrderBy })
    @IsString()
    @IsOptional()
    @IsEnum(ProductOrderBy)
    orderBy?: ProductOrderBy;

    @ApiPropertyOptional({ description: 'Direção da ordenação', enum: OrderDirection })
    @IsString()
    @IsEnum(OrderDirection)
    @IsOptional()
    order?: OrderDirection;

    @ApiPropertyOptional({ description: 'Filtrar por tipo', enum: ProductType })
    @IsOptional()
    @IsEnum(ProductType)
    type?: ProductType;
}
