const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function getUserFromToken(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

async function createApp() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token);
      return { user };
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  return app;
}

module.exports = createApp;
