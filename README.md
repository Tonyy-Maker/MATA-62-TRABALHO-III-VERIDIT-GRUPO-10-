# Veridit — Sistema de Provas Digitais Online

> **Trabalho III da disciplina MATA-62 (Engenharia de Software / Orientação a Objetos) — UFBA**  
> Implementação do sistema Veridit baseada nas decisões arquiteturais e requisitos do Grupo 10.

O **Veridit** é uma plataforma projetada para captura, certificação e auditoria de evidências e provas digitais em páginas web e redes sociais, assegurando validade jurídica por meio de hash criptográfico, carimbo temporal e cadeia de custódia rastreável.

---

## 🏛️ Arquitetura do Monorepo

O repositório está configurado como um monorepo gerenciado via **pnpm workspaces**:

```text
.
├── apps/
│   ├── accounts/     # Microsserviço de Gestão de Contas e Autenticação (NestJS 11+)
│   ├── records/      # Microsserviço de Registros e Evidências (NestJS 11+)
│   └── web/          # Aplicação Web Frontend (Next.js 15+, App Router)
├── docs/             # Documentação de arquitetura, ADRs, diagramas UML e fluxos
├── package.json      # Configuração raiz, ferramentas de linting e formatação
└── pnpm-workspace.yaml
```

### Serviços

| Workspace           | Descrição                                                                   | Tecnologias                      | Requisitos / Decisões      |
| :------------------ | :-------------------------------------------------------------------------- | :------------------------------- | :------------------------- |
| **`apps/accounts`** | Cadastro de contas (comum e advogado), login via JWT e logout com blacklist | NestJS, TypeScript (ESM), Vitest | REQ 01, REQ 03, REQ 04, D1 |
| **`apps/records`**  | Consulta, listagem paginada e detalhamento de registros capturados          | NestJS, TypeScript (ESM), Vitest | REQ 12, REQ 13             |
| **`apps/web`**      | Interface para os usuários e advogados solicitarem e consultarem provas     | Next.js, React, TypeScript       | D1, D2                     |

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** >= 20.x
- **pnpm** >= 10.x (versão configurada via devEngines: `pnpm@12.18.0`)

### 1. Instalação das dependências

Na raiz do projeto, instale todas as dependências dos workspaces:

```bash
pnpm install
```

### 2. Configuração de Variáveis de Ambiente

Para o serviço de contas (`apps/accounts`), defina as variáveis necessárias (exemplo de `.env`):

```env
PORT=3000
JWT_SECRET=chave_secreta_super_segura_com_mais_de_32_caracteres
JWT_EXPIRATION=1200
```

### 3. Executando os serviços

- **Serviço de Contas (`accounts`):**
  ```bash
  pnpm --filter accounts start:dev
  ```
- **Serviço de Registros (`records`):**
  ```bash
  pnpm --filter records start:dev
  ```
- **Frontend Web (`web`):**
  ```bash
  pnpm --filter web dev
  ```

---

## 🧪 Testes e Qualidade de Código

- **Executar testes unitários:**
  ```bash
  pnpm --filter accounts test
  pnpm --filter records test
  ```
- **Verificação de formatação de código (Prettier):**
  ```bash
  pnpm run format:check
  # ou para corrigir automaticamente:
  pnpm run format
  ```
- **Análise estática (Oxlint):**
  ```bash
  pnpm run lint
  ```

---

## 📚 Documentação Técnica

Para mais detalhes sobre as decisões e modelagens do projeto, consulte a pasta [`docs/`](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/):

- **[Arquitetura e Serviços](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/arquitetura-servicos.md):** Detalhamento da arquitetura implementada, contratos de API e modelos de dados.
- **[Características Gerais e Atributos de Qualidade](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/caracteristicas-gerais.md):** Requisitos não-funcionais (segurança, confiabilidade, auditabilidade, etc.).
- **[Decisões Arquiteturais (ADRs)](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/adrs/):** Registros formais de decisões (estilo de serviços, autenticação com gateway, integridade por hash, etc.).
- **[Decisões de Negócio](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/D1.md):** D1 (Tipos de Usuário Cadastráveis) e D2 (Pacotes de Créditos).
- **[Diagramas UML e Fluxos](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/):**
  - Contas: [Diagrama de Classes](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/uml-accounts.md), [Fluxo REQ 01](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-01.md), [Fluxo REQ 03](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-03.md), [Fluxo REQ 04](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-04.md).
  - Registros: [Diagrama de Classes](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/uml-records.md), [Fluxo REQ 12](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-12.md), [Fluxo REQ 13](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-13.md).

---

## 🤝 Padrão de Contribuição e Commits

O projeto adota rigorosamente a convenção **Conventional Commits** em inglês com escopos padronizados. Antes de realizar qualquer commit, consulte o guia completo em [CONTRIBUTING.md](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/CONTRIBUTING.md).

Exemplos:

- `feat(accounts): implement jwt authentication`
- `fix(accounts): return 400 for lawyer missing oab`
- `docs(project): update services documentation`
