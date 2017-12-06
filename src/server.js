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
    const scanAppsGraphQL = require('./lib/scan-apps-graphql');
    const services = scanAppsGraphQL(app);
    callback(null, services);
  }],
  rest: ['logger', 'mongodb', (_, callback) => {
    // Obtem todas as APIs REST
    const routes = require('./lib/scan-apps-rest')(app);
    callback(null, routes);
  }]
}, (_, { logger, rest, graphql }) => {
  // Iniciar servidor
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Executando o "core-api-js" na url: http://localhost:${port} (${(process.env.NODE_ENV || 'develop')})`);
    graphql.forEach(service => logger.info(`GraphQL Service "${service}" registrado`));
    rest.forEach(route => logger.info(`REST API [${route.method.toUpperCase()}] ${route.uri} registrado`));
  });
});
