export interface TokenRepository {
    isRevoked: (jti: string) => boolean
    revoke: (jti: string) => void
}