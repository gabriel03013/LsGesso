import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { OrderProductService } from './order-product.service';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { OrderProductResponseDto, CreateOrderProductDto, UpdateOrderProductDto } from './dto/order-product-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Produtos do Cômodo')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('order-product')
export class OrderProductController {
  constructor(
    private readonly orderProductService: OrderProductService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos de um cômodo' })
  @ApiQuery({ name: 'order_id', type: Number, required: false, description: 'Filtrar por cômodo (order)' })
  @ApiResponse({ status: 200, description: 'Lista de produtos do cômodo', type: [OrderProductResponseDto] })
  async findAll(@Query('order_id', ParseIntPipe) orderId?: number) {
    return this.orderProductService.findAll(orderId ?? undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto do cômodo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Produto do cômodo encontrado', type: OrderProductResponseDto })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderProductService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar produto a um cômodo (calcula gross_amount automaticamente)' })
  @ApiBody({ type: CreateOrderProductDto })
  @ApiResponse({ status: 201, description: 'Produto adicionado ao cômodo', type: OrderProductResponseDto })
  @ApiResponse({ status: 400, description: 'Campos obrigatórios faltando' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() body: any) {
    if (!body.order_id || !body.product_id || body.quantity == null) {
      throw new BadRequestException(
        'order_id, product_id and quantity are required',
      );
    }

    const product = await this.prismaService.product.findUnique({
      where: { id: body.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data: Prisma.order_productCreateInput = {
      quantity: Number(body.quantity),
      gross_amount: Number(product.unit_price) * Number(body.quantity),

      order: {
        connect: { id: body.order_id },
      },

      product: {
        connect: { id: body.product_id },
      },
    };

    return this.orderProductService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto do cômodo (recalcula gross_amount)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderProductDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado', type: OrderProductResponseDto })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const existing = await this.orderProductService.findOne(id);

    const productId = body.product_id ?? existing.product_id;
    const quantity =
      body.quantity !== undefined ? Number(body.quantity) : existing.quantity;

    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data: Prisma.order_productUpdateInput = {
      quantity,
      gross_amount: Number(product.unit_price) * Number(quantity),

      ...(body.product_id && {
        product: { connect: { id: body.product_id } },
      }),

      ...(body.order_id && {
        order: { connect: { id: body.order_id } },
      }),
    };

    return this.orderProductService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produto do cômodo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Produto removido' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.orderProductService.delete(id);
  }
}
