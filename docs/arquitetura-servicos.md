# Arquitetura e Implementação dos Serviços — Veridit

## 1. Visão Geral do Sistema

O **Veridit** é um sistema desenvolvido no âmbito da disciplina MATA-62 (Engenharia de Software / Orientação a Objetos - UFBA) destinado à **captura, preservação e auditoria de registros de provas digitais online** (como postagens em redes sociais, mensagens e websites) com garantias criptográficas de integridade e valor probatório.

O repositório é organizado em um **monorepo** gerenciado com **pnpm workspaces**, estruturando a aplicação em serviços desacoplados conforme a decisão arquitetural [ADR-0005](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/adrs/ADR005.md) (Estilo Arquitetural Baseado em Serviços).

---

## 2. Estrutura do Monorepo

```text
.
├── apps/
│   ├── accounts/     # Microsserviço de Contas e Autenticação (NestJS 11+, ESM)
│   ├── records/      # Microsserviço de Gestão de Registros de Evidências (NestJS 11+, ESM)
│   └── web/          # Aplicação Frontend do Usuário e Advogado (Next.js 15+, App Router)
├── docs/             # Documentação de arquitetura, ADRs, diagramas e padrões
├── package.json      # Configurações globais e scripts de formatação e linting
├── pnpm-workspace.yaml # Definição dos workspaces do pnpm
└── pnpm-lock.yaml    # Lockfile de dependências
```

---

## 3. Microsserviço de Contas e Autenticação (`apps/accounts`)

Responsável pela gestão de usuários, validação cadastral, autenticação e emissão/revogação de credenciais. Atende diretamente aos requisitos **REQ 01**, **REQ 03** e **REQ 04**, além da decisão [D1](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/D1.md) (Tipos de Usuário Cadastráveis).

### 3.1. Requisitos Implementados

| Requisito  | Funcionalidade                        | Endpoint HTTP       | Status da Implementação                  |
| :--------- | :------------------------------------ | :------------------ | :--------------------------------------- |
| **REQ 01** | Cadastro de usuário comum ou advogado | `POST /accounts`    | Implementado com persistência JSON       |
| **REQ 03** | Autenticação / Login                  | `POST /auth/login`  | Implementado com emissão de JWT          |
| **REQ 04** | Logout e revogação de credencial      | `POST /auth/logout` | Implementado com `AuthGuard` e blacklist |

### 3.2. Contratos de API

#### Cadastro (`POST /accounts`)

