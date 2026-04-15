import { Injectable } from '@nestjs/common';
import { complete_order as CompleteOrder, Prisma } from '@prisma/client';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { PrismaService } from 'src/prisma.service';
import { IDashboardOrdersResponse } from './interfaces/dashboard-orders-response.interface';
import { KpiCategory } from './enums/kpi-category.enum';
import { KpiIcon } from './enums/kpi-icon.enum';

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

  // Ranking of employees by revenue generated and number of orders created
  async getTopEmployeesByRevenue(
    startDate?: Date,
    endDate?: Date,
    limit: number = 10,
  ) {
    return this.prisma.$queryRaw<
      {
        employee_id: number;
        name: string;
        role: string;
        orders_count: number;
        total_revenue: number;
      }[]
    >`
      SELECT
        e.id as employee_id,
        e.name,
        e.role,
        COUNT(co.id)::int as orders_count,
        COALESCE(SUM(co.net_amount), 0)::float as total_revenue
      FROM employee e
      JOIN complete_order co ON co.created_by_id = e.id
      WHERE (${startDate}::date IS NULL OR co.created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR co.created_at <= ${endDate})
      GROUP BY e.id, e.name, e.role
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;
  }

  // Distribution of how many rooms (orders) each complete_order has (1, 2, 3+)
  async getAverageRoomsPerOrder(startDate?: Date, endDate?: Date) {
    return this.prisma.$queryRaw<{ rooms: number; total: number }[]>`
    SELECT rooms, COUNT(*)::int as total
    FROM (
      SELECT co.id, COUNT(o.id)::int as rooms
      FROM complete_order co
      JOIN "order" o ON o.complete_order_id = co.id
      WHERE (${startDate}::date IS NULL OR co.created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR co.created_at <= ${endDate})
      GROUP BY co.id
    ) sub
    GROUP BY rooms
    ORDER BY rooms ASC
  `;
  }

  // Monthly trend: order count + net revenue per month
  async getOrdersMonthlyTrend(startDate?: Date, endDate?: Date) {
    return this.prisma.$queryRaw<
      { month: string; orders_count: number; net_revenue: number }[]
    >`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*)::int as orders_count,
        COALESCE(SUM(net_amount), 0)::float as net_revenue
      FROM complete_order
      WHERE (${startDate}::date IS NULL OR created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR created_at <= ${endDate})
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;
  }

  // Get orders overview
  async getOrdersOverview(startDate?: Date, endDate?: Date) {
    const [total, paid, inProgress, completed, canceled, budget, maintenance] =
      await Promise.all([
        this.getTotalOrders(startDate, endDate),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.PAGO,
          startDate,
          endDate,
        ),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.ANDAMENTO,
          startDate,
          endDate,
        ),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.CONCLUIDO,
          startDate,
          endDate,
        ),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.CANCELADO,
          startDate,
          endDate,
        ),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.ORCAMENTO,
          startDate,
          endDate,
        ),
        this.getTotalOrdersByStatus(
          CompleteOrderStatus.MANUTENCAO,
          startDate,
          endDate,
        ),
      ]);

    const response: IDashboardOrdersResponse = {
      total: {
        title: 'Total de Pedidos',
        description: 'Número total de pedidos no período selecionado',
        data: total.toString(),
        type: 'number',
        icon: KpiIcon.CLIPBOARD_LIST,
        category: KpiCategory.ORDER,
      },
      paid: {
        title: 'Pedidos Pagos',
        description: 'Número de pedidos pagos no período selecionado',
        data: paid.toString(),
        type: 'number',
        icon: KpiIcon.CHECK_CIRCLE,
        category: KpiCategory.ORDER,
      },
      pending: {
        title: 'Pedidos em Andamento',
        description: 'Número de pedidos em andamento no período selecionado',
        data: inProgress.toString(),
        type: 'number',
        icon: KpiIcon.CLOCK,
        category: KpiCategory.ORDER,
      },
      cancelled: {
        title: 'Pedidos Cancelados',
        description: 'Número de pedidos cancelados no período selecionado',
        data: canceled.toString(),
        type: 'number',
        icon: KpiIcon.X_CIRCLE,
        category: KpiCategory.ORDER,
      },
      budget: {
        title: 'Orçamentos',
        description: 'Número de orçamentos no período selecionado',
        data: budget.toString(),
        type: 'number',
        icon: KpiIcon.FILE_TEXT,
        category: KpiCategory.ORDER,
      },
      maintenance: {
        title: 'Pedidos em Manutenção',
        description: 'Número de pedidos em manutenção no período selecionado',
        data: maintenance.toString(),
        type: 'number',
        icon: KpiIcon.WRENCH,
        category: KpiCategory.ORDER,
      },
      completed: {
        title: 'Pedidos Concluídos',
        description: 'Número de pedidos concluídos no período selecionado',
        data: completed.toString(),
        type: 'number',
        icon: KpiIcon.CHECK_SQUARE,
        category: KpiCategory.ORDER,
      },
    };

    return response;
  }
}
