import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { UserType } from './enums/user-type.enum.js';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(() => {
    service = new AccountsService();
  });

  describe('createAccount (REQ 01)', () => {
    it('should create a COMMON account successfully', async () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'password123',
        cpf: '52998224725',
        type: 'COMMON',
      });
      expect(dto).not.toBeNull();

      // Mock repository
      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue(undefined),
        findByCpf: vi.fn().mockResolvedValue(undefined),
        create: vi.fn().mockImplementation((acc) => Promise.resolve(acc)),
      };
      (service as any)._repository = mockRepo;

      const account = await service.createAccount(dto!);

      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.name).toBe('Maria Silva');
      expect(account.email).toBe('maria@example.com');
      expect(account.cpf).toBe('52998224725');
      expect(account.type).toBe(UserType.COMMON);
      expect(account.oab).toBeNull();
      expect(account.createdAt).toBeInstanceOf(Date);
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should create a LAWYER account successfully with valid OAB', async () => {
      const dto = CreateAccountDto.create({
        name: 'Dr. Carlos Souza',
        email: 'carlos@law.com',
        password: 'password123',
        cpf: '52998224725',
        type: 'LAWYER',
        oab: '123456/BA',
      });
      expect(dto).not.toBeNull();

      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue(undefined),
        findByCpf: vi.fn().mockResolvedValue(undefined),
        create: vi.fn().mockImplementation((acc) => Promise.resolve(acc)),
      };
      (service as any)._repository = mockRepo;

      const account = await service.createAccount(dto!);

      expect(account).toBeDefined();
      expect(account.type).toBe(UserType.LAWYER);
      expect(account.oab).toBe('BA123456');
    });

    it('should throw ConflictException when email is already registered', async () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'password123',
        cpf: '52998224725',
        type: 'COMMON',
      });

      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue({ id: 'existing' }),
        findByCpf: vi.fn().mockResolvedValue(undefined),
        create: vi.fn(),
      };
      (service as any)._repository = mockRepo;

      await expect(service.createAccount(dto!)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when CPF is already registered', async () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'password123',
        cpf: '52998224725',
        type: 'COMMON',
      });

      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue(undefined),
        findByCpf: vi.fn().mockResolvedValue({ id: 'existing' }),
        create: vi.fn(),
      };
      (service as any)._repository = mockRepo;

      await expect(service.createAccount(dto!)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return account when found', async () => {
      const mockAccount = { id: 'acc-1', email: 'test@example.com' };
      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue(mockAccount),
      };
      (service as any)._repository = mockRepo;

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockAccount);
    });

    it('should return undefined when account not found', async () => {
      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue(undefined),
      };
      (service as any)._repository = mockRepo;

      const result = await service.findByEmail('unknown@example.com');
      expect(result).toBeUndefined();
    });
  });
});
