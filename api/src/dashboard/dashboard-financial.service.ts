import { Injectable } from '@nestjs/common';
import { complete_order as CompleteOrder, Prisma } from '@prisma/client';
import { CompleteOrderStatus } from 'src/complete-order/enums/complete-order-status.enum';
import { PrismaService } from 'src/prisma.service';

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

    return {
      totalNetRevenue: totalNet._sum.net_amount?.toNumber() ?? 0,
      totalGrossRevenue: totalGross._sum.gross_amount?.toNumber() ?? 0,
      totalDiscount: totalDiscount._sum.discount_amount?.toNumber() ?? 0,
      paidNetRevenue: paidNet._sum.net_amount?.toNumber() ?? 0,
    };
  }
}
