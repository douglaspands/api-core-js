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
const app_health = require('express')();
// Armazenando diretorio do servidor e configurações
app.set('root', __dirname);
app.set('package', require('./package'));
// Configurando log
const logger = require('./middleware/express-log')(app);
// Executando modulos sincronamente
(async () => {
    // Incluindo middleware do Express
    require('./middleware/express-modules')(app);
    // Inicializando cache
    require('./middleware/express-cache')(app);
    // Inicializando banco de dados
    await require('./middleware/express-mongodb')(app);
    // Registrando APIs
    const routes = await require('./middleware/express-register-routes')(app);
    return routes;
})().then(({ rest, graphql }) => {
    // Inicializando o servidor
    const server = app.listen((process.env.PORT || 3000), () => {
        let environment = process.env.NODE_ENV || 'develop';
        // Log da inicialização do servidor
        logger.info(`Executando "${name}@${version}" em http://localhost:${server.address().port} (${environment})`);
        // Caso seja o ambiente de desenvolvimento, disponibilizar interface para teste do GraphQL
        if (environment !== 'production' && graphql.length > 0) {
            logger.info(`GraphQL IDE disponivel em http://localhost:${server.address().port}/graphql`);
        }
        // Lista todas as APIs REST encontradas
        rest.forEach(route => logger.info(`REST registrado....: ${route.uri} [${route.method}]`));
        // Lista todas as APIs GraphQL encontradas
        graphql.forEach(service => logger.info(`GraphQL registrado.: ${service}`));
        // Criando health-check
        const server_health = app_health.listen(((parseInt(process.env.PORT) + 1) || 3001), () => {
            logger.log({
                level: 'info',
                source: 'health-check',
                message: `Rota registrada: http://localhost:${server_health.address().port}`
            });
            require('./middleware/express-health-check')(app, rest, graphql, server, app_health);
        });
    });
}).catch(error => {
    logger.error(error.stack);
    encerramento(true);
});
/**
 * Foi recebido um Ctrl + C para encerramento da aplicação.
 */
process.on('SIGINT', () => encerramento());
/**
 * Função de encerramento do servidor.
 */
function encerramento(erroRecebido) {
    logger.info('SIGINT - Foi recebido sinal de encerramento do servidor.')
    let ocorreuErro = (erroRecebido === true)? true: false;
    (app.get('mongodb')).close(error => {
        if (error) {
            ocorreuErro = true;
            logger.error(`Erro ao encerrar a conexão com o MongoDB: ${error}`);
        } else {
            logger.info('Conexão com o MongoDB encerrado com sucesso!');
        }
    });
    app.close(error => {
        if (error) {
            ocorreuErro = true;
            logger.error(`Erro ao encerrar o servidor http (Express): ${error}`);
        } else {
            logger.info('Servidor http (Express) encerrado com sucesso');
        }
    });
    process.exit(ocorreuErro ? 1 : 0);
};
