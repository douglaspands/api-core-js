/**
 * @file Registrando rotas no Express atraves de notações
 * @author @douglaspands
 * @since 2017-12-28
 * @version 2.1.0-20181127
 */
'use strict';
const path = require('path');
const utils = require('../utils');
const config = utils.getYaml('config.yaml');
const bodyParser = require('body-parser');
const searchFiles = require('../search-files');
const searchController = require('../search-controllers');

/**
 * Executa o scan das apis e registra
 * @param {object} app servidor express 
 * @returns {object} contem:
 * - graphql: lista de resolve do graphql
 * - rest: lista de api rest
 * +- method
 * +- uri
 */
const registerAPIs = app => {

    const files = searchFiles(path.join(app.get('root'), config.directory));
    const routes = searchController(files);

    const restList = routes.filter(route => route.type.toUpperCase() === config.constants.rest);
    const graphqlList = routes.filter(route => route.type.toUpperCase() === config.constants.graphql);

    const rest = require('../express-register-rest')(app).register(restList);
    const graphql = require('../express-register-graphql')(app).register(graphqlList);

    if (rest.list.length > 0) app.use(rest.router);
    if (graphql.list.length > 0) graphql.graphqlHTTP.applyMiddleware({ app });

    app.set('rest_list', rest.list);
    app.set('graphql_list', graphql.list);

    app.use('/', (req, res) => {
        const pack = app.get('package');
        res.status(200).send(`<h1>Servidor "${pack.name}@${pack.version}" no ar!</h1>`);
    });
    app.use((req, res) => {
        res.status(404).send('Rota não encontrada!');
    });

    return {
        graphql: graphql.list,
        rest: rest.list
    }

}

module.exports = registerAPIs;
