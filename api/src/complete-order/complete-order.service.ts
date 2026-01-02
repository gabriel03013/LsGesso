import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { complete_order as CompleteOrder, Prisma } from '@prisma/client';
import { QueryCompleteOrderDto } from './dto/query-complete-order.dto';
import { CompleteOrderOrderBy } from './enums/complete-order-order-by.enum';
import { CompleteOrderStatus } from './enums/complete-order-status.enum';

@Injectable()
export class CompleteOrderService {
  constructor(private readonly prisma: PrismaService) {}

  // * BASIC CRUD

  // Find all
  async findAll(query?: QueryCompleteOrderDto): Promise<CompleteOrder[]> {
    const { skip, take, search, orderBy, order, status } = query || {};

    const searchNumber =
      search && !isNaN(Number(search)) ? Number(search) : undefined;

    const where: Prisma.complete_orderWhereInput = {
      ...(status && { status }),

      ...(search && {
        OR: [
          {
            client_name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          ...(searchNumber !== undefined ? [{ order_no: searchNumber }] : []),
        ],
      }),
    };

    const orderByClause: Prisma.complete_orderOrderByWithRelationInput = {
      [orderBy ?? CompleteOrderOrderBy.CREATED_AT]: order ?? 'desc',
    };

    return this.prisma.complete_order.findMany({
      where,
      skip,
      take,
      orderBy: orderByClause,
    });
  }

  // Find one
  async findOne(id: number): Promise<CompleteOrder> {
    const completeOrder = await this.prisma.complete_order.findUnique({
      where: { id },
    });

    if (!completeOrder) {
      throw new NotFoundException(
        'Complete order with ID ' + id + ' not found',
      );
    }

    return completeOrder;
  }

  // Create
  async create(data: Prisma.complete_orderCreateInput): Promise<CompleteOrder> {
    return this.prisma.complete_order.create({ data });
  }

  // Update
  async update(
    id: number,
    body: Prisma.complete_orderUpdateInput,
  ): Promise<CompleteOrder> {
    try {
      return await this.prisma.complete_order.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'Complete order with ID ' + id + ' not found',
        );
      }
      throw error;
    }
  }

  // Delete
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.complete_order.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'Complete order with ID ' + id + ' not found',
        );
      }
      throw error;
    }
  }

  // * FRONTEND-FRIENDLY METHODS

  // Find by order number
  async findByOrderNo(orderNo: number) {
    const order = await this.prisma.complete_order.findUnique({
      where: { order_no: orderNo },
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNo} not found`);
    }

    return order;
  }

  // Summary of complete orders
  async getSummary() {
    const [total, pending, finished] = await this.prisma.$transaction([
      this.prisma.complete_order.count(),
      this.prisma.complete_order.count({ where: { status: 'PENDING' } }),
      this.prisma.complete_order.count({ where: { status: 'FINISHED' } }),
    ]);

    return {
      total,
      pending,
      finished,
    };
  }

  // Change status
  async changeStatus(id: number, status: CompleteOrderStatus) {
    try {
      return this.prisma.complete_order.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'Complete order with ID ' + id + ' not found',
        );
      }
      throw error;
    }
  }

  // Find for select (listing of complete orders)
  async findForSelect() {
    return this.prisma.complete_order.findMany({
      select: {
        id: true,
        order_no: true,
        client_name: true,
        status: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  // Find one with details
  async findOneWithDetails(id: number) {
    const order = await this.prisma.complete_order.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Complete order ${id} not found`);
    }

    return order;
  }
}
