const pessoaService = require('../services/pessoaService');

exports.register = (req, res) => {
  const result = pessoaService.registerPessoa(req.body);
  if (!result.valid) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dataHora = `${pad(now.getDate())}/${pad(
      now.getMonth() + 1,
    )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
      now.getMinutes(),
    )}:${pad(now.getSeconds())}`;
    return res.status(400).json({
      mensagemUsuario: result.message,
      mensagemDesenvolvedor: result.message,
      categoria: 'ERRO',
      dataHora,
    });
  }
  res
    .status(201)
    .json({ message: 'Pessoa cadastrada com sucesso', pessoa: result.pessoa });
};

exports.getPessoas = (req, res) => {
  res.json(pessoaService.getAllPessoas());
};

exports.getPessoaByCpf = (req, res) => {
  const pessoa = pessoaService.getPessoaByCpf(req.params.cpf);
  if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });
  res.json(pessoa);
};
