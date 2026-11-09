import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { JsonAccountsRepository } from './json-accounts.repository.js';
import { Account } from './models/account.model.js';
import { randomUUID } from 'node:crypto';
import { UserType } from './enums/user-type.enum.js';

@Injectable()
export class AccountsService {
  private _repository = new JsonAccountsRepository()
  private _passwordHasher = (password: string) => password
  private _uuidGenerator = () => randomUUID()

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    console.log(createAccountDto)

    const { name, email, password, cpf, oab, type } = createAccountDto

    const sameEmailAcc = await this._repository.findByEmail(email)
    if (sameEmailAcc) {
      throw new Error("Already used email!")
    }

    const sameCpfAcc = await this._repository.findByCpf(cpf)
    if (sameCpfAcc) {
      throw new Error("Already used CPF!")
    }

    let account: Account
    if (type == UserType.LAWYER) {
      //const oabIsValid = validateOAB()
      //if (!oabIsValid) { throw error }
      //else {}
      throw new Error("UserType Lawyer not implemented!")
    } else {
      account = new Account(
        this._uuidGenerator(),
        name,
        email,
        this._passwordHasher(password),
        cpf,
        null,
        type,
        new Date()
      )

      this._repository.create(account)

      return account
    }
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    return await this._repository.findByEmail(email)
  }
}
