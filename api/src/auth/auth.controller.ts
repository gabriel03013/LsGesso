import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; adminCode: string }) {
    const { email, adminCode } = body;

    return this.authService.login(email, adminCode);
  }
}
