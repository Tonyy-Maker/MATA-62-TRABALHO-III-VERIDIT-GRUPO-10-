import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { AccountResponseDto } from './dtos/account-response.dto.js';
import { UserType } from './enums/user-type.enum.js';
import { TOKEN_REPOSITORY } from './interfaces/token-repository.interface.js';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: vi.fn(),
            logout: vi.fn(),
          },
        },
        {
          provide: TOKEN_REPOSITORY,
          useValue: {
            isRevoked: vi.fn(),
            revoke: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    service = app.get<AuthService>(AuthService);
  });

  describe('root', () => {
    it('should return "Auth"', () => {
      expect(controller.get()).toBe('Auth');
    });
  });

  describe('login (POST /auth/login)', () => {
    it('should login and return AuthResponseDto', async () => {
      const mockAuthResponse = AuthResponseDto.create(
        'jwt-token-xyz',
        'Bearer',
        1200,
        new AccountResponseDto(
          'user-1',
          'Maria Silva',
          'maria@example.com',
          '52998224725',
          null,
          UserType.COMMON,
          new Date(),
        ),
      );

      vi.mocked(service.login).mockResolvedValue(mockAuthResponse);

      const response = await controller.login({
        email: 'maria@example.com',
        password: 'password123',
      });

      expect(response).toEqual(mockAuthResponse);
    });

    it('should throw BadRequestException when login request is invalid', async () => {
      await expect(
        controller.login({
          email: 'invalid-email',
          password: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout (POST /auth/logout)', () => {
    it('should call authService.logout with req.user.jti', () => {
      const mockReq: any = {
        user: {
          sub: 'user-1',
          jti: 'token-jti-123',
        },
      };

      controller.logout(mockReq);
      expect(service.logout).toHaveBeenCalledWith('token-jti-123');
    });
  });
});
