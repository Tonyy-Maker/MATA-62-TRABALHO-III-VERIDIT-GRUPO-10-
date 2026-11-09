import { readFile, writeFile } from 'node:fs/promises'
import { CreateAccountDto } from './dtos/create-account.dto.js'
import { UserType } from './enums/user-type.enum.js'

const FILE_PATH = './accounts.json'

async function readAccounts(): Promise<CreateAccountDto[]> {
    try {
        const content = await readFile(FILE_PATH, 'utf-8')
        return JSON.parse(content)
    } catch (err: any) {
        if (err.code === 'ENOENT') return [] // arquivo ainda não existe
        throw err
    }
}

export async function saveAccount(dto: CreateAccountDto): Promise<void> {
    const accounts = await readAccounts()
    accounts.push(dto)
    await writeFile(FILE_PATH, JSON.stringify(accounts, null, 2), 'utf-8')
}

export async function emailExists(email: string): Promise<boolean> {
    const accounts = await readAccounts()
    return accounts.some(account => account.email.toLowerCase() === email.toLowerCase())
}

export class AccountRepository {
    async save(dto: CreateAccountDto) {
        return await saveAccount(dto)
    }
}