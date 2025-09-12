const createApp = require('./app');
const PORT = process.env.PORT || 2000;

createApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error('Erro ao iniciar ApolloServer:', err);
  });
