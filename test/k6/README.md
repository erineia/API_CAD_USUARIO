# Sobre a API

Esta API gerencia usuários e pessoas, oferecendo endpoints RESTful e GraphQL. Foi construída com Node.js, Express, autenticação JWT e possui documentação Swagger.

**Principais funcionalidades:**

- **Cadastro de Usuário:** `POST /users` — Cria um novo usuário (username e password).
- **Login:** `POST /login` — Autentica e retorna um token JWT.
- **Cadastro de Pessoa:** `POST /pessoas` — Cadastra uma pessoa (requer JWT).
- **Consulta de Pessoas:** `GET /pessoas` — Lista pessoas cadastradas (requer JWT).
- **Listagem de Usuários:** `GET /users` — Lista todos os usuários (requer JWT).
- **GraphQL:** Endpoint `/graphql` para operações avançadas (requer JWT).

**Autenticação:**
Após o login, envie o token JWT no header:
`Authorization: Bearer <token>`

**Documentação:**

- REST: Swagger disponível em `/api-docs`
- GraphQL: Playground em `/graphql`

# Documentação dos Testes K6

Este diretório contém exemplos e utilitários para testes de performance com K6.

## Conceitos

### Thresholds

Regras para validar limites de performance (ex: tempo de resposta).
Definidas em `options` nos arquivos de teste, ex:

```js
export let options = {
  thresholds: {
    http_req_duration: ['p(95)<=2000', 'p(99)<=2000'],
    http_req_failed: ['rate<0.99'],
    pessoas_req_duration: ['p(95)<=2000'],
  },
};
```

### Checks

Validações automáticas das respostas HTTP.
Exemplo em `CadPessoa.test.js`:

```js
check(res, { 'registro status 201': (r) => r.status === 201 });
check(res, {
  'login status 200': (r) => r.status === 200,
  'token recebido': (r) => r.json('token') !== undefined,
});
```

### Helpers

Funções utilitárias para reaproveitar lógica.
Localizadas em `test/k6/helpers/` (ex: `getBaseUrl.js`, `generateCpf.js`, `randomUtils.js`).

### Trends

Métricas customizadas para monitorar tempos de resposta.
Exemplo em `CadPessoa.test.js`:

```js
import { Trend } from 'k6/metrics';
const pessoasTrend = new Trend('pessoas_req_duration');
pessoasTrend.add(res.timings.duration);
```

No grupo `Cadastrar pessoa`, o tempo de cada requisição ao endpoint `/pessoas` é registrado.

### Faker

Geração de dados aleatórios para os testes.
Usado via:

```js
import { Faker } from 'k6/x/faker';
const fakeGen = new Faker();
return {
  nome: fakeGen.person.firstName(),
  sobrenome: fakeGen.person.lastName(),
  nomePai: fakeGen.person.firstName(),
  nomeMae: fakeGen.person.firstName(),
};
```

### Variável de Ambiente

Permite configurar a base da API sem alterar o código.
Configurada em `getBaseUrl.js` e passada via `--env BASE_URL=...` na execução do k6.

```js
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:5000';
}
```

Exemplo de uso em `CadPessoa.test.js`:

```js
const BASE_URL = getBaseUrl();
http.post(`${BASE_URL}/users`, ...);
http.post(`${BASE_URL}/login`, ...);
http.post(`${BASE_URL}/pessoas`, ...);
```

### Stages

Define ramp-up, duração e ramp-down dos usuários virtuais.
Exemplo:

```js
stages: [
  { duration: '3s', target: 10 },
  { duration: '15s', target: 10 },
  { duration: '5s', target: 0 },
],
```

### Reaproveitamento de Resposta

Utiliza dados de uma requisição em outra, dentro do mesmo fluxo de teste.
Exemplo: o token do login é usado para autenticar o cadastro de pessoa.

```js
let token = '';
token = res.json('token');
Authorization: `Bearer ${token}`;
```

### Uso de Token de Autenticação

Utilização de JWT para acessar rotas protegidas.
Exemplo:

```js
Authorization: `Bearer ${token}`;
```

### Data-Driven Testing

Execução de testes com múltiplos conjuntos de dados externos.
Exemplo em `loginDataDriven.test.js` usando `data/LoginDataDriven.data.json`:

```js
const loginData = JSON.parse(open('data/LoginDataDriven.data.json'));
export default function () {
  const user = loginData[__ITER % loginData.length];
  registrarUsuario(user.username, user.password);
  const BASE_URL = getBaseUrl();
  const url = `${BASE_URL}/login`;
  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });
}
```

### Groups

Organiza o teste em blocos para melhor leitura.
Exemplo:

```js
group('Registrar usuário', function () { ... });
```

## Comando utiliazdos para execução dos testes em k6

```bash
k6 run test/k6/loginDataDriven.test.js
k6 run test/k6/CadPessoa.test.js
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run test/k6/CadPessoa.test.js
```

---
