import { AccountResponseDto } from "./account-response.dto.js"

export class AuthResponseDto {
    private constructor(
        readonly accessToken: string,
        readonly tokenType: string,
        readonly expiresIn: number,
        readonly accountResponseDto: AccountResponseDto
    ) {}

    static create(accessToken: string, tokenType: string, expiresIn: number, accountResponseDto: AccountResponseDto): AuthResponseDto {
        return new AuthResponseDto(accessToken, tokenType, expiresIn, accountResponseDto)
    }
}