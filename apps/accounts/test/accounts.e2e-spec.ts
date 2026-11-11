import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AppModule } from '../src/app.module.js';
import { UserType } from '../src/enums/user-type.enum.js';

describe('Accounts (e2e) - REQ 01', () => {
  let app: INestApplication<App>;
  let tempAccountsPath: string;

  const validCpf = '52998224725';
  const secondValidCpf = '11144477735';

  beforeAll(async () => {
    tempAccountsPath = path.join(
      os.tmpdir(),
      `accounts-dev-e2e-${Date.now()}-${Math.random().toString(36).substring(7)}.json`,
    );
    process.env.ACCOUNTS_FILE_PATH = tempAccountsPath;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await fs.writeFile(tempAccountsPath, '[]', 'utf-8');
  });

  afterAll(async () => {
    await app.close();
    try {
      await fs.unlink(tempAccountsPath);
    } catch {
      // ignore
    }
  });

  it('POST /accounts should register a COMMON user with HTTP 201 Created', async () => {
    const payload = {
      name: 'João Santos',
      email: 'joao.santos@example.com',
      password: 'password123',
      cpf: validCpf,
      type: 'COMMON',
    };

    const response = await request(app.getHttpServer()).post('/accounts').send(payload).expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(payload.name);
    expect(response.body.email).toBe(payload.email);
    expect(response.body.type).toBe(UserType.COMMON);
    expect(response.body.cpf).toBe(validCpf);
    expect(response.body.passwordHash).toBeUndefined();
    expect(response.body.password).toBeUndefined();
  });

  it('POST /accounts should register a LAWYER user with valid OAB with HTTP 201 Created', async () => {
    const payload = {
      name: 'Dra. Roberta Dias',
      email: 'roberta@advocacia.com',
      password: 'securePass123',
      cpf: validCpf,
      type: 'LAWYER',
      oab: '123456/BA',
    };

    const response = await request(app.getHttpServer()).post('/accounts').send(payload).expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.type).toBe(UserType.LAWYER);
    expect(response.body.oab).toBe('BA123456');
  });

  it('POST /accounts should return HTTP 400 Bad Request when required fields are missing', async () => {
    const invalidPayload = {
      name: '',
      email: 'bad',
      password: '123',
      cpf: 'invalid',
    };

    await request(app.getHttpServer()).post('/accounts').send(invalidPayload).expect(400);
  });

  it('POST /accounts should return HTTP 400 Bad Request when LAWYER lacks valid OAB', async () => {
    const invalidLawyerPayload = {
      name: 'Advogado Sem OAB',
      email: 'adv@example.com',
      password: 'password123',
      cpf: validCpf,
      type: 'LAWYER',
      oab: 'INVALIDA',
    };

    await request(app.getHttpServer()).post('/accounts').send(invalidLawyerPayload).expect(400);
  });

  it('POST /accounts should return HTTP 409 Conflict when email is already registered', async () => {
    const payload = {
      name: 'Primeiro Cadastro',
      email: 'duplicado@example.com',
      password: 'password123',
      cpf: validCpf,
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/accounts').send(payload).expect(201);

    const duplicatePayload = {
      name: 'Segundo Cadastro',
      email: 'duplicado@example.com',
      password: 'password999',
      cpf: secondValidCpf,
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/accounts').send(duplicatePayload).expect(409);
  });

  it('POST /accounts should return HTTP 409 Conflict when CPF is already registered', async () => {
    const payload = {
      name: 'Primeiro Cadastro',
      email: 'email1@example.com',
      password: 'password123',
      cpf: validCpf,
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/accounts').send(payload).expect(201);

    const duplicatePayload = {
      name: 'Segundo Cadastro',
      email: 'email2@example.com',
      password: 'password999',
      cpf: validCpf,
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/accounts').send(duplicatePayload).expect(409);
  });
});
