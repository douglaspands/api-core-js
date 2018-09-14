/**
 * @file Cadastrando rotas GraphQL no graphqlHTTP
 * @author @douglaspands
 * @since 2018-09-13
 * @version 1.0.0
 */
'use strict';
const _ = require('lodash');
const fs = require('fs');
const source = (__dirname).split('/').pop();
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const { mergeTypes } = require('merge-graphql-schemas');
// Objeto de contexto
const Context = require('../../middleware/express-context');

module.exports = app => {
    // Objeto de log
    const logger = app.get('logger');
    /**
     * Registra rotas rest no servidor app
     * @param {array<object>} graphqlList
     * - controller: tipo de api
     * - graphql: Arquivo graphql
     * - file: arquivo com os handlers (controller)
     * @returns {object} Retorna um objeto com as propriedades:
     * - graphqlHTTP: objeto graphqlHTTP() query e mutations cadastrados
     * - list: Lista com as rotas cadastradas. Cada objeto contem
     * +- uri: rota pra execução
     * +- method: metodo pra execução 
     */
    const register = graphqlList => {
        const { graphqlSchemaIsValid, duplicateFunctions } = require('./utils')(logger);
        let root = {};
        let schemas = [];
        let graphqlServer = null;
        // Pra cada api na lista, sera feito o registro dela
        graphqlList.forEach(route => {
            try {
                const resolverFunction = require(route.file).root(new Context(route.file, app));
                const stringSchema = fs.readFileSync(route.graphql, 'utf8');
                if (graphqlSchemaIsValid(stringSchema) && !duplicateFunctions(root, resolverFunction)) {
                    Object.assign(root, resolverFunction);
                    schemas.push(stringSchema);
                } else {
                    logger.error({
                        source: source,
                        message: `function.: ${route.file}`
                    });
                    logger.error({
                        source: source,
                        message: `schema...: ${route.graphql}`
                    });
                }
            } catch (error) {
                logger.error({
                    source: source,
                    message: error.stack
                });
            }
        });
        if (!_.isEmpty(root) && schemas.length > 0) {
            try {
                const schemaMerge = mergeTypes(schemas);
                const schemaBin = buildSchema(schemaMerge);
                graphqlServer = graphqlHTTP({
                    schema: schemaBin,
                    rootValue: root,
                    graphiql: (process.env.NODE_ENV !== 'production')
                });
            } catch (error) {
                logger.error({
                    source: source,
                    message: error.stack
                });
                root = {};
            }
        }
        return { graphqlHTTP: graphqlServer, list: Object.keys(root) };
    }
    return { register };
};
