/**
 * @file Motor de APIs em Node.js com GraphQL e MongoDB.
 * @author @douglaspands
 * @since 2017-12-26
 */
'use strict';
// Obtendo informações do servidor
const { name, version } = require('./package');
// Inicializando servidor
const app = require('express')();
// Armazenando diretorio do servidor
app.set('root', __dirname);
// Configurando log
const logger = require('./middleware/express-log')(app);
// Executando modulos sincronamente
(async () => {
  // Incluindo middleware do Express
  require('./middleware/express-modules')(app);
  // Inicializando banco de dados
  const db = await require('./middleware/mongodb-connect')(app);
  // Registrando
  const routes = await require('./middleware/express-register-routes')(app);
  return routes;
})().then(({ rest, graphql }) => {
  // Obtendo a porta do servidor
  const port = process.env.PORT || 3000;
  // Inicializando o servidor
  app.listen(port, () => {
    logger.info(`Executando o "${name}@${version}" na url: http://localhost:${port} (${(process.env.NODE_ENV || 'develop')})`);
    rest.forEach(route => logger.info(`REST registrado....: ${route.uri} [${route.verb}]`));
    graphql.forEach(service => logger.info(`GraphQL registrado.: ${service}`));
  });
  // Criando health-check
  //require('./middleware/health-check')(rest, graphql, app, server);
}).catch(error => logger.error(error.stack));
