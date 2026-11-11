import { describe, expect, it, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login.dto.js';
import { UserType } from './enums/user-type.enum.js';
import { TokenRepository } from './interfaces/token-repository.interface.js';

describe('AuthService', () => {
  let service: AuthService;
  let mockTokenRepo: TokenRepository;

  const mockAccount = {
    id: 'user-uuid-1',
    name: 'Roberto Santos',
    email: 'roberto@example.com',
    passwordHash: 'secretPass123',
    cpf: '52998224725',
    oab: null,
    type: UserType.COMMON,
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockTokenRepo = {
      isRevoked: vi.fn(),
      revoke: vi.fn(),
    };
    service = new AuthService(mockTokenRepo);
  });

  describe('login (REQ 03)', () => {
    it('should authenticate successfully with correct credentials', async () => {
      const loginDto = LoginDto.create({
        email: 'roberto@example.com',
        password: 'secretPass123',
      });
      expect(loginDto).not.toBeNull();

      const mockAccountsRepo = {
        findByEmail: vi.fn().mockResolvedValue(mockAccount),
      };
      (service as any)._accountsRepository = mockAccountsRepo;

      const response = await service.login(loginDto!);

      expect(response).toBeDefined();
      expect(response.accessToken).toBeDefined();
      expect(response.tokenType).toBe('Bearer');
      expect(response.expiresIn).toBe(1200);
      expect(response.accountResponseDto.id).toBe(mockAccount.id);
      expect(response.accountResponseDto.email).toBe(mockAccount.email);
    });

    it('should throw UnauthorizedException if account does not exist', async () => {
      const loginDto = LoginDto.create({
        email: 'nobody@example.com',
        password: 'secretPass123',
      });

      const mockAccountsRepo = {
        findByEmail: vi.fn().mockResolvedValue(undefined),
      };
      (service as any)._accountsRepository = mockAccountsRepo;

      await expect(service.login(loginDto!)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const loginDto = LoginDto.create({
        email: 'roberto@example.com',
        password: 'wrongPassword',
      });

      const mockAccountsRepo = {
        findByEmail: vi.fn().mockResolvedValue(mockAccount),
      };
      (service as any)._accountsRepository = mockAccountsRepo;

      await expect(service.login(loginDto!)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout (REQ 04)', () => {
    it('should call tokenRepository.revoke with provided token', () => {
      service.logout('sample-token-string');
      expect(mockTokenRepo.revoke).toHaveBeenCalledWith('sample-token-string');
    });
  });
});
