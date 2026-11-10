export const TOKEN_REPOSITORY = Symbol('TOKEN_REPOSITORY')

export interface TokenRepository {
    isRevoked: (jti: string) => boolean
    revoke: (jti: string) => void
}