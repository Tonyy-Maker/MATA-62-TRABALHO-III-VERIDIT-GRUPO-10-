export type LoginReq = {
    email: string,
    password: string
}

export class LoginDto {
    private constructor(
        readonly email: string,
        readonly password: string
    ) {}

    static create(loginReq: LoginReq): LoginReq | null {
        const { email, password } = loginReq

        /* TODO: 
        implementar aqui validação específica para os formatos de dados recebidos,
        validação atual é muito generica.
        */
        
        if (typeof(email) !== 'string') return null
        if (typeof(password) !== 'string') return null

        return new LoginDto(email, password)
    }
}