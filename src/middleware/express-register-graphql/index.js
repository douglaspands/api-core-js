/**
 * @file Cadastrando rotas GraphQL no graphqlHTTP
 * @author @douglaspands
 * @since 2018-09-13
 * @version 1.1.0-20181127
 */
'use strict';
const _ = require('lodash');
const fs = require('fs');
const source = (__dirname).split('/').pop();
const { ApolloServer } = require('apollo-server-express');
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
        // Pra cada api na lista, sera feito o registro dela
        graphqlList.forEach(route => {
            try {
                const resolverFunction = require(route.file)(new Context(app, route.file));
                const stringSchema = fs.readFileSync(route.schema, 'utf8');
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
                        message: `schema...: ${route.schema}`
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
                graphqlServer = new ApolloServer({ typeDefs, resolvers, context: new Context(app) });
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
            }
            return list;
        }, []);
        return { graphqlHTTP: graphqlServer, list: listResolvers };
    }
    return { register };
};
