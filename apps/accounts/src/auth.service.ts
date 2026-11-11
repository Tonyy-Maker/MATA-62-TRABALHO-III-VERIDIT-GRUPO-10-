import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto.js';
import { JsonAccountsRepository } from './json-accounts.repository.js';
import { PasswordHasher } from './interfaces/password-hasher.interface.js';
import { AccountResponseDto } from './dtos/account-response.dto.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { JwtService } from './jwt.service.js';
import * as TokenRepository from './interfaces/token-repository.interface.js';

const TOKEN_REPOSITORY = TokenRepository.TOKEN_REPOSITORY;
type TokenRepository = TokenRepository.TokenRepository;

@Injectable()
export class AuthService {
  private _accountsRepository = new JsonAccountsRepository();
  private _passwordHasher: PasswordHasher = {
    hash(password: string) {
      return password;
    },
    compare(password: string, hash: string) {
      return hash == this.hash(password);
    },
  };
  private _jwtService: JwtService = new JwtService();

  constructor(@Inject(TOKEN_REPOSITORY) private readonly _tokenRepository: TokenRepository) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const account = await this._accountsRepository.findByEmail(loginDto.email);
    if (!account) throw new UnauthorizedException('Email e/ou senha, inválidos!');

    const correctPassword = this._passwordHasher.compare(loginDto.password, account.passwordHash);
    if (!correctPassword) throw new UnauthorizedException('Email e/ou senha, inválidos!');

    const accessToken = this._jwtService.sign({
      sub: account.id,
      email: account.email,
      type: account.type,
    });

    return AuthResponseDto.create(
      accessToken,
      'Bearer',
      this._jwtService.expiresInSeconds,
      AccountResponseDto.create(account),
    );
  }

  logout(token: string): void {
    this._tokenRepository.revoke(token);
  }
}
