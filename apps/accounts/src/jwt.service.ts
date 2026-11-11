// jwt.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwt } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';

@Injectable()
export class JwtService {
  private readonly _secret = process.env.JWT_SECRET;
  private readonly _jwt = new NestJwt();
  readonly expiresInSeconds = Number(process.env.JWT_EXPIRATION ?? '1200');

  constructor() {
    if (!this._secret || this._secret.length < 32) {
      throw new Error('JWT_SECRET ausente ou fraco (mín. 32 caracteres)');
    }
  }

  sign(data: Pick<JwtPayload, 'sub' | 'email' | 'type'>): string {
    const payload = { email: data.email, type: data.type };
    return this._jwt.sign(payload, {
      algorithm: 'HS256',
      subject: data.sub,
      jwtid: randomUUID(),
      expiresIn: this.expiresInSeconds,
      secret: this._secret,
    });
  }

  verify(token: string): JwtPayload {
    try {
      return this._jwt.verify(token, {
        algorithms: ['HS256'],
        secret: this._secret,
      }) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
