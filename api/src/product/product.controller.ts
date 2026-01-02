import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/product-query.dto';
import { Prisma, product as Product } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // * BASIC CRUD
  @Get()
  async findAll(@Query() query: QueryProductDto): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: Prisma.productCreateInput): Promise<Product> {
    return this.productService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.productUpdateInput,
  ): Promise<Product> {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productService.delete(id);
  }

  // * FRONTEND-FRIENDLY METHODS
  @Get('count')
  async count(): Promise<number> {
    return this.productService.count();
  }
}
