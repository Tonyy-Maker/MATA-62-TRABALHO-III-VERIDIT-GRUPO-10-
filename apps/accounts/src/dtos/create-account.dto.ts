import { UserType } from '../enums/user-type.enum.js'

export type CreateAccountReq = {
    name: string,
    email: string,
    password: string, 
    cpf: string,
    oab: string,
    type: string
}

export interface CreateAccountDto {
    name: string,
    email: string,
    password: string, 
    cpf: string,
    oab: string,
    type: UserType
}

export class CreateAccountValidator {
    static toDto(createAccountReq: CreateAccountReq): CreateAccountDto | null {
        const { name, email, password, cpf, oab, type } = createAccountReq
        
        if (typeof(name) !== 'string') return null
        if (typeof(email) !== 'string') return null
        if (typeof(password) !== 'string') return null
        if (typeof(cpf) !== 'string') return null
        if (typeof(type) !== 'string' || (type !== 'COMMON' && type !== 'LAWYER')) return null

        return {
            name, email, password, cpf, oab, type: UserType[type]
        }
    }
}