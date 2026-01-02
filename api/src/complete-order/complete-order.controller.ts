import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CompleteOrderService } from './complete-order.service';
import { Prisma, complete_order as CompleteOrder } from '@prisma/client';
import { CompleteOrderStatus } from './enums/complete-order-status.enum';
import { QueryCompleteOrderDto } from './dto/query-complete-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('complete-order')
export class CompleteOrderController {
  constructor(private readonly completeOrderService: CompleteOrderService) {}

  // Find all
  @Get()
  async findAll(
    @Query() query?: QueryCompleteOrderDto,
  ): Promise<CompleteOrder[]> {
    return this.completeOrderService.findAll(query);
  }

  // Get summary
  @Get('summary')
  async getSummary() {
    return this.completeOrderService.getSummary();
  }

  // Find for select
  @Get('listing')
  async findForSelect() {
    return this.completeOrderService.findForSelect();
  }

  // Find by order no
  @Get('by-order-no/:order_no')
  async findByOrderNo(@Param('order_no', ParseIntPipe) order_no: number) {
    return this.completeOrderService.findByOrderNo(order_no);
  }

  // Find one with details
  @Get(':id/details')
  async findOneWithDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompleteOrder> {
    return this.completeOrderService.findOneWithDetails(id);
  }

  // Find one
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CompleteOrder> {
    return this.completeOrderService.findOne(id);
  }

  // Create
  @Post()
  async create(
    @Body() body: Prisma.complete_orderCreateInput,
  ): Promise<CompleteOrder> {
    return this.completeOrderService.create(body);
  }

  // Update
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.complete_orderUpdateInput,
  ): Promise<CompleteOrder> {
    return this.completeOrderService.update(id, body);
  }

  // Change status
  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: CompleteOrderStatus },
  ): Promise<CompleteOrder> {
    return this.completeOrderService.changeStatus(id, body.status);
  }

  // Delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.completeOrderService.delete(id);
  }
}
