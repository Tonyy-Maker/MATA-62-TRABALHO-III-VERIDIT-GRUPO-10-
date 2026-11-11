import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';
import { Account } from './models/account.model.js';
import { UserType } from './enums/user-type.enum.js';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            createAccount: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<AccountsController>(AccountsController);
    service = app.get<AccountsService>(AccountsService);
  });

  describe('root', () => {
    it('should return "Hello World!!!"', () => {
      expect(controller.get()).toBe('Hello World!!!');
    });
  });

  describe('create (POST /accounts)', () => {
    it('should create account and return AccountResponseDto', async () => {
      const mockCreated = new Account(
        'uuid-123',
        'Ana Paula',
        'ana@example.com',
        'hash123',
        '52998224725',
        null,
        UserType.COMMON,
        new Date('2026-11-10T12:00:00Z'),
      );

      vi.mocked(service.createAccount).mockResolvedValue(mockCreated);

      const response = await controller.create({
        name: 'Ana Paula',
        email: 'ana@example.com',
        password: 'password123',
        cpf: '52998224725',
        type: 'COMMON',
      });

      expect(response).toBeDefined();
      expect(response.id).toBe('uuid-123');
      expect(response.email).toBe('ana@example.com');
      expect((response as any).passwordHash).toBeUndefined();
    });

    it('should throw BadRequestException when request payload is invalid', async () => {
      await expect(
        controller.create({
          name: '',
          email: 'invalid',
          password: '12',
          cpf: '123',
          type: 'INVALID',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
