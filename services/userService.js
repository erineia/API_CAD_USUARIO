const { users } = require('../models/userModel');
const bcrypt = require('bcryptjs');

function validateUser(data) {
  if (!data.nome || !data.cpf) {
    return { valid: false, message: 'Nome e CPF são obrigatórios.' };
  }
  if (users.find((u) => u.cpf === data.cpf)) {
    return { valid: false, message: 'CPF já cadastrado.' };
  }
  return { valid: true };
}

function registerUser(data) {
  const validation = validateUser(data);
  if (!validation.valid) return validation;
  const hashedPassword = bcrypt.hashSync(data.senha, 8);
  const user = { ...data, senha: hashedPassword };
  users.push(user);
  return { valid: true, user };
}

function authenticateUser(cpf, senha) {
  const user = users.find((u) => u.cpf === cpf);
  if (!user) return null;
  const valid = bcrypt.compareSync(senha, user.senha);
  return valid ? user : null;
}

function getAllUsers() {
  return users.map(({ senha, ...rest }) => rest);
}

function getUserByCpf(cpf) {
  const user = users.find((u) => u.cpf === cpf);
  if (!user) return null;
  const { senha, ...rest } = user;
  return rest;
}

module.exports = {
  registerUser,
  authenticateUser,
  getAllUsers,
  getUserByCpf,
};
