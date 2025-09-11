const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const app = require('../../../app');
const expect = chai.expect;

describe('Cad Pessoa - Controller', () => {
  let token;
  const usuario = require('../fixture/requisicoes/login/postLogin.json');
  const postCadPessoa = require('../fixture/cadastro/postCadPessoa.json');

  before(async () => {
    await request(app).post('/users').send(usuario);
    const res = await request(app).post('/login').send(usuario);
    token = res.body.token || res.body.token;
  });

  it('deve retornar erro para nome/CPF inválidos', async () => {
    const pessoaInvalida = { ...postCadPessoa, nome: 'string', cpf: 'string' };
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(pessoaInvalida);

    expect(res.status).to.equal(400);
    expect(res.body.mensagemUsuario).to.equal(
      'Nome e CPF são obrigatórios. CPF deve ser numérico, 11 dígitos, o valor "string", é invalido',
    );
  });

  it('deve cadastrar pessoa com sucesso', async () => {
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Pessoa cadastrada com sucesso');
    expect(res.body.pessoa.cpf).to.equal(postCadPessoa.cpf);
  });

  it('deve retornar erro de CPF já cadastrado', async () => {
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    expect(res.status).to.equal(400);
    expect(res.body.mensagemUsuario).to.equal('CPF já cadastrado.');
  });
});
