import http from 'k6/http';
import { getBaseUrl } from '../helpers/getBaseUrl.js';

/**
 * Registra um usuário na API
 * @param {string} username
 * @param {string} password
 * @returns {object} response do http.post
 */
export function registrarUsuario(username, password) {
  const BASE_URL = getBaseUrl();
  const res = http.post(
    `${BASE_URL}/users`,
    JSON.stringify({ username, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  return res;
}
