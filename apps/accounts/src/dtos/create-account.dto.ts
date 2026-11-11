import { UserType } from '../enums/user-type.enum.js';
import {
  isValidCpf,
  isValidEmail,
  isValidName,
  isValidOab,
  isValidPassword,
  normalizeCpf,
  normalizeOab,
} from '../validators/validators.js';

export type CreateAccountReq = {
  name: string;
  email: string;
  password: string;
  cpf: string;
  oab?: string;
  type: string;
};

export class CreateAccountDto {
  private constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly cpf: string,
    readonly oab: string | null,
    readonly type: UserType,
  ) {}

  static create(createAccountReq: CreateAccountReq): CreateAccountDto | null {
    if (!createAccountReq || typeof createAccountReq !== 'object') return null;

    const { name, email, password, cpf, oab, type } = createAccountReq;

    if (!isValidName(name)) return null;
    if (!isValidEmail(email)) return null;
    if (!isValidPassword(password)) return null;
    if (!isValidCpf(cpf)) return null;
    if (typeof type !== 'string' || (type !== 'COMMON' && type !== 'LAWYER')) return null;

    const userType = UserType[type];

    if (userType === UserType.LAWYER) {
      if (!isValidOab(oab)) return null;
      return new CreateAccountDto(
        name.trim(),
        email.trim().toLowerCase(),
        password,
        normalizeCpf(cpf),
        normalizeOab(oab),
        userType,
      );
    }

    return new CreateAccountDto(
      name.trim(),
      email.trim().toLowerCase(),
      password,
      normalizeCpf(cpf),
      null,
      userType,
    );
  }
}
