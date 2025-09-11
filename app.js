require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const userController = require('./controllers/userController');
const pessoaController = require('./controllers/pessoaController');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo';

// Swagger setup
const swaggerDocument = require('./swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dataHora = `${pad(now.getDate())}/${pad(
      now.getMonth() + 1,
    )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
      now.getMinutes(),
    )}:${pad(now.getSeconds())}`;
    return res.status(401).json({
      mensagemUsuario: 'Usuário não está autenticado.',
      mensagemDesenvolvedor: 'Usuário não está autenticado.',
      categoria: 'ERRO',
      dataHora,
    });
  }
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const dataHora = `${pad(now.getDate())}/${pad(
        now.getMonth() + 1,
      )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
        now.getMinutes(),
      )}:${pad(now.getSeconds())}`;
      return res.status(403).json({
        mensagemUsuario: 'Token inválido ou expirado.',
        mensagemDesenvolvedor: 'Token inválido ou expirado.',
        categoria: 'ERRO',
        dataHora,
      });
    }
    req.user = user;
    next();
  });
}

app.post('/users', userController.createAuthUser);

app.get('/users', authenticateToken, userController.getAuthUsers);

app.post('/pessoas', authenticateToken, pessoaController.register);

app.post('/login', userController.login);

app.get('/pessoas', authenticateToken, pessoaController.getPessoas);

module.exports = app;
