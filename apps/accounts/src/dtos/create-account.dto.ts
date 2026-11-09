import { UserType } from '../enums/user-type.enum.js'

export type CreateAccountReq = {
    name: string,
    email: string,
    password: string, 
    cpf: string,
    oab: string,
    type: string
}

export class CreateAccountDto {
    private constructor(
        readonly name: string,
        readonly email: string,
        readonly password: string,
        readonly cpf: string,
        readonly oab: string,
        readonly type: UserType,
    ) {}

    static create(createAccountReq: CreateAccountReq): CreateAccountDto | null {
        const { name, email, password, cpf, oab, type } = createAccountReq
        
        if (typeof(name) !== 'string') return null
        if (typeof(email) !== 'string') return null
        if (typeof(password) !== 'string') return null
        if (typeof(cpf) !== 'string') return null
        if (typeof(type) !== 'string' || (type !== 'COMMON' && type !== 'LAWYER')) return null

        return new CreateAccountDto(name, email, password, cpf, oab, UserType[type])
    }
}