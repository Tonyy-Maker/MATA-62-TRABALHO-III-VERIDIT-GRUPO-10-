# Fluxo — REQ 04: Logout

```mermaid
flowchart TD
    A([Início]) --> B[Cliente envia POST /auth/logout com Bearer JWT]
    B --> C[AuthGuard extrai e valida o token]
    C --> D{Token válido e não expirado?}
    D -- Não --> E[Retorna HTTP 401]
    E --> Z([Fim])
    D -- Sim --> F[Extrai o identificador jti]
    F --> G[TokenRepository consulta a lista de tokens revogados]
    G --> H{Token já revogado?}
    H -- Sim --> E
    H -- Não --> I[TokenRepository registra o jti como revogado]
    I --> J{Registro concluído?}
    J -- Não --> K[Retorna HTTP 500]
    K --> Z
    J -- Sim --> L[Retorna HTTP 204 No Content]
    L --> Z
```

## Observações

- O endpoint `POST /auth/logout` responde com status **HTTP 204 No Content** quando a revogação do token é processada com sucesso.
- O `TokenRepository` atual utiliza implementação em memória (`InMemoryTokenRepository`), armazenando os identificadores `jti` revogados em um `Set<string>`.
