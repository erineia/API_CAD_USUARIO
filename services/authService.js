const jwt = require('jsonwebtoken');
const { authenticateAuthUser } = require('./userService');

const SECRET = process.env.JWT_SECRET || 'segredo';

function authenticate(username, password) {
  return authenticateAuthUser(username, password);
}

function generateToken(user) {
  // O token pode conter o username
  return jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
}

module.exports = {
  authenticate,
  generateToken,
};
