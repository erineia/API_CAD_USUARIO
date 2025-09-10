const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const SECRET = process.env.JWT_SECRET || 'segredo';

exports.register = (req, res) => {
  const result = userService.registerUser(req.body);
  if (!result.valid) return res.status(400).json({ error: result.message });
  res
    .status(201)
    .json({ message: 'Usuário cadastrado com sucesso', user: result.user });
};

exports.login = (req, res) => {
  const { cpf, senha } = req.body;
  const user = userService.authenticateUser(cpf, senha);
  if (!user) return res.status(401).json({ error: 'CPF ou senha inválidos' });
  const token = jwt.sign({ cpf: user.cpf }, SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.getUsers = (req, res) => {
  res.json(userService.getAllUsers());
};

exports.getUserByCpf = (req, res) => {
  const user = userService.getUserByCpf(req.params.cpf);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
};
