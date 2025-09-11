const userService = require('../services/userService');
const authService = require('../services/authService');

// Listar usuários de autenticação
exports.getAuthUsers = (req, res) => {
  res.json(userService.getAllAuthUsers());
};

// Novo serviço: cadastro de usuário de autenticação
exports.createAuthUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ mensagemUsuario: 'Username e password são obrigatórios.' });
  }
  const result = userService.createAuthUser(username, password);
  if (!result.valid) {
    return res.status(400).json({ mensagemUsuario: result.message });
  }
  res.status(201).json({
    message: 'Usuário de autenticação criado com sucesso',
    user: result.user,
  });
};

// Login por username/password
exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = authService.authenticate(username, password);
  if (!user) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dataHora = `${pad(now.getDate())}/${pad(
      now.getMonth() + 1,
    )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
      now.getMinutes(),
    )}:${pad(now.getSeconds())}`;
    res.status(401).type('application/json').json({
      mensagemUsuario: 'Usuário e senha inválidos',
      mensagemDesenvolvedor: 'Usuário e senha inválidos',
      categoria: 'ERRO',
      dataHora,
    });
    return;
  }
  const token = authService.generateToken(user);
  res.json({ success: true, token });
};
