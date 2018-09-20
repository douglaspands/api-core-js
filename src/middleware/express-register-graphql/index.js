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
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
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
        const { graphqlSchemaIsValid } = require('./utils')(logger);
        let resolvers = {};
        let schemas = [];
        let graphqlServer = null;
        let graphiqlServer = null;
        // Pra cada api na lista, sera feito o registro dela
        graphqlList.forEach(route => {
            try {
                const resolverFunction = require(route.file).root(new Context(route.file, app));
                const stringSchema = fs.readFileSync(route.graphql, 'utf8');
                if (graphqlSchemaIsValid(stringSchema)) {
                    Object.assign(resolvers, resolverFunction);
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
        if (!_.isEmpty(resolvers) && schemas.length > 0) {
            try {
                const typeDefs = mergeTypes(schemas);
                const schema = makeExecutableSchema({ typeDefs, resolvers });
                graphqlServer = graphqlExpress({ schema });
                if (process.env.NODE_ENV !== 'production') {
                    graphiqlServer = graphiqlExpress({ endpointURL: '/graphql', });
                }
            } catch (error) {
                logger.error({
                    source: source,
                    message: error.stack
                });
                resolvers = {};
            }
        } 
        const listResolvers = (Object.keys(resolvers)).reduce((list, fn) => {
            if (fn === 'Query' || fn === 'Mutation') {
                Object.keys(resolvers[fn]).forEach(i => list.push(i));
            } else {
                list.push(fn);
            }
            return list;
        }, []);
        return { graphqlHTTP: graphqlServer, list: listResolvers, graphiqlHTTP: graphiqlServer };
    }
    return { register };
};
