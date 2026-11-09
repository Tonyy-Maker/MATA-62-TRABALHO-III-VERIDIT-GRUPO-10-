import { TokenRepository } from "./interfaces/token-repository.interface.js";

export class InMemoryTokenRepository implements TokenRepository {
    private _tokens = new Map<string, string>()

    isRevoked(jti: string): boolean {
        return true
    }

    revoke(jti: string): void {
        return
    }
}