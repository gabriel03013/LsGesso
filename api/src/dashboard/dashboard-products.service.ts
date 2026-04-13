import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Ranking of best-selling products by total quantity sold
  async getTopSellingProducts(
    startDate?: Date,
    endDate?: Date,
    limit: number = 10,
  ) {
    return this.prisma.$queryRaw<
      { product_id: number; name: string; type: string; total_quantity: number; total_revenue: number }[]
    >`
      SELECT
        p.id as product_id,
        p.name,
        p.type,
        SUM(op.quantity)::int as total_quantity,
        COALESCE(SUM(op.gross_amount), 0)::float as total_revenue
      FROM order_product op
      JOIN product p ON p.id = op.product_id
      JOIN "order" o ON o.id = op.order_id
      JOIN complete_order co ON co.id = o.complete_order_id
      WHERE (${startDate}::date IS NULL OR co.created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR co.created_at <= ${endDate})
      GROUP BY p.id, p.name, p.type
      ORDER BY total_quantity DESC
      LIMIT ${limit}
    `;
  }

  // Revenue breakdown grouped by product type (placa, forro, moldura, etc.)
  async getRevenueByProductType(startDate?: Date, endDate?: Date) {
    return this.prisma.$queryRaw<
      { type: string; products_count: number; total_quantity: number; total_revenue: number }[]
    >`
      SELECT
        p.type,
        COUNT(DISTINCT p.id)::int as products_count,
        SUM(op.quantity)::int as total_quantity,
        COALESCE(SUM(op.gross_amount), 0)::float as total_revenue
      FROM order_product op
      JOIN product p ON p.id = op.product_id
      JOIN "order" o ON o.id = op.order_id
      JOIN complete_order co ON co.id = o.complete_order_id
      WHERE (${startDate}::date IS NULL OR co.created_at >= ${startDate})
        AND (${endDate}::date IS NULL OR co.created_at <= ${endDate})
      GROUP BY p.type
      ORDER BY total_revenue DESC
    `;
  }
}
