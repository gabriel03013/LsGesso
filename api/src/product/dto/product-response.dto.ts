import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo: string | null;

  @ApiProperty({ example: 'Placa de Gesso' })
  name: string;

  @ApiProperty({ example: 25.5 })
  unit_price: number;

  @ApiPropertyOptional({ example: 'm²' })
  measure: string | null;

  @ApiPropertyOptional({ example: 'Produto', enum: ['Produto', 'Serviço'] })
  type: string | null;
}

export class CreateProductDto {
  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo?: string;

  @ApiProperty({ example: 'Placa de Gesso' })
  name: string;

  @ApiProperty({ example: 25.5 })
  unit_price: number;

  @ApiPropertyOptional({ example: 'm²' })
  measure?: string;

  @ApiPropertyOptional({ example: 'Produto', enum: ['Produto', 'Serviço'] })
  type?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo?: string;

  @ApiPropertyOptional({ example: 'Placa de Gesso Premium' })
  name?: string;

  @ApiPropertyOptional({ example: 30.0 })
  unit_price?: number;

  @ApiPropertyOptional({ example: 'm²' })
  measure?: string;

  @ApiPropertyOptional({ example: 'Produto', enum: ['Produto', 'Serviço'] })
  type?: string;
}
