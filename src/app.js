/**
 * @file Motor de APIs REST/GraphQL com MongoDB e Redis.
 * @author @douglaspands
 * @since 2017-12-26
 * @version 2.9.0-20181031
 */
'use strict';
// Obtendo informações do servidor
const { name, version } = require('./package');
// Inicializando servidor
const http = require('http');
const app = require('express')();
const app_health = require('express')();
// Armazenando diretorio do servidor e configurações
app.set('root', __dirname);
app.set('package', require('./package'));
// Configurando log
const { logger } = require('./middleware/express-log')(app);
// Executando modulos sincronamente
(async () => {
    // Incluindo middleware do Express
    require('./middleware/express-modules')(app);
    // Inicializando cache
    require('./middleware/express-redis')(app);
    // Inicializando banco de dados
    await require('./middleware/express-mongodb')(app);
    // Execução antes da API
    require('./middleware/express-pre-api')(app);
    // Registrando APIs
    const apis = require('./middleware/express-register-apis')(app);
    return apis;
})().then(({ rest, graphql }) => {
    // Inicializando o servidor
    const server = (http.createServer(app)).listen((process.env.PORT || 3000), () => {
        const environment = process.env.NODE_ENV || 'develop';
        // Log da inicialização do servidor
        logger.info(`Executando "${name}@${version}" em http://localhost:${server.address().port} (${environment}) (pid:${process.pid})`);
        // Lista todas as APIs REST encontradas
        rest.forEach(route => logger.debug(`REST registrado....: ${route.uri} [${route.method}]`));
        if (graphql.length > 0) {
            // Lista todas as APIs GraphQL encontradas
            graphql.forEach(resolve => {
                //if (resolve)
                logger.debug(`GraphQL registrado.: ${resolve}`);
            });
            // Caso seja o ambiente de desenvolvimento, disponibilizar interface para teste do GraphQL
            if (environment !== 'production') {
                logger.debug(`GraphQL Playground disponivel em http://localhost:${server.address().port}/graphql (${environment})`);
            }
        }
        // Criando health-check
        const server_health = http.createServer(app_health).listen(((parseInt(process.env.PORT) + 1) || 3001), () => {
            logger.info({
                source: 'health-check',
                message: `Rota registrada: http://localhost:${server_health.address().port} (pid:${process.pid})`
            });
            require('./middleware/express-health-check')(app, app_health, server);
        });
    });
}).catch(error => {
    // Erro na inicialização dos middlewares
    logger.error(error.stack);
    process.exit(1);
});
