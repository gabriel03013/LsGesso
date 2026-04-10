import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@lsgesso.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  adminCode: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      email: 'admin@lsgesso.com',
      name: 'Admin',
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export class MeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin@lsgesso.com' })
  email: string;
}
