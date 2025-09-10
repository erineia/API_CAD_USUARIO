const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'segredo';

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               sobrenome: { type: string }
 *               cpf: { type: string }
 *               dataNascimento: { type: string }
 *               nomePai: { type: string }
 *               nomeMae: { type: string }
 *               telefone: { type: string }
 *               sexo: { type: string }
 *               senha: { type: string }
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 *       400:
 *         description: Erro de validação
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf: { type: string }
 *               senha: { type: string }
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: CPF ou senha inválidos
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários (protegido)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
router.get('/users', authenticateToken, userController.getUsers);

/**
 * @swagger
 * /users/{cpf}:
 *   get:
 *     summary: Consulta usuário por CPF (protegido)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/users/:cpf', authenticateToken, userController.getUserByCpf);

module.exports = router;