- **Request Body:**
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha-segura-123",
    "cpf": "123.456.789-00",
    "type": "COMMON",
    "oab": null
  }
  ```
  _Para advogados (`type: "LAWYER"`), o campo `oab` é obrigatório._
- **Respostas:**
  - `201 Created`: Retorna os dados da conta criada (`id`, `name`, `email`, `cpf`, `oab`, `type`, `createAt`) omitindo o hash da senha.
  - `400 Bad Request`: Dados inválidos ou ausência de OAB para perfil de advogado.
  - `409 Conflict`: E-mail ou CPF já utilizado por outra conta.

#### Login (`POST /auth/login`)

- **Request Body:**
  ```json
  {
    "email": "maria@example.com",
    "password": "senha-segura-123"
  }
  ```
- **Respostas:**
  - `200 OK`:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresIn": 1200,
      "accountResponseDto": {
        "id": "c1f72b9a-...",
        "name": "Maria Silva",
        "email": "maria@example.com",
        "cpf": "123.456.789-00",
        "oab": null,
        "type": 0,
        "createAt": "2026-11-10T18:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Corpo da requisição malformado ou campos ausentes.
  - `401 Unauthorized`: Credenciais incorretas (e-mail não cadastrado ou senha não confere).

#### Logout (`POST /auth/logout`)

- **Headers:** `Authorization: Bearer <token_jwt>`
- **Respostas:**
  - `204 No Content`: Token revogado com sucesso e adicionado à blacklist.
  - `401 Unauthorized`: Token ausente, inválido, expirado ou previamente revogado.

### 3.3. Arquitetura Interna e Injeção de Dependências

O serviço adota princípios de inversão de dependência (Clean Architecture / SOLID) através de interfaces TypeScript:

- **`AccountsRepository`**:
  - Abstração de persistência (`findByEmail`, `findByCpf`, `create`).
  - Implementação atual: `JsonAccountsRepository` persistindo em `./accounts.json` de forma assíncrona com `node:fs/promises`.
- **`TokenRepository`**:
  - Abstração para controle de tokens revogados (`isRevoked`, `revoke`).
  - Implementação atual: `InMemoryTokenRepository` utilizando `Set<string>` para guardar os identificadores `jti` revogados. Injetado no NestJS sob o símbolo `TOKEN_REPOSITORY`.
- **`PasswordHasher`**:
  - Interface para geração e validação de hashes criptográficos (`hash`, `compare`).
  - Planejada a integração concreta com **Argon2** conforme a [ADR-0001](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/adrs/ADR001.md).
- **`JwtService` e `AuthGuard`**:
  - Utiliza algoritmo **HS256** com validação de segredo (`JWT_SECRET`, exigindo no mínimo 32 caracteres).
  - Payload do token contém: `sub` (ID da conta), `email`, `type` (tipo de usuário), `jti` (UUID único para rastreamento e revogação), `iat` e `exp`.
  - O `AuthGuard` extrai o cabeçalho `Authorization: Bearer ...`, valida a assinatura criptográfica, verifica se o `jti` consta no `TokenRepository` e anexa o usuário autenticado em `req.user`.

---

## 4. Microsserviço de Registros (`apps/records`)

Responsável pela consulta, listagem e auditoria de registros de provas previamente capturadas. Atende aos requisitos **REQ 12** e **REQ 13**.

### 4.1. Requisitos Mapeados

- **REQ 12 (Listagem de Registros):** Permite ao usuário logado consultar seus registros de prova de forma paginada (`page`, `pageSize`), com opção de filtro por status (`IN_PROGRESS`, `COMPLETED`, `FAILED`) e ordenação fixa decrescente por data de início (`startedAt`).
- **REQ 13 (Visualização de Detalhes do Registro):** Permite visualizar os detalhes completos de uma prova (título, datas de início e término, mídias capturadas como imagens e vídeos, status e identificador do usuário proprietário).

### 4.2. Estratégia de Autenticação e Integração com API Gateway

Conforme estabelecido na [ADR-0007](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/adrs/ADR007.md), a autenticação dos tokens JWT é centralizada no API Gateway:

1. O cliente envia a requisição HTTP contendo o cabeçalho `Authorization: Bearer <token>` para o Gateway.
2. O Gateway valida o token JWT e injeta o cabeçalho interno `X-User-Id: <userId>` na chamada repassada ao serviço `records`.
3. O `RecordsController` valida a presença do cabeçalho `X-User-Id`: caso ausente, rejeita imediatamente com `401 Unauthorized`; caso presente, isola as consultas estritamente aos registros pertencentes ao usuário identificado.

---

## 5. Aplicação Frontend Web (`apps/web`)

Desenvolvida em **Next.js 15+** com App Router e TypeScript, servindo como interface web para:

- Usuários comuns realizarem cadastro, login, compra de pacotes de crédito (REQ 05, 06; decisão [D2](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/D2.md)) e solicitação de registros de prova.
- Advogados gerenciarem registros de seus clientes e acompanharem o status das capturas.

---

## 6. Configuração e Variáveis de Ambiente

O serviço `accounts` necessita das seguintes variáveis de ambiente:

| Variável         | Descrição                                      | Valor Padrão / Exemplo             |
| :--------------- | :--------------------------------------------- | :--------------------------------- |
| `PORT`           | Porta HTTP em que o serviço responderá         | `3000`                             |
| `JWT_SECRET`     | Chave simétrica para assinatura dos tokens JWT | Obrigatório (mínimo 32 caracteres) |
| `JWT_EXPIRATION` | Tempo de vida do token de acesso em segundos   | `1200` (20 minutos)                |

---

## 7. Rastreabilidade com as Decisões de Arquitetura (ADRs)

| Decisão / Requisito | Descrição                               | Como Reflete no Código Atual                                                                        |
| :------------------ | :-------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| **D1 / REQ 01**     | Usuários cadastráveis (Comum, Advogado) | Enum `UserType { COMMON, LAWYER }` e validação de `oab` em `CreateAccountDto` e `Account.model`.    |
| **REQ 03 & 04**     | Login com JWT e Logout                  | `AuthService`, `JwtService` com `jti`, e `TokenRepository` para invalidação de sessão.              |
| **ADR-0001**        | Segurança                               | Hash de senha desacoplado via `PasswordHasher`, sanitização no `AccountResponseDto`, `AuthGuard`.   |
| **ADR-0005**        | Serviços desacoplados                   | Divisão em workspaces independentes (`apps/accounts`, `apps/records`, `apps/web`).                  |
| **ADR-0007**        | Gateway e Tokens                        | Especificação do repasse de `X-User-Id` nas chamadas aos serviços de domínio.                       |
| **ADR-0006**        | Banco de Dados                          | Interfaces de repositório isolando o acesso a dados para posterior migração para PostgreSQL/Prisma. |
