import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto.js';
import { JsonAccountsRepository } from './json-accounts.repository.js';
import { PasswordHasher } from './interfaces/password-hasher.interface.js';
import { AccountResponseDto } from './dtos/account-response.dto.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';


@Injectable()
export class AuthService {
  private _accountsRepository = new JsonAccountsRepository()
  private _passwordHasher: PasswordHasher = {
    hash(password: string) {
      return password
    },
    compare(password: string, hash: string) {
      return hash == this.hash(password)
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const account = await this._accountsRepository.findByEmail(loginDto.email)
    if (!account) throw new UnauthorizedException('Email e/ou senha, inválidos!')
    
    const correctPassword = this._passwordHasher.compare(loginDto.password, account.passwordHash)
    if (!correctPassword) throw new UnauthorizedException('Email e/ou senha, inválidos!')
    
    /* TODO: Implementar JwtService */

    return AuthResponseDto.create('accessToken', 'type', 0, AccountResponseDto.create(account))
  }

  logout(token: string): void {}
}