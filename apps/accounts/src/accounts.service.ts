import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { JsonAccountsRepository } from './json-accounts.repository.js';
import { Account } from './models/account.model.js';
import { randomUUID } from 'node:crypto';
import { UserType } from './enums/user-type.enum.js';
import { PasswordHasher } from './interfaces/password-hasher.interface.js';
import { PassThrough } from 'node:stream';

@Injectable()
export class AccountsService {
  private _repository = new JsonAccountsRepository()
  private _passwordHasher: PasswordHasher = {
    hash(password: string) {
      return password
    },
    compare(password) {
      return password == this.hash(password)
    }
  }

  private _uuidGenerator = () => randomUUID()

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { name, email, password, cpf, oab, type } = createAccountDto

    const sameEmailAcc = await this._repository.findByEmail(email)
    if (sameEmailAcc) throw new ConflictException("The given email is already being used.")

    /* TODO: 
    implementar aqui chamada a serviço externo que valida
    se o email existe.
    */

    const sameCpfAcc = await this._repository.findByCpf(cpf)
    if (sameCpfAcc) throw new ConflictException("The given CPF is already being used.")

    /* TODO: 
    implementar aqui chamada a serviço externo que valida
    se o cpf existe e pertence a pessoa cadastrada.
    */

    let account: Account
    if (type == UserType.LAWYER) {
      let oabIsValid: boolean
      if (typeof(oab) !== 'string') {
        oabIsValid = false
      } else {
        oabIsValid = true
      }
      /* TODO: 
      implementar aqui chamada a serviço externo que valida
      o numero da OAB no que diz respeito a existencia e ao
      pertencimento a pessoa que foi informada.
      */
      if (!oabIsValid) throw new BadRequestException('The given OAB is invalid.')
      
      account = new Account(
        this._uuidGenerator(),
        name,
        email,
        this._passwordHasher.hash(password),
        cpf,
        oab,
        type,
        new Date()
      )
    } else {
      account = new Account(
        this._uuidGenerator(),
        name,
        email,
        this._passwordHasher.hash(password),
        cpf,
        null,
        type,
        new Date()
      )
    }

    this._repository.create(account)
    return account
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    return await this._repository.findByEmail(email)
  }
}
