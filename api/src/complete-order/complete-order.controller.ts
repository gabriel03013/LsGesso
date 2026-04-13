import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CompleteOrderService } from './complete-order.service';
import { Prisma, complete_order as CompleteOrder } from '@prisma/client';
import { CompleteOrderStatus } from './enums/complete-order-status.enum';
import { QueryCompleteOrderDto } from './dto/query-complete-order.dto';
import {
  CompleteOrderResponseDto,
  CreateCompleteOrderDto,
  UpdateCompleteOrderDto,
  ChangeStatusDto,
  CompleteOrderSummaryDto,
  CompleteOrderListingDto,
} from './dto/complete-order-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Pedidos Completos')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('complete-order')
export class CompleteOrderController {
  constructor(private readonly completeOrderService: CompleteOrderService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pedidos com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos', type: [CompleteOrderResponseDto] })
  async findAll(@Query() query?: QueryCompleteOrderDto): Promise<CompleteOrder[]> {
    return this.completeOrderService.findAll(query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo dos pedidos (total, pendentes, finalizados)' })
  @ApiResponse({ status: 200, description: 'Resumo', type: CompleteOrderSummaryDto })
  async getSummary() {
    return this.completeOrderService.getSummary();
  }

  @Get('listing')
  @ApiOperation({ summary: 'Lista simplificada para selects (id, order_no, client_name, status) com filtros' })
  @ApiResponse({ status: 200, description: 'Lista simplificada', type: [CompleteOrderListingDto] })
  async findForSelect(@Query() query?: QueryCompleteOrderDto) {
    return this.completeOrderService.findForSelect(query);
  }

  @Get('by-order-no/:order_no')
  @ApiOperation({ summary: 'Buscar pedido pelo número do pedido' })
  @ApiParam({ name: 'order_no', type: Number })
  @ApiResponse({ status: 200, description: 'Pedido encontrado', type: CompleteOrderResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async findByOrderNo(@Param('order_no', ParseIntPipe) order_no: number) {
    return this.completeOrderService.findByOrderNo(order_no);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Buscar pedido com detalhes dos cômodos (orders)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pedido com detalhes' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async findOneWithDetails(@Param('id', ParseIntPipe) id: number): Promise<CompleteOrder> {
    return this.completeOrderService.findOneWithDetails(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pedido encontrado', type: CompleteOrderResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CompleteOrder> {
    return this.completeOrderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar pedido completo' })
  @ApiBody({ type: CreateCompleteOrderDto })
  @ApiResponse({ status: 201, description: 'Pedido criado', type: CompleteOrderResponseDto })
  async create(@Body() body: Prisma.complete_orderCreateInput): Promise<CompleteOrder> {
    return this.completeOrderService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pedido' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCompleteOrderDto })
  @ApiResponse({ status: 200, description: 'Pedido atualizado', type: CompleteOrderResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.complete_orderUpdateInput,
  ): Promise<CompleteOrder> {
    return this.completeOrderService.update(id, body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar status do pedido' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ChangeStatusDto })
  @ApiResponse({ status: 200, description: 'Status alterado', type: CompleteOrderResponseDto })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangeStatusDto,
  ): Promise<CompleteOrder> {
    return this.completeOrderService.changeStatus(id, body.status as CompleteOrderStatus);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar pedido' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Pedido deletado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.completeOrderService.delete(id);
  }
}
