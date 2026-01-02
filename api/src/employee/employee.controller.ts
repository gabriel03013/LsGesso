import { Controller, Body, Param, Query, Get, Post, Patch, Delete, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Prisma, employee as Employee } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // * BASIC CRUD
  
  // Find all
  @Get()
  async findAll() : Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  // Find one
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id : number) : Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  // Create
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body : Prisma.employeeCreateInput) : Promise<Employee> {
    return this.employeeService.create(body);
  }

  // Update
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id : number, @Body() body : Prisma.employeeUpdateInput) : Promise<Employee> {
    return this.employeeService.update(id, body);
  }

  // Delete
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id : number) : Promise<void> {
    await this.employeeService.delete(id);
  }

  // * FRONTEND-FRIENDLY METHODS

  // Find admins with complete orders details or not
  @Get("admin")
  async findAllAdmins(@Query("withOrders") withOrders : boolean = false) : Promise<Employee[]> {
    return this.employeeService.findAllAdmins(withOrders);
  }

  // Find one admin with complete orders details or not
  @Get("admin/:id")
  async findAdmin(@Param("id", ParseIntPipe) id : number, @Query("withOrders") withOrders : boolean = false) : Promise<Employee> {
    return this.employeeService.findAdmin(id, withOrders);
  }
}