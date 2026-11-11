import { TokenRepository } from './interfaces/token-repository.interface.js';

export class InMemoryTokenRepository implements TokenRepository {
  private _revokedTokens = new Set<string>();

  isRevoked(jti: string): boolean {
    return this._revokedTokens.has(jti);
  }

  revoke(jti: string): void {
    this._revokedTokens.add(jti);
  }
}
