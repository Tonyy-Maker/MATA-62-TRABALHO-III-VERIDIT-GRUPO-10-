import { isValidEmail } from '../validators/validators.js';

export type LoginReq = {
  email: string;
  password: string;
};

export class LoginDto {
  private constructor(
    readonly email: string,
    readonly password: string,
  ) {}

  static create(loginReq: LoginReq): LoginDto | null {
    if (!loginReq || typeof loginReq !== 'object') return null;

    const { email, password } = loginReq;

    if (!isValidEmail(email)) return null;
    if (typeof password !== 'string' || password.length === 0) return null;

    return new LoginDto(email.trim().toLowerCase(), password);
  }
}
