import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { CompleteOrderOrderBy } from 'src/complete-order/enums/complete-order-order-by.enum';

export class QueryCompleteOrderDto {
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

    @IsOptional()
    @IsEnum(CompleteOrderOrderBy)
    orderBy?: CompleteOrderOrderBy;

    @IsEnum(OrderDirection)
    @IsOptional()
    order?: OrderDirection;

    @IsOptional()
    @IsEnum(CompleteOrderStatus)
    status?: CompleteOrderStatus;
}
