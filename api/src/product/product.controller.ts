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
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/product-query.dto';
import { ProductResponseDto, CreateProductDto, UpdateProductDto } from './dto/product-response.dto';
import { Prisma, product as Product } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Produtos')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de produtos', type: [ProductResponseDto] })
  async findAll(@Query() query: QueryProductDto): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Contagem total de produtos' })
  @ApiResponse({ status: 200, description: 'Número total de produtos', type: Number })
  async count(): Promise<number> {
    return this.productService.count();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Produto encontrado', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar produto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Produto criado', type: ProductResponseDto })
  async create(@Body() body: Prisma.productCreateInput): Promise<Product> {
    return this.productService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.productUpdateInput,
  ): Promise<Product> {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Produto deletado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productService.delete(id);
  }
}
