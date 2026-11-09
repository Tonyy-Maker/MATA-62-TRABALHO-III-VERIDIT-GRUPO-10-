import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [],
  controllers: [AccountsController, AuthController],
  providers: [AccountsService, AuthService],
})
export class AppModule {}
