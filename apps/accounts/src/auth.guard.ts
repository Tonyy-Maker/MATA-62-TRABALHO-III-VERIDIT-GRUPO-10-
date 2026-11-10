import { Inject, Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "./jwt.service.js"
import { JwtPayload } from "./interfaces/jwt-payload.interface.js";
import * as TokenRepository from "./interfaces/token-repository.interface.js";
import { Request } from "express";

export type AuthenticatedRequest = Request & { user: JwtPayload };

type TokenRepository = TokenRepository.TokenRepository
const TOKEN_REPOSITORY = TokenRepository.TOKEN_REPOSITORY

@Injectable()
export class AuthGuard implements CanActivate {
  private _jwtService: JwtService =  new JwtService()
  
  constructor(@Inject(TOKEN_REPOSITORY) private readonly _tokenRepository: TokenRepository) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const [ scheme, token ] = request.headers.authorization?.split(' ') ?? []

    if (scheme !== 'Bearer') throw new UnauthorizedException('Token ausente')

    const payload = this._jwtService.verify(token)
    const revoked = this._tokenRepository.isRevoked(payload.jti)
    if (revoked) throw new UnauthorizedException('Token revogado')
    
    request.user = payload
    return true
  }
}