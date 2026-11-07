# Padrão de Commits --- Veridit

## 1. Objetivo

Adotar um padrão de mensagens de commit que mantenha o histórico do Git
organizado, previsível e fácil de compreender.

A convenção escolhida é **Conventional Commits**, complementada por
regras de granularidade, nomenclatura e validação automática.

Cada commit deve representar uma alteração lógica e descrever
objetivamente a evolução realizada no projeto.

## 2. Estrutura da mensagem

O formato recomendado é:

``` text
<type>(<scope>): <description>
```

Exemplo:

``` text
feat(auth): implement user authentication
```

  Elemento        Finalidade
  --------------- ------------------------------------------
  `type`          Identifica a natureza da alteração.
  `scope`         Identifica o módulo ou contexto afetado.
  `description`   Resume objetivamente a alteração.

O `scope` deve ser utilizado sempre que houver um módulo ou contexto
identificável.

## 3. Tipos de commit

  -----------------------------------------------------------------------
  Tipo                                Quando utilizar
  ----------------------------------- -----------------------------------
  `feat`                              Adição de uma funcionalidade.

  `fix`                               Correção de um defeito.

  `refactor`                          Reestruturação do código sem
                                      alteração intencional de
                                      comportamento.

  `test`                              Adição ou alteração de testes.

  `docs`                              Alterações na documentação.

  `style`                             Alterações de formatação que não
                                      modificam o significado do código,
                                      como espaços e ponto e vírgula.

  `perf`                              Melhoria de desempenho.

  `build`                             Alterações no processo de build ou
                                      nas dependências.

  `ci`                                Alterações nos pipelines de
                                      integração contínua.

  `chore`                             Manutenção geral que não se
                                      enquadra nos tipos anteriores.

  `revert`                            Reversão de um commit anterior.
  -----------------------------------------------------------------------

**Regra:** evite utilizar `chore` como categoria genérica. Sempre que
possível, escolha o tipo mais específico.

## 4. Padronização dos scopes

O `scope` identifica a parte da aplicação afetada pelo commit.

Exemplos:

``` text
feat(auth): implement login endpoint
feat(users): add user registration
feat(products): implement product search
fix(auth): correct token validation
test(users): add registration unit tests
docs(api): document authentication endpoints
```

Mantenha os nomes dos scopes consistentes durante todo o
desenvolvimento. Não alterne entre `user`, `users` e `account` para
representar o mesmo módulo.

Os scopes devem refletir a organização real da aplicação, e não
necessariamente a estrutura física de diretórios.

## 5. Regras para manter o histórico organizado

### 5.1. Um commit por alteração lógica

Evite agrupar funcionalidades independentes em um único commit.

Evite:

``` text
feat: implement authentication, user registration and product search
```

Prefira:

``` text
feat(auth): implement authentication
feat(users): implement user registration
feat(products): implement product search
```

### 5.2. Utilize verbos no imperativo

Prefira descrições que indiquem a ação realizada, utilizando o
imperativo.

Prefira:

``` text
feat(auth): implement authentication
fix(users): validate email format
refactor(products): extract product repository
```

Evite:

``` text
feat(auth): implemented authentication
fix(users): fixed email validation
```

### 5.3. Evite mensagens genéricas

Não utilize mensagens sem significado claro, como:

``` text
update
changes
fixes
final version
corrections
```

A descrição deve permitir compreender a finalidade do commit sem
precisar analisar imediatamente todas as alterações.

### 5.4. Mantenha o projeto em um estado coerente

Sempre que possível, cada commit deve deixar o projeto compilável e
testável. Evite registrar alterações incompletas que quebrem o
funcionamento da aplicação.

### 5.5. Separe alterações de naturezas diferentes

Se uma implementação incluir uma nova funcionalidade e uma correção
independente, considere criar commits separados. Isso facilita revisões,
reversões e identificação de alterações.

## 6. Corpo da mensagem (body)

