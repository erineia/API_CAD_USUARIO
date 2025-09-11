const { pessoas } = require('../models/pessoaModel');
const mensagens = require('../mensagensValidacao');

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
      message: mensagens.MSG_VALIDACAO_CPF_NOME,
    };
  }
  if (pessoas.find((p) => p.cpf === data.cpf)) {
    return { valid: false, message: mensagens.MSG_CPF_DUPLICADO };
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
  validatePessoa,
  getAllPessoas,
};
