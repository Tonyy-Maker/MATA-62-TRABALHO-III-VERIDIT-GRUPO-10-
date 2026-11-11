import { UserType } from '../enums/user-type.enum.js';

export interface JwtPayload {
  sub: string;
  email: string;
  type: UserType;
  iat: number;
  exp: number;
  jti: string;
}
