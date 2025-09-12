const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mensagens = require('../../../mensagensValidacao');
require('dotenv').config();

describe('Cad Pessoa - GraphQL External', () => {
  let token;
  before(async () => {
    const usuario = require('../../fixture/requisicoes/login/loginGraphql.json');
    const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(usuario);

    token = respostaLogin.body.data.login.token;
  });

  beforeEach(() => {
    postCadPessoa = require('../../fixture/requisicoes/cadastro/postCadPessoaExternalGraphql.json');
  });

  it('graphql: deve validar nome/CPF inválidos retornando mensagem de erro', async () => {
    const mutation = JSON.parse(JSON.stringify(postCadPessoa));
    mutation.variables.nome = 'string';
    mutation.variables.cpf = 'string';
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.registerPessoa.mensagemUsuario).to.equal(
      mensagens.MSG_VALIDACAO_CPF_NOME,
    );
  });

  it('graphql: deve cadastrar pessoa com sucesso', async () => {
    const mutation = JSON.parse(JSON.stringify(postCadPessoa));
    const cpfUnico = String(
      Math.floor(10000000000 + Math.random() * 89999999999),
    );
    mutation.variables.cpf = cpfUnico;
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.registerPessoa.message).to.equal(
      mensagens.MSG_SUCESSO,
    );
    expect(resposta.body.data.registerPessoa.pessoa.cpf).to.equal(cpfUnico);
  });

  it('graphql: deve validar CPF já cadastrado retornando mensagem de erro', async () => {
    const mutation = JSON.parse(JSON.stringify(postCadPessoa));

    await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);

    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);
    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.registerPessoa.mensagemUsuario).to.equal(
      mensagens.MSG_CPF_DUPLICADO,
    );
  });

  it('graphql: deve validar a não autenticação retornando mensagem de erro', async () => {
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(postCadPessoa);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.registerPessoa.mensagemUsuario).to.equal(
      mensagens.MSG_USUARIO_NAO_AUTENTICADO,
    );
  });
});
