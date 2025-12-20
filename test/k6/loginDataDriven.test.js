import { check } from 'k6';
import http from 'k6/http';
import { registrarUsuario } from './factory/RegistroUsuario.js';
import { getBaseUrl } from './helpers/getBaseUrl.js';
const loginData = JSON.parse(open('data/LoginDataDriven.data.json'));

export let options = {
  vus: 10,
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const user = loginData[__ITER % loginData.length];
  registrarUsuario(user.username, user.password);
  const BASE_URL = getBaseUrl();
  const url = `${BASE_URL}/login`;
  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post(url, payload, params);
  check(res, {
    'login status 200': (r) => r.status === 200,
    'token recebido': (r) => r.json('token') !== undefined,
  });
}
