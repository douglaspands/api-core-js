/**
 * @file Motor de APIs em Node.js com GraphQL e MongoDB.
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
const express = require('express');
const async = require('async');

const app = express();

async.auto({
  logger: (callback) => {
    // Configurando de log no Express
    const logger = require('./lib/express-log')(app);
    callback(null, logger);
  },
  modules: (callback) => {
    // Incluindo middlewares do express.js
    require('./lib/express-modules')(app);
    callback();
  },
  mongodb: ['logger', ({ logger }, callback) => {
    // Monta conexão do MongoDB
    const mongoConnect = require('./lib/mongodb-connect')(logger);
    mongoConnect((err, db) => {
      if (!err) app.set('mongodb', db);
      callback(null, db);
    });
  }],
  graphql: ['logger', 'mongodb', (_, callback) => {
    // Obtem todas as APIs GraphQL
    const graphqlHTTP = require('express-graphql');
    const { schema, root } = require('./lib/scan-apps-graphql')(app);
    app.use('/graphql', graphqlHTTP({
      schema: schema,
      rootValue: root,
      // pretty: true,
      graphiql: (process.env.NODE_ENV !== 'production')
    }));
    callback(null, Object.keys(root));
  }],
  rest: ['logger', 'mongodb', (_, callback) => {
    // Obtem todas as APIs REST
    const routes = require('./lib/scan-apps-rest')(app);
    callback(null, routes);
  }]
}, (_, { logger, rest, graphql }) => {
  // Iniciar servidor
  const port = 3000;
  app.listen(port, () => {
    let log = [];
    log.push(`Executando o API Server no localhost:${port}`);
    graphql.forEach(service => log.push(`-> GraphQL Service "${service}" registrado`));
    rest.forEach(route => log.push(`-> REST API [${route.method.toUpperCase()}] ${route.uri} registrado`));
    logger.info(log), console.log(log.join('\n'));
  });
});
