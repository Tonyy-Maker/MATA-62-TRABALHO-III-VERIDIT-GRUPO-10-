# Serviço de Contas e Autenticação (`apps/accounts`)

Microsserviço responsável pela **criação de contas**, **validação cadastral** e **gerenciamento de sessões/autenticação** (emissão e revogação de tokens JWT) do sistema **Veridit**.

---

## 📋 Requisitos Atendidos

- **REQ 01 — Cadastro de Usuário:** Permite o cadastro de usuários comuns (`COMMON`) e advogados (`LAWYER`), exigindo número de inscrição na OAB para advogados e validando unicidade de CPF e e-mail.
- **REQ 03 — Autenticação:** Validação de credenciais e geração de token JWT assinado digitalmente com chave secreta segura.
- **REQ 04 — Logout:** Invalidação imediata do token de acesso através de armazenamento do identificador único do token (`jti`) em blacklist.
- **Decisão D1:** Suporte aos tipos de usuário cadastráveis definidos para a primeira versão da plataforma.

---

## 🔌 Endpoints da API

### 1. `POST /accounts` — Cadastro de Usuário

Cria uma nova conta de usuário.

- **Payload de Exemplo (Usuário Comum):**

  ```json
  {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha-segura-123",
    "cpf": "123.456.789-00",
    "type": "COMMON"
  }
  ```

- **Payload de Exemplo (Advogado):**

  ```json
  {
    "name": "Dra. Beatriz Santos",
    "email": "beatriz@adv.oab.br",
    "password": "senha-segura-123",
    "cpf": "987.654.321-11",
    "type": "LAWYER",
    "oab": "BA12345"
  }
  ```

- **Códigos de Resposta:**
  - `201 Created`: Retorna o objeto da conta criada (`id`, `name`, `email`, `cpf`, `oab`, `type`, `createAt`), omitindo o hash da senha.
  - `400 Bad Request`: Dados inválidos ou campo `oab` ausente para perfil `LAWYER`.
  - `409 Conflict`: E-mail ou CPF já cadastrado no sistema.

---

### 2. `POST /auth/login` — Autenticação

Autentica o usuário e emite um token JWT.

- **Payload:**

  ```json
  {
    "email": "maria@example.com",
    "password": "senha-segura-123"
  }
  ```

- **Resposta de Sucesso (`200 OK`):**

  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 1200,
    "accountResponseDto": {
      "id": "e4b6c310-...",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "cpf": "123.456.789-00",
      "oab": null,
      "type": 0,
      "createAt": "2026-11-10T20:00:00.000Z"
    }
  }
  ```

- **Códigos de Erro:**
  - `400 Bad Request`: E-mail ou senha ausentes.
  - `401 Unauthorized`: E-mail não encontrado ou senha incorreta.

---

### 3. `POST /auth/logout` — Logout

Invalida o token JWT atual.

- **Headers:**

  ```http
  Authorization: Bearer <seu_token_jwt>
  ```

- **Códigos de Resposta:**
  - `204 No Content`: Token revogado com sucesso (sem corpo de resposta).
  - `401 Unauthorized`: Token ausente, inválido, expirado ou já revogado anteriormente.

---

### 4. `GET /` — Healthcheck

Retorna uma mensagem de status do serviço.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na pasta `apps/accounts/` ou defina as variáveis no ambiente:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_super_segura_com_ao_menos_32_caracteres
JWT_EXPIRATION=1200
```

> **Aviso de Segurança:** O serviço valida no bootstrap se `JWT_SECRET` possui no mínimo 32 caracteres, abortando a inicialização caso a chave seja fraca ou ausente.

---

## 🏗️ Arquitetura e Inversão de Dependências

O serviço é construído em NestJS com TypeScript (módulos ECMAScript nativos) e desacoplado através de interfaces:

```text
src/
├── dtos/                     # Data Transfer Objects com validação e criação estática
│   ├── account-response.dto.ts
│   ├── auth-response.dto.ts
│   ├── create-account.dto.ts
│   └── login.dto.ts
├── enums/                    # Tipos enumerados (ex.: UserType: COMMON, LAWYER)
├── interfaces/               # Contratos desacoplados
│   ├── accounts-repository.interface.ts
│   ├── jwt-payload.interface.ts
│   ├── password-hasher.interface.ts
│   └── token-repository.interface.ts
├── models/                   # Entidade de domínio Account
├── accounts.controller.ts    # Controlador de rotas de criação de contas
├── accounts.service.ts       # Regras de negócio de contas e unicidade
├── auth.controller.ts        # Controlador de login e logout
├── auth.guard.ts             # Guard para validação de Bearer JWT e checagem de revogação
├── auth.service.ts           # Regras de negócio de autenticação
├── inmemory-token.repository.ts # Repositório em memória para tokens revogados
├── json-accounts.repository.ts  # Repositório baseado em arquivo accounts.json
├── jwt.service.ts            # Emissão e verificação de tokens JWT via @nestjs/jwt
└── app.module.ts             # Módulo principal com registro de providers e controllers
```

---

## 🚀 Execução e Testes

A partir da raiz do monorepo:

```bash
# Executar em modo desenvolvimento (watch):
pnpm --filter accounts start:dev

# Executar testes unitários com Vitest:
pnpm --filter accounts test

# Executar testes end-to-end (e2e):
pnpm --filter accounts test:e2e
```
