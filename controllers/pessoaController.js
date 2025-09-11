const pessoaService = require('../services/pessoaService');

exports.register = (req, res) => {
  const result = pessoaService.registerPessoa(req.body);
  if (!result.valid) {
    return res.status(400).json({
      mensagemUsuario: result.message,
    });
  }
  res
    .status(201)
    .json({ message: 'Pessoa cadastrada com sucesso', pessoa: result.pessoa });
};

exports.getPessoas = (req, res) => {
  res.json(pessoaService.getAllPessoas());
};
