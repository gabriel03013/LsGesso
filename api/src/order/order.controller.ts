import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // * BASIC CRUD
  @Get()
  async findAll(
    @Query('completeOrderId', ParseIntPipe) completeOrderId?: number,
  ) {
    return this.orderService.findAll(completeOrderId ?? undefined);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Prisma.orderCreateInput) {
    return this.orderService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.orderUpdateInput,
  ) {
    return this.orderService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.delete(id);
  }

  // * FRONTEND-FRIENDLY METHODS

  @Get(':id/details')
  async findOneWithProductDetails(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOneWithProductDetails(id);
  }
}
