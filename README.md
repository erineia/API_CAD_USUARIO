# User Management API

API RESTful para gerenciamento de usuários utilizando Node.js, Express, JWT e Swagger.

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

A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse `http://localhost:3000/api-docs` para visualizar e testar os endpoints via Swagger UI.

## Endpoints

### POST /register

Cadastra um novo usuário.

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
  "sexo": "M",
  "senha": "minhaSenhaSegura"
}
```

**Respostas:**

- 201: Usuário cadastrado
- 400: Erro de validação

### POST /login

Autentica um usuário e retorna um token JWT.

**Body JSON:**

```
{
  "cpf": "12345678900",
  "senha": "minhaSenhaSegura"
}
```

**Respostas:**

- 200: `{ "token": "..." }`
- 401: CPF ou senha inválidos

### GET /users

Lista todos os usuários cadastrados (protegido por JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Respostas:**

- 200: Lista de usuários
- 401: Não autorizado

### GET /users/:cpf

Consulta usuário por CPF (protegido por JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Respostas:**

- 200: Dados do usuário
- 404: Usuário não encontrado
- 401: Não autorizado

## Exemplo de Autenticação

1. Faça login para obter o token JWT.
2. Use o token no header `Authorization` para acessar endpoints protegidos:

```
Authorization: Bearer seuTokenAqui
```

---

Qualquer dúvida, consulte a documentação Swagger ou o código fonte.
