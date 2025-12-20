# Documentação dos Testes K6

Este diretório contém exemplos e utilitários para testes de performance e data-driven usando K6 e xk6-faker.

## Conceitos e Onde Estão no Código

### Thresholds

- **O que é:** Regras para validar limites de performance (ex: tempo de resposta).
- **Onde está:**
  - Definido em `options` nos arquivos de teste, ex: `CadPessoa.test.js`, `loginDataDriven.test.js`.
  - Exemplo:
    ```js
    export let options = {
      thresholds: {
        http_req_duration: ['p(95)<=2000'],
      },
    };
    ```

### Checks

- **O que é:** Validações automáticas sobre as respostas HTTP.
- **Onde está:**
  - Usado em todos os testes, ex: `CadPessoa.test.js`, `loginDataDriven.test.js`.
  - Exemplo:
    ```js
    check(res, { 'login status 200': (r) => r.status === 200 });
    ```

### Helpers

- **O que é:** Funções utilitárias para reaproveitamento de lógica.
- **Onde está:**
  - Pasta `test/k6/helpers/` (ex: `getBaseUrl.js`, `generateCpf.js`, `randomUtils.js`).

### Trends

- **O que é:** Métricas customizadas para monitorar tempos de resposta específicos.
- **Onde está:**
  - Definido em `CadPessoa.test.js`:
    ```js
    import { Trend } from 'k6/metrics';
    const pessoasTrend = new Trend('pessoas_req_duration');
    pessoasTrend.add(res.timings.duration);
    ```

### Faker

- **O que é:** Geração de dados aleatórios para os testes.
- **Onde está:**
  - Usado via `import faker from 'k6/x/faker'` em `PessoaFactory.js` e `CadPessoa.test.js`.

### Variável de Ambiente

- **O que é:** Permite configurar a base da API sem alterar o código.
- **Onde está:**
  - Usado em `getBaseUrl.js` e passado via `--env BASE_URL=...` na execução do k6.

### Stages

- **O que é:** Define ramp-up, duração e ramp-down dos usuários virtuais.
- **Onde está:**
  - Definido em `options` dos testes de performance, ex: `CadPessoa.test.js`.
    ```js
    stages: [
      { duration: '3s', target: 10 },
      { duration: '15s', target: 10 },
      { duration: '5s', target: 0 },
    ],
    ```

### Reaproveitamento de Resposta

- **O que é:** Uso de dados de uma resposta em requisições seguintes.
- **Onde está:**
  - Exemplo em `CadPessoa.test.js`, onde o token do login é usado para autenticar o cadastro de pessoa.

### Uso de Token de Autenticação

- **O que é:** Utilização de JWT ou outro token para acessar rotas protegidas.
- **Onde está:**
  - Exemplo em `CadPessoa.test.js`:
    ```js
    Authorization: `Bearer ${token}`;
    ```

### Data-Driven Testing

- **O que é:** Execução de testes com múltiplos conjuntos de dados externos.
- **Onde está:**
  - Exemplo em `loginDataDriven.test.js` usando o arquivo `data/LoginDataDriven.data.json`.

### Groups

- **O que é:** Organização do teste em blocos lógicos para melhor leitura e relatórios.
- **Onde está:**
  - Usado em `CadPessoa.test.js`:
    ```js
    group('Registrar usuário', function () { ... });
    ```

---

Consulte os arquivos dentro de `test/k6` para exemplos práticos de cada conceito.
