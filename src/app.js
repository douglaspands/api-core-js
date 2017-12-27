/**
 * @file Motor de APIs em Node.js com GraphQL e MongoDB.
 * @author douglaspands
 * @since 2017-12-26
 */
'use strict';
const app = require('express')();
(async () => {
  return {
    logger: await require('./middleware/express-log')(app),
    modules: await require('./middleware/express-modules')(app),
    mongodb: await require('./middleware/mongodb-connect')(app),
    graphql: await require('./middleware/scan-apps-graphql')(app),
    rest: await require('./middleware/scan-apps-rest')(app)
  };
})().then(({ logger, rest, graphql }) => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Executando o "core-api-js" na url: http://localhost:${port} (${(process.env.NODE_ENV || 'develop')})`);
    graphql.forEach(service => logger.info(`GraphQL registrado.: ${service}`));
    rest.forEach(route => logger.info(`REST registrado....: ${route.uri} [${route.method}]`));
  });
})
