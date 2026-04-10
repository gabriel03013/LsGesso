import { Controller, Body, Param, Query, Get, Post, Patch, Delete, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee-response.dto';
import { Prisma, employee as Employee } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Funcionários')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários', type: [EmployeeResponseDto] })
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get('admin')
  @ApiOperation({ summary: 'Listar funcionários admin' })
  @ApiQuery({ name: 'withOrders', required: false, type: Boolean, description: 'Incluir pedidos do admin' })
  @ApiResponse({ status: 200, description: 'Lista de admins', type: [EmployeeResponseDto] })
  async findAllAdmins(@Query('withOrders') withOrders: boolean = false): Promise<Employee[]> {
    return this.employeeService.findAllAdmins(withOrders);
  }

  @Get('admin/:id')
  @ApiOperation({ summary: 'Buscar admin por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'withOrders', required: false, type: Boolean, description: 'Incluir pedidos do admin' })
  @ApiResponse({ status: 200, description: 'Admin encontrado', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Admin não encontrado' })
  async findAdmin(@Param('id', ParseIntPipe) id: number, @Query('withOrders') withOrders: boolean = false): Promise<Employee> {
    return this.employeeService.findAdmin(id, withOrders);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar funcionário por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar funcionário' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ status: 201, description: 'Funcionário criado', type: EmployeeResponseDto })
  async create(@Body() body: Prisma.employeeCreateInput): Promise<Employee> {
    return this.employeeService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar funcionário' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ status: 200, description: 'Funcionário atualizado', type: EmployeeResponseDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Prisma.employeeUpdateInput): Promise<Employee> {
    return this.employeeService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar funcionário' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Funcionário deletado' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.employeeService.delete(id);
  }
}
