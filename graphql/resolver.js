const pessoaService = require('../services/pessoaService');
const jwt = require('jsonwebtoken');
const mensagens = require('../mensagensValidacao');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const resolvers = {
  Query: {
    async getPessoa(_, { cpf }) {
      return await pessoaService.getPessoaByCpf(cpf);
    },
  },
  Mutation: {
    async registerPessoa(_, args, context) {
      if (!context.user) {
        return {
          valid: false,
          message: mensagens.MSG_USUARIO_NAO_AUTENTICADO,
          mensagemUsuario: mensagens.MSG_USUARIO_NAO_AUTENTICADO,
        };
      }
      const result = await pessoaService.registerPessoa(args);
      if (!result.valid) {
        return {
          valid: false,
          message: result.message,
          mensagemUsuario: result.message,
        };
      }
      return {
        valid: true,
        pessoa: result.pessoa,
        message: mensagens.MSG_SUCESSO,
        mensagemUsuario: mensagens.MSG_SUCESSO,
      };
    },
    async login(_, { username, password }) {
      // Simulação de login, retorne token JWT
      if (username === 'Neia' && password === '123456') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return { username, token };
      }
      throw new Error('Usuário ou senha inválidos');
    },
    // async transfer(_, { valor, cpfOrigem, cpfDestino }, context) {
    //   if (!context.user) {
    //     return { success: false, message: 'Token JWT inválido ou ausente.' };
    //   }
    //   // Chame o serviço REST de transferência aqui
    //   // Exemplo: await transferService.transfer(valor, cpfOrigem, cpfDestino);
    //   return { success: true, message: 'Transferência realizada com sucesso.' };
    // },
  },
};

module.exports = resolvers;
