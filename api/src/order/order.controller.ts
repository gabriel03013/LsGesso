import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { OrderResponseDto, CreateOrderDto, UpdateOrderDto } from './dto/order-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Cômodos (Orders)')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cômodos de um pedido' })
  @ApiQuery({ name: 'completeOrderId', type: Number, required: false, description: 'Filtrar por pedido completo' })
  @ApiResponse({ status: 200, description: 'Lista de cômodos', type: [OrderResponseDto] })
  async findAll(
    @Query('completeOrderId', ParseIntPipe) completeOrderId?: number,
  ) {
    return this.orderService.findAll(completeOrderId ?? undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cômodo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cômodo encontrado', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Cômodo não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar cômodo vinculado a um pedido' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Cômodo criado', type: OrderResponseDto })
  async create(@Body() data: Prisma.orderCreateInput) {
    return this.orderService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cômodo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Cômodo atualizado', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Cômodo não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.orderUpdateInput,
  ) {
    return this.orderService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar cômodo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Cômodo deletado' })
  @ApiResponse({ status: 404, description: 'Cômodo não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.delete(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Buscar cômodo com detalhes dos produtos' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cômodo com produtos' })
  @ApiResponse({ status: 404, description: 'Cômodo não encontrado' })
  async findOneWithProductDetails(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOneWithProductDetails(id);
  }
}
