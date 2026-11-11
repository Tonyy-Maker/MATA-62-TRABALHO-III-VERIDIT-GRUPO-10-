import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';

describe('AppController', () => {
  let appController: AccountsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService],
    }).compile();

    appController = app.get<AccountsController>(AccountsController);
  });

  describe('root', () => {
    it('should return "Hello World!!!"', () => {
      expect(appController.get()).toBe('Hello World!!!');
    });
  });
});
