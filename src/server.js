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
    app.set('logger', logger)
    callback(null, logger);
  },
  modules: ['logger', (_, callback) => {
    // Incluindo middlewares do express.js
    require('./lib/express-modules')(app);
    callback();
  }],
  mongodb: ['logger', (_, callback) => {
    // Monta conexão do MongoDB
    require('./lib/mongodb-connect')(app).then(callback);
  }],
  graphql: ['logger', 'mongodb', (_, callback) => {
    // Obtem todas as APIs GraphQL
    require('./lib/scan-apps-graphql')(app).then(services => callback(null, services));
  }],
  rest: ['logger', 'mongodb', (_, callback) => {
    // Obtem todas as APIs REST
    require('./lib/scan-apps-rest')(app).then(routes => callback(null, routes));
  }]
}, (_, { logger, rest, graphql }) => {
  // Iniciar servidor
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Executando o "core-api-js" na url: http://localhost:${port} (${(process.env.NODE_ENV || 'develop')})`);
    graphql.forEach(service => logger.info(`GraphQL registrado.: ${service}`));
    rest.forEach(route => logger.info(`REST registrado....: ${route.uri} [${route.method}]`));
  });
});
