import { Injectable } from '@nestjs/common';
import { complete_order as CompleteOrder, Prisma } from '@prisma/client';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { PrismaService } from 'src/prisma.service';
import { IDashboardFinancialResponse } from './interfaces/dashboard-financial-response.interface';

@Injectable()
export class DashboardFinancialService {
  constructor(private readonly prisma: PrismaService) {}

  private async sumAmount(
    field: 'net_amount' | 'gross_amount' | 'discount_amount',
    status?: CompleteOrderStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const where: Prisma.complete_orderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    const result = await this.prisma.complete_order.aggregate({
      where,
      _sum: {
        [field]: true,
      },
    });

    return (result._sum as any)[field]?.toNumber() ?? 0;
  }

  // * FINANCIAL

  // Total net revenue (includes discount and not-paid orders)
  getTotalNetRevenue(startDate?: Date, endDate?: Date) {
    return this.sumAmount('net_amount', undefined, startDate, endDate);
  }

  // Total net revenue by status
  getTotalNetRevenueByStatus(
    status: CompleteOrderStatus = CompleteOrderStatus.PAGO,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.sumAmount('net_amount', status, startDate, endDate);
  }

  // Total gross revenue (includes discount and not-paid orders)
  getTotalGrossRevenue(startDate?: Date, endDate?: Date) {
    return this.sumAmount('gross_amount', undefined, startDate, endDate);
  }

  // Total gross revenue by status
  getTotalGrossRevenueByStatus(
    status: CompleteOrderStatus = CompleteOrderStatus.PAGO,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.sumAmount('gross_amount', status, startDate, endDate);
  }

  // Total discount (includes discount and not-paid orders)
  getTotalDiscount(startDate?: Date, endDate?: Date) {
    return this.sumAmount('discount_amount', undefined, startDate, endDate);
  }

  // Total discount by status
  getTotalDiscountByStatus(
    status: CompleteOrderStatus = CompleteOrderStatus.PAGO,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.sumAmount('discount_amount', status, startDate, endDate);
  }

  // Average ticket
  async getAverageTicket(
    status: CompleteOrderStatus = CompleteOrderStatus.PAGO,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const [totalOrders, totalNet] = await Promise.all([
      this.prisma.complete_order.count({
        where: {
          status,
          ...(startDate &&
            endDate && {
              created_at: {
                gte: startDate,
                lte: endDate,
              },
            }),
        },
      }),
      this.sumAmount('net_amount', status, startDate, endDate),
    ]);

    if (totalOrders === 0) return 0;

    return totalNet / totalOrders;
  }

  // Comparison: orders with discount vs without — count, avg ticket, total revenue per group
  async getDiscountImpact(startDate?: Date, endDate?: Date) {
    return this.prisma.$queryRaw<
      {
        group: string;
        orders_count: number;
        avg_ticket: number;
        total_revenue: number;
      }[]
    >`
      SELECT
        CASE WHEN discount_amount > 0 THEN 'with_discount' ELSE 'without_discount' END as "group",
        COUNT(*)::int as orders_count,
        ROUND(AVG(net_amount)::numeric, 2)::float as avg_ticket,
        COALESCE(SUM(net_amount), 0)::float as total_revenue
      FROM complete_order
      WHERE (${startDate}::date IS NULL OR created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR created_at <= ${endDate})
      GROUP BY "group"
      ORDER BY "group" ASC
    `;
  }

  // Monthly gross revenue vs net revenue vs total discount
  async getMonthlyGrossVsNet(startDate?: Date, endDate?: Date) {
    return this.prisma.$queryRaw<
      {
        month: string;
        gross_revenue: number;
        net_revenue: number;
        total_discount: number;
      }[]
    >`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COALESCE(SUM(gross_amount), 0)::float as gross_revenue,
        COALESCE(SUM(net_amount), 0)::float as net_revenue,
        COALESCE(SUM(discount_amount), 0)::float as total_discount
      FROM complete_order
      WHERE (${startDate}::date IS NULL OR created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR created_at <= ${endDate})
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;
  }

  // * FINANCIAL OVERVIEW

  async getFinancialOverview(startDate?: Date, endDate?: Date) {
    const where: Prisma.complete_orderWhereInput = {};

    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [totalNet, totalGross, totalDiscount, paidNet] =
      await this.prisma.$transaction([
        this.prisma.complete_order.aggregate({
          where,
          _sum: { net_amount: true },
        }),
        this.prisma.complete_order.aggregate({
          where,
          _sum: { gross_amount: true },
        }),
        this.prisma.complete_order.aggregate({
          where,
          _sum: { discount_amount: true },
        }),
        this.prisma.complete_order.aggregate({
          where: {
            ...where,
            status: CompleteOrderStatus.PAGO,
          },
          _sum: { net_amount: true },
        }),
      ]);

    const response: IDashboardFinancialResponse = {
      totalNetRevenue: {
        title: 'Receita Líquida Total',
        description:
          'Soma da receita líquida de todos os pedidos no período selecionado',
        data: (totalNet._sum.net_amount ?? 0).toString(),
        type: 'money',
        icon: 'dollar-sign',
      },
      totalGrossRevenue: {
        title: 'Receita Bruta Total',
        description:
          'Soma da receita bruta de todos os pedidos no período selecionado',
        data: (totalGross._sum.gross_amount ?? 0).toString(),
        type: 'money',
        icon: 'dollar-sign',
      },
      totalDiscount: {
        title: 'Desconto Total',
        description:
          'Soma dos descontos aplicados em todos os pedidos no período selecionado',
        data: (totalDiscount._sum.discount_amount ?? 0).toString(),
        type: 'money',
        icon: 'tag',
      },
      paidNetRevenue: {
        title: 'Receita Líquida de Pedidos Pagos',
        description:
          'Soma da receita líquida de pedidos com status Pago no período selecionado',
        data: (paidNet._sum.net_amount ?? 0).toString(),
        type: 'money',
        icon: 'dollar-sign',
      },
    };

    return response;
  }
}
