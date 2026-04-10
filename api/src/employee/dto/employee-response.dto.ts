import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'joao@lsgesso.com' })
  email: string;

  @ApiPropertyOptional({ example: '11999999999' })
  phone: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo: string | null;

  @ApiPropertyOptional({ example: '1990-01-15' })
  birth_date: Date | null;

  @ApiPropertyOptional({ example: '2023-06-01' })
  hire_date: Date | null;

  @ApiPropertyOptional({ example: 'Admin', enum: ['Admin', 'Funcionário'] })
  role: string | null;

  @ApiPropertyOptional({ example: 'M', enum: ['M', 'F'] })
  gender: string | null;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  cpf: string | null;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  rg: string | null;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  address: string | null;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'joao@lsgesso.com' })
  email: string;

  @ApiPropertyOptional({ example: '11999999999' })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  birth_date?: string;

  @ApiPropertyOptional({ example: '2023-06-01' })
  hire_date?: string;

  @ApiPropertyOptional({ example: 'Funcionário' })
  role?: string;

  @ApiPropertyOptional({ example: 'M' })
  gender?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  cpf?: string;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  rg?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  address?: string;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  name?: string;

  @ApiPropertyOptional({ example: 'joao@lsgesso.com' })
  email?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo?: string;

  @ApiPropertyOptional({ example: 'Admin' })
  role?: string;
}
