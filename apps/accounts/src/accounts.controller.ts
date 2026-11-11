import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateAccountDto, type CreateAccountReq } from './dtos/create-account.dto.js';
import { AccountsService } from './accounts.service.js';
import { AccountResponseDto } from './dtos/account-response.dto.js';

@Controller()
export class AccountsController {
  constructor(private readonly createAccountService: AccountsService) {}

  @Get()
  get(): string {
    return 'Hello World!!!';
  }

  @Post('accounts')
  async create(@Body() createAccountReq: CreateAccountReq): Promise<AccountResponseDto> {
    const dto = CreateAccountDto.create(createAccountReq);
    if (!dto) throw new BadRequestException('Dados inválidos!');

    const account = await this.createAccountService.createAccount(dto);

    return AccountResponseDto.create(account);
  }
}
