import { UserType } from '../enums/user-type.enum.js';
import { Account } from '../models/account.model.js';

export class AccountResponseDto {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly oab: string | null,
    readonly type: UserType,
    readonly createAt: Date,
  ) {}

  static create(account: Account): AccountResponseDto {
    const { id, name, email, cpf, oab, type, createdAt } = account;

    return new AccountResponseDto(id, name, email, cpf, oab, type, createdAt);
  }
}
