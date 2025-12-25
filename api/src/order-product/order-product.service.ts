import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, order_product as OrderProduct } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderProductService {
  constructor(private readonly prisma: PrismaService) {}

  // * BASIC CRUD

  // Find all order products
  async findAll(orderId?: number): Promise<OrderProduct[]> {
    return this.prisma.order_product.findMany({
      where: orderId ? { order_id: orderId } : undefined,
      include: { product: true },
    });
  }

  // Find one order product
  async findOne(id: number): Promise<OrderProduct> {
    const orderProduct = await this.prisma.order_product.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!orderProduct) throw new NotFoundException('OrderProduct not found');
    return orderProduct;
  }

  // Create order product
  async create(data: Prisma.order_productCreateInput): Promise<OrderProduct> {
    return this.prisma.order_product.create({ data });
  }

  // Update order product
  async update(
    id: number,
    data: Prisma.order_productUpdateInput,
  ): Promise<OrderProduct> {
    await this.findOne(id);
    return this.prisma.order_product.update({
      where: { id },
      include: { product: true },
      data,
    });
  }

  // Delete order product
  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.order_product.delete({ where: { id } });
  }
}
