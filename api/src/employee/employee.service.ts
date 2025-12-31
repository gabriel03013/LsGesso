import { Injectable, NotFoundException } from '@nestjs/common';
import { employee as Employee, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  // * BASIC CRUD

  // Find all
  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  // Find one
  async findOne(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee)
      throw new NotFoundException(`Employee with id ${id} not found`);
    return employee;
  }

  // Create
  async create(data: Prisma.employeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  // Update
  async update(
    id: number,
    data: Prisma.employeeUpdateInput,
  ): Promise<Employee> {
    try {
      return await this.prisma.employee.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Employee with id ${id} not found`);
      }
      throw error;
    }
  }

  // Delete
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.employee.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Employee with id ${id} not found`);
      }
      throw error;
    }
  }

  // * FRONTEND-FRIENDLY METHODS

  // Find admins with complete orders details or not
  async findAllAdmins(withOrders: boolean = false): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: {
        role: 'Admin',
      },
      include: {
        complete_order: withOrders,
      },
    });
  }

  // Find one admin with complete orders details or not
  async findAdmin(id: number, withOrders: boolean = false): Promise<Employee> {
    const admin = await this.prisma.employee.findUnique({
      where: { id },
      include: { complete_order: withOrders },
    });

    if (!admin) throw new NotFoundException(`Admin with id ${id} not found`);
    return admin;
  }
}
