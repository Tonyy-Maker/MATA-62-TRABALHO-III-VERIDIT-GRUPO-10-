import { Controller, Req, Get, Post, Body, HttpCode, BadRequestException, UseGuards } from '@nestjs/common';
import { LoginDto, type LoginReq } from './dtos/login.dto.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { AuthService } from './auth.service.js';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  get(): string {
    return 'Auth'
  }

  @Post('auth/login')
  async login(@Body() loginReq: LoginReq): Promise<AuthResponseDto> {
    const dto = LoginDto.create(loginReq)
    if (!dto) throw new BadRequestException('Dados inválidos!')

    const response = await this.authService.login(dto)
    
    return response
  }

  @Post('auth/logout')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  logout(@Req() req: AuthenticatedRequest): void {
    this.authService.logout(req.user.jti)
  }
}