function getAllAuthUsers() {
  return authUsers.map(({ password, ...rest }) => rest);
}
const { users } = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Array para usuários de autenticação
const authUsers = [];

function validateAuthUser(username, password) {
  if (!username || !password) {
    return { valid: false, message: 'Username e password são obrigatórios.' };
  }
  if (
    username.toLowerCase() === 'string' ||
    password.toLowerCase() === 'string'
  ) {
    return {
      valid: false,
      message: 'O valor "string" não são valores válidos.',
    };
  }
  if (authUsers.find((u) => u.username === username)) {
    return { valid: false, message: 'Username já cadastrado.' };
  }
  return { valid: true };
}

function createAuthUser(username, password) {
  const validation = validateAuthUser(username, password);
  if (!validation.valid) return validation;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = { username, password: hashedPassword };
  authUsers.push(user);
  return { valid: true, user };
}

function registerUser(data) {
  const validation = validatePessoa(data);
  if (!validation.valid) return validation;
  // Não armazena senha para pessoas
  const { senha, ...userData } = data;
  users.push(userData);
  return { valid: true, user: userData };
}

function authenticateAuthUser(username, password) {
  const user = authUsers.find((u) => u.username === username);
  if (!user) return null;
  const valid = bcrypt.compareSync(password, user.password);
  return valid ? user : null;
}

module.exports = {
  createAuthUser,
  registerUser,
  authenticateAuthUser,
  getAllAuthUsers,
};
