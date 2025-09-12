const { gql } = require('apollo-server-express');
const resolvers = require('./resolvers');

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
    registerPessoa(
      nome: String!
      sobrenome: String!
      cpf: String!
      dataNascimento: String!
      nomePai: String
      nomeMae: String
      telefone: String
      sexo: String
    ): PessoaResponse!
    login(username: String!, password: String!): User!
  }
`;

module.exports = { typeDefs, resolvers };
