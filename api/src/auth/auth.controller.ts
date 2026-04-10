import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, LoginResponseDto, MeResponseDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login com email e código admin' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Cookie access_token setado.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, adminCode } = body;    
    
    const result = await this.authService.login(email, adminCode);

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, user } = result;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return {
      user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout — limpa o cookie de autenticação' })
  @ApiResponse({ status: 200, description: 'Logout realizado' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário autenticado', type: MeResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async me(@Req() req) {
    return req.user;
  }
}
