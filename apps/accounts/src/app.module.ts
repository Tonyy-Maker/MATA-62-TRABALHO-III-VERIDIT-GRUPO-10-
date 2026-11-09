import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { CreateAccountService } from './accounts.service.js';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [CreateAccountService],
})
export class AppModule {}
