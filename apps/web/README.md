# Interface Web do Veridit (`apps/web`)

Aplicação frontend do sistema **Veridit**, construída com **Next.js 15+** (App Router), React 19 e TypeScript.

---

## 🎯 Objetivo da Aplicação

A interface web atende a dois perfis principais de usuários (conforme a decisão [D1](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/D1.md)):

- **Usuários Comuns:** Cadastro de conta, login, aquisição de pacotes de créditos (decisão [D2](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/D2.md)), solicitação de capturas de provas digitais e acompanhamento do status.
- **Advogados:** Gestão profissional de evidências para processos judiciais, verificação da integridade de relatórios e arquivamento de certidões probatórias.

---

## 🚀 Execução em Desenvolvimento

A partir da raiz do monorepo:

```bash
pnpm --filter web dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a interface.

---

## 📁 Estrutura do Projeto

```text
src/
└── app/
    ├── favicon.ico
    ├── globals.css      # Estilização global da aplicação
    ├── layout.tsx       # Layout raiz (RootLayout)
    ├── page.module.css  # Estilos modulares da página inicial
    └── page.tsx         # Página inicial
```
