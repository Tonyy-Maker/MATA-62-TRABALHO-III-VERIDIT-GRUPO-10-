import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateAccountDto, type CreateAccountReq } from './dtos/create-account.dto.js';
import { AccountsService } from './accounts.service.js';

@Controller()
export class AccountsController {
  constructor(private readonly createAccountService: AccountsService) {}

  @Get()
  get(): string {
    return 'Hello World!!!'
  }

  @Post('accounts')
  create(@Body() createAccountReq: CreateAccountReq): string {
    const dto = CreateAccountDto.create(createAccountReq)
    if (!dto) throw new BadRequestException('Dados inválidos!')

    const account = this.createAccountService.createAccount(dto)

    return `
    Rota para cadastrar usuario: 
    ${dto?.name ?? 'no name'},
    ${dto?.email ?? 'no email'}
    ${dto?.password ?? 'no password'}
    ${dto?.cpf ?? 'no cpf'}
    ${dto?.oab ?? 'no oab'}
    ${dto?.type ?? 'no type'}
    ${account}
    `
  }
}