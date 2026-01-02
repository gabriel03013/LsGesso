import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order-product')
export class OrderProductController {
  constructor(
    private readonly orderProductService: OrderProductService,
    private readonly prismaService: PrismaService,
  ) {}

  // * BASIC CRUD
  @Get()
  async findAll(@Query('order_id', ParseIntPipe) orderId?: number) {
    return this.orderProductService.findAll(orderId ?? undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.orderProductService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Prisma.order_productCreateInput) {
    if (!data.product.connect?.id) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this.prismaService.product.findUnique({
      where: { id: data.product.connect.id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    data.gross_amount = Number(product.unit_price) * Number(data.quantity);

    return this.orderProductService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Prisma.order_productUpdateInput,
  ) {
    const existing = await this.orderProductService.findOne(id);

    const productId = data.product?.connect?.id || existing.product_id;
    const quantity =
      data.quantity !== undefined ? Number(data.quantity) : existing.quantity;

    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    data.gross_amount = Number(product.unit_price) * Number(quantity);

    return this.orderProductService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.orderProductService.delete(id);
  }
}
