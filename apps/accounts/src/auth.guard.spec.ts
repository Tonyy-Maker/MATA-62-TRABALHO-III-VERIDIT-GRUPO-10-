import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { TokenRepository } from './interfaces/token-repository.interface.js';
import { JwtService } from './jwt.service.js';
import { UserType } from './enums/user-type.enum.js';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockTokenRepo: TokenRepository;
  const jwtService = new JwtService();

  const createMockContext = (authHeader?: string) => {
    const request: any = {
      headers: authHeader !== undefined ? { authorization: authHeader } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      request,
    };
  };

  beforeEach(() => {
    mockTokenRepo = {
      isRevoked: vi.fn().mockReturnValue(false),
      revoke: vi.fn(),
    };
    guard = new AuthGuard(mockTokenRepo);
  });

  it('should allow valid bearer token that is not revoked', () => {
    const token = jwtService.sign({
      sub: 'u1',
      email: 'test@example.com',
      type: UserType.COMMON,
    });

    const { switchToHttp, request } = createMockContext(`Bearer ${token}`);
    const result = guard.canActivate({ switchToHttp } as unknown as ExecutionContext);

    expect(result).toBe(true);
    expect(request.user).toBeDefined();
    expect(request.user.sub).toBe('u1');
    expect(request.user.email).toBe('test@example.com');
  });

  it('should throw UnauthorizedException if header does not start with Bearer', () => {
    const { switchToHttp } = createMockContext('Basic 123456');

    expect(() => guard.canActivate({ switchToHttp } as unknown as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if header is missing', () => {
    const { switchToHttp } = createMockContext(undefined);

    expect(() => guard.canActivate({ switchToHttp } as unknown as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const { switchToHttp } = createMockContext('Bearer invalid.jwt.token');

    expect(() => guard.canActivate({ switchToHttp } as unknown as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is revoked', () => {
    vi.mocked(mockTokenRepo.isRevoked).mockReturnValue(true);

    const token = jwtService.sign({
      sub: 'u2',
      email: 'revoked@example.com',
      type: UserType.COMMON,
    });

    const { switchToHttp } = createMockContext(`Bearer ${token}`);

    expect(() => guard.canActivate({ switchToHttp } as unknown as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });
});
