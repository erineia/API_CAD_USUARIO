const { pessoas } = require('../models/pessoaModel');

function validatePessoa(data) {
  const nome = (data.nome || '').trim();
  const cpf = (data.cpf || '').trim();
  if (
    !nome ||
    !cpf ||
    nome.toLowerCase() === 'string' ||
    cpf.toLowerCase() === 'string' ||
    !/^[0-9]{11}$/.test(cpf)
  ) {
    return {
      valid: false,
      message:
        'Nome e CPF são obrigatórios. CPF deve ser numérico, 11 dígitos, o valor "string", é invalido',
    };
  }
  if (pessoas.find((p) => p.cpf === data.cpf)) {
    return { valid: false, message: 'CPF já cadastrado.' };
  }
  return { valid: true };
}

function registerPessoa(data) {
  const validation = validatePessoa(data);
  if (!validation.valid) return validation;
  pessoas.push(data);
  return { valid: true, pessoa: data };
}

function getAllPessoas() {
  return pessoas;
}

module.exports = {
  registerPessoa,
  getAllPessoas,
};
