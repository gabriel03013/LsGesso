import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { product as Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // * BASIC CRUD

  // Find all products
  async findAll(query: QueryProductDto): Promise<Product[]> {
    const take = Math.min(query.take ?? 10, 50);
    const skip = query.skip ?? 0;

    const where: Prisma.productWhereInput = {};

    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
    }

    if (query.type) {
      where.type = query.type;
    }

    const orderBy = (
      query.orderBy ? { [query.orderBy]: query.order ?? 'asc' } : { id: 'desc' }
    ) as Prisma.productOrderByWithRelationInput;

    return this.prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  }

  // Find one product
  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Create product
  async create(data: Prisma.productCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  // Update product
  async update(id: number, data: Prisma.productUpdateInput): Promise<Product> {
    const product = await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  // Delete product
  async delete(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  // * FRONTEND-FRIENDLY METHODS

  // Count products
  async count() {
    return this.prisma.product.count();
  }
}
