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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderProductService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    if (!body.order_id || !body.product_id || body.quantity == null) {
      throw new BadRequestException(
        'order_id, product_id and quantity are required',
      );
    }

    const product = await this.prismaService.product.findUnique({
      where: { id: body.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data: Prisma.order_productCreateInput = {
      quantity: Number(body.quantity),
      gross_amount: Number(product.unit_price) * Number(body.quantity),

      order: {
        connect: { id: body.order_id },
      },

      product: {
        connect: { id: body.product_id },
      },
    };

    return this.orderProductService.create(data);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const existing = await this.orderProductService.findOne(id);

    const productId = body.product_id ?? existing.product_id;
    const quantity =
      body.quantity !== undefined ? Number(body.quantity) : existing.quantity;

    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data: Prisma.order_productUpdateInput = {
      quantity,
      gross_amount: Number(product.unit_price) * Number(quantity),

      ...(body.product_id && {
        product: { connect: { id: body.product_id } },
      }),

      ...(body.order_id && {
        order: { connect: { id: body.order_id } },
      }),
    };

    return this.orderProductService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.orderProductService.delete(id);
  }
}