O corpo é opcional e deve ser utilizado quando o título não for
suficiente para explicar a alteração.

Exemplo:

``` text
feat(auth): implement JWT authentication

- Add authentication service
- Implement access token generation
- Implement refresh token validation
- Add authentication middleware
```

Para alterações simples, o título geralmente é suficiente.

## 7. Breaking changes

Quando uma alteração introduzir incompatibilidade com versões
anteriores, sinalize-a com `!` após o tipo e o scope.

Exemplo:

``` text
feat(api)!: change authentication response format

BREAKING CHANGE: Authentication endpoints now return
a different response structure.
```

O `!` sinaliza a existência de uma alteração incompatível. A seção
`BREAKING CHANGE:` explica a natureza e o impacto da incompatibilidade.

## 8. Exemplo de sequência de commits

Considere o desenvolvimento de um serviço de autenticação:

``` text
docs(auth): document authentication requirements

build(auth): add authentication dependencies

feat(auth): create authentication module

feat(auth): implement user authentication

feat(auth): implement JWT generation

feat(auth): implement refresh token validation

test(auth): add authentication unit tests

test(auth): add authentication integration tests

refactor(auth): extract token generation service

docs(api): document authentication endpoints
```

Essa sequência torna a evolução da implementação mais fácil de
acompanhar.

## 9. Convenções adotadas no Veridit

  -----------------------------------------------------------------------
  Convenção                           Decisão
  ----------------------------------- -----------------------------------
  Padrão                              Conventional Commits

  Idioma das mensagens                Inglês

  Estrutura                           `type(scope): description`

  Scope                               Obrigatório sempre que houver um
                                      módulo ou contexto identificável

  Descrição                           Imperativo, iniciando com letra
                                      minúscula

  Tamanho do título                   Preferencialmente até 72 caracteres

  Body                                Opcional

  Breaking changes                    Utilizar `!` e `BREAKING CHANGE:`

  Granularidade                       Um commit por alteração lógica
  -----------------------------------------------------------------------

O limite de 72 caracteres é uma recomendação de legibilidade, não uma
exigência do Conventional Commits.

## 10. Automação e validação

Para que as convenções sejam aplicadas consistentemente, recomenda-se
automatizar a validação das mensagens de commit.

### Commitlint

Valida se as mensagens de commit seguem o padrão estabelecido.

Documentação: https://commitlint.js.org/

### Husky

Permite executar validações automaticamente por meio dos hooks do Git,
como o `commit-msg`.

Documentação: https://typicode.github.io/husky/

### Commitizen

Oferece uma interface interativa para auxiliar na criação de mensagens
de commit padronizadas.

Documentação: https://commitizen-tools.github.io/commitizen/

### Combinação recomendada

Para o Veridit, a combinação recomendada é:

**Conventional Commits + Commitlint + Husky.**

O Commitlint valida a mensagem, enquanto o Husky permite executar essa
validação automaticamente antes de o commit ser concluído. O Commitizen
é opcional: pode facilitar a criação das mensagens, mas não substitui a
validação.

## 11. Documentação da convenção

Registre estas regras em um arquivo `CONTRIBUTING.md` ou em uma seção
específica da documentação de engenharia do projeto.

Dessa forma, o padrão de commits deixa de ser uma preferência individual
e passa a ser uma convenção compartilhada pela equipe.

------------------------------------------------------------------------

## Resumo

-   Adotar **Conventional Commits** como padrão.
-   Utilizar mensagens em inglês.
-   Seguir a estrutura `type(scope): description`.
-   Manter scopes consistentes com os módulos da aplicação.
-   Criar um commit para cada alteração lógica.
-   Escrever descrições objetivas no imperativo.
-   Utilizar `!` e `BREAKING CHANGE:` para alterações incompatíveis.
-   Automatizar a validação com **Commitlint** e **Husky**.
-   Documentar as regras para todos os colaboradores.
