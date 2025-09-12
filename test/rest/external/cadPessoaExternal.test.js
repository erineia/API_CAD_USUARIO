const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mensagens = require('../../../mensagensValidacao');

require('dotenv').config();

describe('Cad Pessoa - External', () => {
  let token;
  const postCadPessoa = require('../../fixture/requisicoes/cadastro/postCadPessoaExternal.json');

  before(async () => {
    const usuario = require('../../fixture/requisicoes/login/postLogin.json');
    await request(process.env.BASE_URL_REST).post('/users').send(usuario);
    const respostaLogin = await request(process.env.BASE_URL_REST)
      .post('/login')
      .send(usuario);

    token = respostaLogin.body.token || respostaLogin.body.token;
  });

  it('external: deve validar nome/CPF inválidos retornando 400', async () => {
    const pessoaInvalida = { ...postCadPessoa, nome: 'string', cpf: 'string' };
    const resposta = await request(process.env.BASE_URL_REST)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(pessoaInvalida);

    expect(resposta.status).to.equal(400);
    expect(resposta.body.mensagemUsuario).to.equal(
      mensagens.MSG_VALIDACAO_CPF_NOME,
    );
  });

  it('external: deve cadastrar pessoa com sucesso retornando 201', async () => {
    const cpfUnico = String(
      Math.floor(10000000000 + Math.random() * 89999999999),
    );
    const pessoaNova = { ...postCadPessoa, cpf: cpfUnico };
    const resposta = await request(process.env.BASE_URL_REST)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(pessoaNova);

    expect(resposta.status).to.equal(201);
    expect(resposta.body.message).to.equal(mensagens.MSG_SUCESSO);
    expect(resposta.body.pessoa.cpf).to.equal(cpfUnico);
  });

  it('external: deve validar CPF já cadastrado retornando 400', async () => {
    await request(process.env.BASE_URL_REST)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    const resposta = await request(process.env.BASE_URL_REST)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    expect(resposta.status).to.equal(400);
    expect(resposta.body.mensagemUsuario).to.equal(mensagens.MSG_CPF_DUPLICADO);
  });

  it('external: deve validar a não autenticação retornando 401', async () => {
    const resposta = await request(process.env.BASE_URL_REST)
      .post('/pessoas')
      .send(postCadPessoa);
    expect(resposta.status).to.equal(401);
    expect(resposta.body.mensagemUsuario).to.equal(
      mensagens.MSG_USUARIO_NAO_AUTENTICADO,
    );
  });
});
