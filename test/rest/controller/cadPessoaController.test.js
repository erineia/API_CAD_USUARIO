const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const app = require('../../../app');
const expect = chai.expect;
const pessoaService = require('../../../services/pessoaService');
const mensagens = require('../../../mensagensValidacao');

describe('Cad Pessoa - Controller', () => {
  let token;
  const usuario = require('../fixture/requisicoes/login/postLogin.json');
  const postCadPessoa = require('../fixture/requisicoes/cadastro/postCadPessoa.json');

  before(async () => {
    await request(app).post('/users').send(usuario);
    const res = await request(app).post('/login').send(usuario);
    token = res.body.token || res.body.token;
  });

  it('deve validar nome/CPF inválidos retornando 400', async () => {
    const pessoaServiceMock = sinon.stub(pessoaService, 'validatePessoa');
    pessoaServiceMock.throws(mensagens.MSG_VALIDACAO_CPF_NOME);

    const pessoaInvalida = { ...postCadPessoa, nome: 'string', cpf: 'string' };
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(pessoaInvalida);

    expect(res.status).to.equal(400);
    expect(res.body.mensagemUsuario).to.equal(mensagens.MSG_VALIDACAO_CPF_NOME);
    sinon.restore();
  });

  it('deve cadastrar pessoa com sucesso retornando 201', async () => {
    const pessoaServiceMock = sinon.stub(pessoaService, 'registerPessoa');
    pessoaServiceMock.returns({ valid: true, pessoa: postCadPessoa });
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal(mensagens.MSG_SUCESSO);
    expect(res.body.pessoa.cpf).to.equal(postCadPessoa.cpf);
    sinon.restore();
  });

  it('deve validar CPF já cadastrado retornando 400', async () => {
    const pessoaServiceMock = sinon.stub(pessoaService, 'registerPessoa');
    pessoaServiceMock.returns({
      valid: false,
      message: mensagens.MSG_CPF_DUPLICADO,
    });
    const res = await request(app)
      .post('/pessoas')
      .set('Authorization', `Bearer ${token}`)
      .send(postCadPessoa);

    expect(res.status).to.equal(400);
    expect(res.body.mensagemUsuario).to.equal(mensagens.MSG_CPF_DUPLICADO);
    sinon.restore();
  });

  it('deve validar a não autenticação retornando 401', async () => {
    const res = await request(app).post('/pessoas').send(postCadPessoa);
    expect(res.status).to.equal(401);
    expect(res.body.mensagemUsuario).to.equal(
      mensagens.MSG_USUARIO_NAO_AUTENTICADO,
    );
  });
});
