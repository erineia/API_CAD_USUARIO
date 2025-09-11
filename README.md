# User Management API

API RESTful para gerenciamento de usuários e pessoas utilizando Node.js, Express, JWT e Swagger.

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:

```bash
npm install
```

## Como iniciar a aplicação

1. (Opcional) Crie um arquivo `.env` na raiz com a variável `JWT_SECRET`:

```
JWT_SECRET=seuSegredoAqui
```

2. Inicie o servidor:

```bash
npm start
```

A API estará disponível em `http://localhost:5000`.

## Documentação Swagger

Acesse `http://localhost:5000/api-docs` para visualizar e testar os endpoints via Swagger UI.

## Endpoints

### Usuários

#### POST /users

Cadastra um novo usuário para autenticação.

**Body JSON:**

```
{
  "username": "usuario1",
  "password": "senhaSegura"
}
```

**Respostas:**

- 201: Usuário criado
- 400: Erro de validação

#### GET /users

Lista todos os usuários cadastrados (protegido por JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Respostas:**

- 200: Lista de usuários
- 401: Não autorizado

### Pessoas

#### POST /pessoas

Cadastra uma nova pessoa (protegido por JWT).

**Body JSON:**

```
{
  "nome": "João",
  "sobrenome": "Silva",
  "cpf": "12345678900",
  "dataNascimento": "1990-01-01",
  "nomePai": "Carlos Silva",
  "nomeMae": "Maria Silva",
  "telefone": "11999999999",
  "sexo": "M"
}
```

**Respostas:**

- 201: Pessoa cadastrada
- 400: Erro de validação

#### GET /pessoas

Lista todas as pessoas cadastradas (protegido por JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Respostas:**

- 200: Lista de pessoas
- 401: Não autorizado

#### GET /pessoas/:cpf

Consulta pessoa por CPF (protegido por JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Respostas:**

- 200: Dados da pessoa
- 404: Pessoa não encontrada
- 401: Não autorizado

### Autenticação

#### POST /login

Autentica um usuário e retorna um token JWT.

**Body JSON:**

```
{
  "username": "usuario1",
  "password": "senhaSegura"
}
```

**Respostas:**

- 200: `{ "success": true, "token": "..." }`
- 401: Usuário ou senha inválidos

## Exemplo de Autenticação

1. Faça login para obter o token JWT.
2. Use o token no header `Authorization` para acessar endpoints protegidos:

```
Authorization: Bearer seuTokenAqui
```

---

Qualquer dúvida, consulte a documentação Swagger ou o código fonte.
