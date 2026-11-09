import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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
      if (typeof(oab) !== 'string') oabIsValid = false
      /* TODO: 
      implementar aqui chamada a serviço externo que valida
      o numero da OAB no que diz respeito a existencia e ao
      pertencimento a pessoa que foi informada.
      */
      oabIsValid = true
      if (!oabIsValid) throw new BadRequestException('The given OAB number is invalid.')
      
      account = new Account(
        this._uuidGenerator(),
        name,
        email,
        this._passwordHasher(password),
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
        this._passwordHasher(password),
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
