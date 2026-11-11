# Diagrama de sequência — REQ 04: Logout

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant Controller as AuthController
    participant Guard as AuthGuard
    participant JWT as JwtService
    participant Service as AuthService
    participant Repository as TokenRepository (InMemory)

    Cliente->>Controller: POST /auth/logout (Bearer JWT)
    Controller->>Guard: Validar token de acesso
    Guard->>JWT: verify(token)
    JWT-->>Guard: Claims do token (com jti) ou erro

    alt Token inválido ou expirado
        Guard-->>Controller: Acesso não autorizado
        Controller-->>Cliente: HTTP 401 Unauthorized
    else Token válido
        Guard->>Repository: isRevoked(jti)
        Repository-->>Guard: Status de revogação
        alt Token já revogado
            Guard-->>Controller: Acesso não autorizado (Token revogado)
            Controller-->>Cliente: HTTP 401 Unauthorized
        else Token ainda ativo
            Guard-->>Controller: Claims validados (request.user)
            Controller->>Service: logout(jti)
            Service->>Repository: revoke(jti)
            Repository-->>Service: jti adicionado aos revogados
            Service-->>Controller: Logout concluído
            Controller-->>Cliente: HTTP 204 No Content
        end
    end
```

## Observações

- A implementação em `dev` utiliza `@HttpCode(204)` no `AuthController.logout`, retornando **HTTP 204 No Content** sem corpo de resposta.
- A lista de revogação reside atualmente no `InMemoryTokenRepository` utilizando uma estrutura `Set<string>`. Em versões futuras de produção, poderá ser conectada a um repositório distribuído com expiração automática (TTL via Redis ou banco de dados relacional).
