import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

import http from 'k6/http';
import faker from 'k6/x/faker';
import { buildPessoa } from './factory/PessoaFactory.js';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { randomString } from './helpers/randomUtils.js';

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<=2000', 'p(99)<=2000'],
    http_req_failed: ['rate<0.99'],
    pessoas_req_duration: ['p(95)<=2000'],
  },
  stages: [
    { duration: '3s', target: 10 },
    { duration: '15s', target: 10 },
    { duration: '5s', target: 0 },
  ],
};

const pessoasTrend = new Trend('pessoas_req_duration');

export default function () {
  const BASE_URL = getBaseUrl();
  let username = `user_${randomString(6)}`;
  let password = randomString(8);
  let token = '';

  group('Registrar usuário', function () {
    const res = http.post(
      `${BASE_URL}/users`,
      JSON.stringify({ username, password }),
      { headers: { 'Content-Type': 'application/json' } },
    );

    check(res, {
      'registro status 201': (r) => r.status === 201,
    });
  });

  group('Login', function () {
    const res = http.post(
      `${BASE_URL}/login`,
      JSON.stringify({ username, password }),
      { headers: { 'Content-Type': 'application/json' } },
    );

    check(res, {
      'login status 200': (r) => r.status === 200,
      'token recebido': (r) => r.json('token') !== undefined,
    });

    token = res.json('token');
  });

  group('Cadastrar pessoa', function () {
    const pessoa = buildPessoa();

    const res = http.post(`${BASE_URL}/pessoas`, JSON.stringify(pessoa), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      tags: { name: 'CadastrarPessoa' },
    });

    pessoasTrend.add(res.timings.duration);

    check(res, {
      'cadastro pessoa status 201': (r) => r.status === 201,
    });
  });

  sleep(1);
}
