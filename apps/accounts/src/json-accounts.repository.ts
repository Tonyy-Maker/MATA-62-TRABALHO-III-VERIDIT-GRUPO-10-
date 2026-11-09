import { readFile, writeFile } from 'node:fs/promises'
import { AccountsRepository } from './interfaces/accounts-repository.interface.js'
import { Account } from './models/account.model.js'

const FILE_PATH = './accounts.json'

export class JsonAccountsRepository implements AccountsRepository {
    private async _readAccounts(): Promise<Account[]> {
        try {
            const content = await readFile(FILE_PATH, 'utf-8')
            return JSON.parse(content)
        } catch (err: any) {
            if (err.code === 'ENOENT') return [] // arquivo ainda não existe
            throw err
        }
    }

    async findByEmail(email: string): Promise<Account | undefined> {
        const accounts = await this._readAccounts()
        return accounts.find(account => account.email.toLowerCase() === email.toLowerCase())
    }

    async findByCpf(cpf: string): Promise<Account | undefined> {
        const normalize = (value: string) => value.replace(/\D/g, '')
        const accounts = await this._readAccounts()
        return accounts.find(account => normalize(account.cpf) === normalize(cpf))
    }

    async create(account: Account): Promise<Account> {
        const accounts = await this._readAccounts()
        accounts.push(account)
        await writeFile(FILE_PATH, JSON.stringify(accounts, null, 2), 'utf-8')
        return account
    }
}