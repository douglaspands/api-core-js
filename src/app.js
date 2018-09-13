/**
 * @file Motor de APIs em Node.js com GraphQL e MongoDB.
 * @author @douglaspands
 * @since 2017-12-26
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
    // Incluindo middleware de conexão com o Elastic search
    const esClient = await require('./middleware/express-elastic-search')(app);
    // Incluindo middleware do Express
    require('./middleware/express-modules')(app);
    // Inicializando cache
    require('./middleware/express-redis')(app);
    // Inicializando banco de dados
    await require('./middleware/express-mongodb')(app);
    // Registrando APIs
    const routes = await require('./middleware/express-register-routes')(app);
    return routes;
})().then(({ rest, graphql }) => {
    // Inicializando o servidor
    const server = http.createServer(app).listen((process.env.PORT || 3000), () => {
        let environment = process.env.NODE_ENV || 'develop';
        // Log da inicialização do servidor
        logger.info(`Executando "${name}@${version}" em http://localhost:${server.address().port} (${environment}) (pid:${process.pid}) `);
        // Caso seja o ambiente de desenvolvimento, disponibilizar interface para teste do GraphQL
        if (environment !== 'production' && graphql.length > 0) {
            logger.debug(`GraphQL IDE disponivel em http://localhost:${server.address().port}/graphql`);
        }
        // Lista todas as APIs REST encontradas
        rest.forEach(route => logger.debug(`REST registrado....: ${route.uri} [${route.method}]`));
        // Lista todas as APIs GraphQL encontradas
        graphql.forEach(service => logger.debug(`GraphQL registrado.: ${service}`));
        // Criando health-check
        const server_health = http.createServer(app_health).listen(((parseInt(process.env.PORT) + 1) || 3001), () => {
            logger.log({
                level: 'info',
                source: 'health-check',
                message: `Rota registrada: http://localhost:${server_health.address().port} (pid:${process.pid})`
            });
            require('./middleware/express-health-check')(app, rest, graphql, server, app_health);
        });
    });
}).catch(error => {
    // Erro na inicialização dos middlewares
    logger.error(error.stack);
    process.exit(1);
});
