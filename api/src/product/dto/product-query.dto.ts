import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { ProductType } from 'src/product/enums/product-type.enum';
import { ProductOrderBy } from '../enums/order-by.enum';

export class QueryProductDto {
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    skip?: number;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    take?: number;

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    @IsEnum(ProductOrderBy)
    orderBy?: ProductOrderBy;

    @IsString()
    @IsEnum(OrderDirection)
    @IsOptional()
    order?: OrderDirection;

    @IsOptional()
    @IsEnum(ProductType)
    type?: ProductType;
}