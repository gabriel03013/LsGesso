import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // * LOGIN
  async login(email: string, adminCode: string) {
    const user = await this.prisma.employee.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const adminAccess = await this.prisma.admin_access.findFirst({
      where: { employee_id: user.id },
    });

    if (!adminAccess) {
      throw new UnauthorizedException('Admin access not found');
    }

    const codeMatches = await bcrypt.compare(
      adminCode,
      adminAccess.admin_code_hash,
    );

    if (!codeMatches) {
      throw new UnauthorizedException('Invalid admin code');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // * JWT
  async sign(payload: { sub: number; email: string }) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
