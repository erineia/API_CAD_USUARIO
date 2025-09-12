const { gql } = require('apollo-server-express');
const pessoaService = require('../services/pessoaService');
const jwt = require('jsonwebtoken');
const mensagens = require('../mensagensValidacao');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const typeDefs = gql`
  input RegisterPessoaInput {
    nome: String!
    sobrenome: String!
    cpf: String!
    dataNascimento: String!
    nomePai: String
    nomeMae: String
    telefone: String
    sexo: String
  }

  type Pessoa {
    nome: String!
    sobrenome: String!
    cpf: String!
    dataNascimento: String!
    nomePai: String
    nomeMae: String
    telefone: String
    sexo: String
  }

  type PessoaResponse {
    valid: Boolean!
    pessoa: Pessoa
    message: String
    mensagemUsuario: String
  }

  type User {
    username: String!
    token: String
  }

  type Query {
    getPessoa(cpf: String!): Pessoa
  }

  type Mutation {
    registerPessoa(input: RegisterPessoaInput!): PessoaResponse!
    login(username: String!, password: String!): User!
  }
`;

const resolvers = {
  Query: {
    async getPessoa(_, { cpf }) {
      return await pessoaService.getPessoaByCpf(cpf);
    },
  },
  Mutation: {
    async registerPessoa(_, { input }, context) {
      if (!context.user) {
        return {
          valid: false,
          message: mensagens.MSG_USUARIO_NAO_AUTENTICADO,
          mensagemUsuario: mensagens.MSG_USUARIO_NAO_AUTENTICADO,
        };
      }
      const result = await pessoaService.registerPessoa(input);
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
  },
};

module.exports = { typeDefs, resolvers };
