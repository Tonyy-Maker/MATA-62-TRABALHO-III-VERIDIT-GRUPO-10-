import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { AccountRepository } from './accounts.repository.js';

@Injectable()
export class CreateAccountService {
  private _repository = new AccountRepository()

  create(createAccountDto: CreateAccountDto): string {
    console.log(createAccountDto)
    this._repository.save(createAccountDto)
    return 'Hello World!';
  }
}
