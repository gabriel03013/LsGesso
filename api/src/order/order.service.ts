import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { order as Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // * Basic CRUD

  // Find all orders
  async findAll(completeOrderId?: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        complete_order_id: completeOrderId ? completeOrderId : undefined,
      },
    });
  }

  // Find one order (not needed)
  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  // Create order (complement of complete_order)
  async create(data: Prisma.orderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  // Update order (complement of complete_order)
  async update(id: number, data: Prisma.orderUpdateInput): Promise<Order> {
    await this.findOne(id);
    return this.prisma.order.update({ where: { id }, data });
  }

  // Delete order (complement of complete_order)
  async delete(id: number): Promise<Order> {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }

  // * FRONTEND-FRIENDLY METHODS

  // Find order with product details
  async findOneWithProductDetails(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { order_product: { include: { product: true } } },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }
}

// * await this.findOne(id) throws NotFoundException if order not found

// * Order doesn't has a query DTO or pagination because it's a complement of complete_order, not shown individually in frontend
// * Complete order is the MAIN ENTITY and what is shown in frontend, order is a complement of it
// * Basically: complete_order has a order[] and order has a complete_order_id