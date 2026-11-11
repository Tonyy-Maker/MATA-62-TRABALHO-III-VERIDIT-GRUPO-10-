import { UserType } from '../enums/user-type.enum.js';

export class Account {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly passwordHash: string,
    readonly cpf: string,
    readonly oab: string | null,
    readonly type: UserType,
    readonly createdAt: Date,
  ) {
    if (type == UserType.LAWYER && !oab)
      throw new Error('Should give a valid OAB number when creating a LAWYER type Account!');
  }
}
