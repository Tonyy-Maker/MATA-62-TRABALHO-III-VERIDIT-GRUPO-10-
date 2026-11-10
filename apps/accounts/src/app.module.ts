import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { TOKEN_REPOSITORY } from './interfaces/token-repository.interface.js';
import { InMemoryTokenRepository } from './inmemory-token.repository.js';

@Module({
  imports: [],
  controllers: [AccountsController, AuthController],
  providers: [
    AccountsService,
    AuthService,
    AuthGuard,
    { provide: TOKEN_REPOSITORY, useClass: InMemoryTokenRepository }
  ],
})
export class AppModule {}
