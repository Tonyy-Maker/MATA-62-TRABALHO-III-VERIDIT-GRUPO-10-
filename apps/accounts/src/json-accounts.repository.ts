import { readFile, writeFile } from 'node:fs/promises'
import { AccountsRepository } from './interfaces/accounts-repository.interface.js'
import { Account } from './models/account.model.js'

const FILE_PATH = './accounts.json'

async function readAccounts(): Promise<Account[]> {
    try {
        const content = await readFile(FILE_PATH, 'utf-8')
        return JSON.parse(content)
    } catch (err: any) {
        if (err.code === 'ENOENT') return [] // arquivo ainda não existe
        throw err
    }
}

export async function saveAccount(account: Account): Promise<void> {
    const accounts = await readAccounts()
    accounts.push(account)
    await writeFile(FILE_PATH, JSON.stringify(accounts, null, 2), 'utf-8')
}

export async function emailExists(email: string): Promise<boolean> {
    const accounts = await readAccounts()
    return accounts.some(account => account.email.toLowerCase() === email.toLowerCase())
}

export async function findByEmail(email: string): Promise<Account | undefined> {
    const accounts = await readAccounts()
    return accounts.find(account => account.email.toLowerCase() === email.toLowerCase())
}

export async function findByCpf(cpf: string): Promise<Account | undefined> {
    const normalize = (value: string) => value.replace(/\D/g, '')
    const accounts = await readAccounts()
    return accounts.find(account => normalize(account.cpf) === normalize(cpf))
}

export class JsonAccountsRepository implements AccountsRepository {
    async findByEmail(email: string): Promise<Account | undefined> {
        return findByEmail(email)
    }

    async findByCpf(cpf: string): Promise<Account | undefined> {
        return findByCpf(cpf)
    }

    async create(account: Account): Promise<Account> {
        await saveAccount(account)
        return account
    }
}