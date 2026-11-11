import { readFile, writeFile } from 'node:fs/promises';
import { Account } from '../models/account.model.js';

const FILE_PATH = './accounts.json';

async function readAccounts(): Promise<Account[]> {
  try {
    const content = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') return []; // arquivo ainda não existe
    throw err;
  }
}

export async function saveAccount(account: Account): Promise<void> {
  const accounts = await readAccounts();
  accounts.push(account);
  await writeFile(FILE_PATH, JSON.stringify(accounts, null, 2), 'utf-8');
}

export async function emailExists(email: string): Promise<boolean> {
  const accounts = await readAccounts();
  return accounts.some((account) => account.email.toLowerCase() === email.toLowerCase());
}

export interface AccountsRepository {
  findByEmail: (email: string) => Promise<Account | undefined>;
  findByCpf: (cpf: string) => Promise<Account | undefined>;
  create: (account: Account) => Promise<Account>;
}
