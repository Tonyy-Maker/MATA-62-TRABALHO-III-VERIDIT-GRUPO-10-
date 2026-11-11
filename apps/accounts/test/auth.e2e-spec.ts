import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AppModule } from '../src/app.module.js';

describe('Auth (e2e) - REQ 03 & REQ 04', () => {
  let app: INestApplication<App>;
  let tempAccountsPath: string;

  const validCpf = '52998224725';

  beforeAll(async () => {
    tempAccountsPath = path.join(
      os.tmpdir(),
      `accounts-auth-dev-e2e-${Date.now()}-${Math.random().toString(36).substring(7)}.json`,
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

  describe('POST /auth/login (REQ 03)', () => {
    it('should return HTTP 200 with JWT and account data on valid login', async () => {
      // 1. Register user
      await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: 'Lucas Teste',
          email: 'lucas@example.com',
          password: 'mypassword123',
          cpf: validCpf,
          type: 'COMMON',
        })
        .expect(201);

      // 2. Perform login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'lucas@example.com',
          password: 'mypassword123',
        })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.tokenType).toBe('Bearer');
      expect(response.body.expiresIn).toBe(1200);
      expect(response.body.accountResponseDto).toBeDefined();
      expect(response.body.accountResponseDto.email).toBe('lucas@example.com');
      expect(response.body.accountResponseDto.name).toBe('Lucas Teste');
    });

    it('should return HTTP 400 Bad Request on invalid payload or format', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-an-email', password: '' })
        .expect(400);
    });

    it('should return HTTP 401 Unauthorized for nonexistent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' })
        .expect(401);
    });

    it('should return HTTP 401 Unauthorized for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: 'Lucas Teste',
          email: 'lucas@example.com',
          password: 'correctpassword',
          cpf: validCpf,
          type: 'COMMON',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'lucas@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('POST /auth/logout (REQ 04)', () => {
    it('should successfully logout with valid Bearer token and revoke it for subsequent requests', async () => {
      // 1. Register & login
      await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: 'Usuario Logout',
          email: 'logout@example.com',
          password: 'password123',
          cpf: validCpf,
          type: 'COMMON',
        })
        .expect(201);

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'logout@example.com',
          password: 'password123',
        })
        .expect(200);

      const token = loginRes.body.accessToken;

      // 2. Logout with token (returns 204 No Content)
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // 3. Second logout with same token should fail with 401 Unauthorized (token revoked)
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('should return HTTP 401 Unauthorized when no token is provided', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('should return HTTP 401 Unauthorized when an invalid token is provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-jwt-token')
        .expect(401);
    });
  });
});
