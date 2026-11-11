const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

export function isValidName(name: unknown): name is string {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

export function isValidPassword(password: unknown): password is string {
  if (typeof password !== 'string') return false;
  return password.length >= 8 && password.length <= 128;
}

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function isValidCpf(cpf: unknown): cpf is string {
  if (typeof cpf !== 'string') return false;
  const cleanCpf = normalizeCpf(cpf);

  if (cleanCpf.length !== 11) return false;

  // Rejeita CPFs formados por 11 dígitos repetidos
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(cleanCpf[i]) * (10 - i);
  }
  let rest = (sum * 10) % 11;
  const digit1 = rest === 10 || rest === 11 ? 0 : rest;
  if (digit1 !== Number(cleanCpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cleanCpf[i]) * (11 - i);
  }
  rest = (sum * 10) % 11;
  const digit2 = rest === 10 || rest === 11 ? 0 : rest;
  return digit2 === Number(cleanCpf[10]);
}

export function isValidOab(oab: unknown): oab is string {
  if (typeof oab !== 'string') return false;
  const trimmed = oab.trim().toUpperCase();
  if (!trimmed) return false;

  const ufs = BRAZILIAN_STATES.join('|');
  const pattern = new RegExp(`^(?:(${ufs})[-\\s]?(\\d{1,7})|(\\d{1,7})[-\\s\\/](${ufs}))$`, 'i');
  return pattern.test(trimmed);
}

export function normalizeOab(oab: string): string {
  const trimmed = oab.trim().toUpperCase();
  const ufs = BRAZILIAN_STATES.join('|');
  const match = new RegExp(`^(?:(${ufs})[-\\s]?(\\d{1,7})|(\\d{1,7})[-\\s\\/](${ufs}))$`, 'i').exec(
    trimmed,
  );
  if (!match) return trimmed;
  const uf = match[1] || match[4];
  const num = match[2] || match[3];
  return `${uf}${num}`;
}
