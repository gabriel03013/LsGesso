import { Injectable } from '@nestjs/common';
import { complete_order as CompleteOrder, Prisma } from '@prisma/client';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // * ORDERS

  // Get total orders
  async getTotalOrders(startDate?: Date, endDate?: Date): Promise<number> {
    const where: Prisma.complete_orderWhereInput = {};

    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.complete_order.count({ where });
  }

  // Get total orders by status
  async getTotalOrdersByStatus(
    status: CompleteOrderStatus = CompleteOrderStatus.PAGO,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const where: Prisma.complete_orderWhereInput = { status };

    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.complete_order.count({
      where,
    });
  }

  // Get orders count by status
  async getOrdersCountByStatus(startDate?: Date, endDate?: Date) {
    const where: Prisma.complete_orderWhereInput = {};

    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    const grouped = await this.prisma.complete_order.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });

    return grouped.map((item) => ({
      status: item.status,
      total: item._count._all,
    }));
  }

  // Get orders per day
  async getOrdersPerDay(startDate: Date, endDate: Date) {
    return this.prisma.$queryRaw<{ date: string; total: number }[]>`
    SELECT DATE(created_at) as date, COUNT(*) as total
    FROM complete_order
    WHERE created_at BETWEEN ${startDate} AND ${endDate}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
  }

  // Get orders overview
  async getOrdersOverview(startDate?: Date, endDate?: Date) {
    const [total, paid, pending, canceled] = await Promise.all([
      this.getTotalOrders(startDate, endDate),
      this.getTotalOrdersByStatus(CompleteOrderStatus.PAGO, startDate, endDate),
      this.getTotalOrdersByStatus(
        CompleteOrderStatus.ANDAMENTO,
        startDate,
        endDate,
      ),
      this.getTotalOrdersByStatus(
        CompleteOrderStatus.CANCELADO,
        startDate,
        endDate,
      ),
    ]);

    return {
      total,
      byStatus: {
        paid,
        pending,
        canceled,
      },
    };
  }
}
