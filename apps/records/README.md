# Serviço de Registros de Evidências (`apps/records`)

Microsserviço responsável pela **consulta**, **listagem paginada** e **detalhamento de registros e provas capturadas** no sistema **Veridit**.

---

## 📋 Requisitos do Serviço

- **REQ 12 — Listar Registros:** Consulta paginada dos registros pertencentes ao usuário autenticado, com suporte a filtro por status (`IN_PROGRESS`, `COMPLETED`, `FAILED`) e ordenação decrescente por data de início (`startedAt`).
- **REQ 13 — Visualizar Registro:** Retorno dos detalhes completos de um registro de prova pelo seu identificador único (`recordId`), garantindo que apenas o usuário responsável tenha acesso às evidências e metadados.

---

## 🔐 Integração e Autenticação

Conforme a [ADR-0007](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/adrs/ADR007.md), a autenticação de tokens JWT ocorre no **API Gateway**:

1. As requisições externas chegam ao Gateway com o cabeçalho `Authorization: Bearer <token_jwt>`.
2. O Gateway valida o token e injeta o cabeçalho interno `X-User-Id: <identificador_usuario>`.
3. O `RecordsController` valida obrigatoriamente a presença do `X-User-Id`:
   - Se ausente: responde imediatamente com **`401 Unauthorized`**.
   - Se presente: delega para o `RecordsService`, garantindo o isolamento multitenant dos dados.

---

## 🔌 Contratos de API Planejados

### 1. `GET /records` — Listar Registros (REQ 12)

- **Query Parameters:**
  - `page` (número, padrão: `1`)
  - `pageSize` (número, padrão: `10`)
  - `status` (opcional: `IN_PROGRESS`, `COMPLETED`, `FAILED`)
- **Headers Obrigatórios:** `X-User-Id: <userId>`
- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "items": [
      {
        "recordId": "rec_123456",
        "title": "Registro de publicação ofensiva",
        "startedAt": "2026-11-10T14:30:00Z",
        "finishedAt": "2026-11-10T14:31:15Z",
        "status": "COMPLETED"
      }
    ],
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
  ```

---

### 2. `GET /records/:id` — Detalhes do Registro (REQ 13)

- **Parâmetros de Rota:** `id` (identificador do registro)
- **Headers Obrigatórios:** `X-User-Id: <userId>`
- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "recordId": "rec_123456",
    "title": "Registro de publicação ofensiva",
    "startedAt": "2026-11-10T14:30:00Z",
    "finishedAt": "2026-11-10T14:31:15Z",
    "status": "COMPLETED",
    "dataType": ["IMAGE", "VIDEO"],
    "nOfImages": 4,
    "nOfVideos": 1,
    "userId": "usr_987654"
  }
  ```
- **Respostas de Erro:**
  - `401 Unauthorized`: Cabeçalho `X-User-Id` ausente.
  - `404 Not Found`: Registro não encontrado ou pertencente a outro usuário (`RecordNotFound`).

---

## 🏗️ Modelagem de Domínio

O diagrama detalhado de classes e fluxos do serviço de registros pode ser consultado em:

- [Diagrama UML de Classes](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/uml-records.md)
- [Fluxo do REQ 12](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-12.md) e [Sequência do REQ 12](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/sequencia-req-12.md)
- [Fluxo do REQ 13](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/fluxo-req-13.md) e [Sequência do REQ 13](file:///home/antigravity/Tonyy-Maker/MATA-62-TRABALHO-III-VERIDIT-GRUPO-10-/docs/diagrams/sequencia-req-13.md)

---

## 🚀 Execução e Testes

A partir da raiz do monorepo:

```bash
# Executar em modo desenvolvimento:
pnpm --filter records start:dev

# Executar testes com Vitest:
pnpm --filter records test
```
