/**
 * @file Registrando rotas no Express atraves de notações
 * @author @douglaspands
 * @since 2017-12-28
 */
'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const config = require('./config');
const searchFiles = require('../search-files');
const searchController = require('../search-controllers');

const router = require('express').Router();
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const { mergeTypes } = require('merge-graphql-schemas');

const Context = require('../../lib/context-api');

const registerRoutes = async app => {

    const logger = app.get('logger');
    const files = searchFiles(path.join(app.get('root'), config.directory));
    const routes = searchController(files);

    const registerRoutesRest = restList => {
        restList.forEach(route => {
            const api = require(route.file);
            const context = new Context(route.file, app);
            let functionsList = [];
            if (typeof api === 'function') functionsList = [api];
            else if (typeof api === 'object') functionsList = (_.pull(Object.keys(api), 'route')).map(fn => api[fn]);
            const handlersList = functionsList.reduce((handlers, fn) => {
                function createHandler(fn) {
                    function handler() {
                        let args = Array.prototype.slice.call(arguments);
                        args.push(context);
                        fn.apply(this, args);
                    }
                    return handler;
                }
                if (typeof fn === 'function') handlers.push(new createHandler(fn));
                return handlers;
            }, []);
            try {
                router[route.method](route.uri, handlersList);
            } catch (error) {
                logger.error({
                    source: config.source,
                    message: error.stack
                });
            }
        });
        if (restList.length > 0) app.use('/', router);
        return restList;
    }

    const registerRoutesGraphql = graphqlList => {
        const { graphqlSchemaIsValid, duplicateFunctions } = require('./utils')(logger);
        let root = {};
        let schemas = [];
        graphqlList.forEach(route => {
            try {
                const resolverFunction = require(route.file).root(new Context(route.file, app));
                const stringSchema = fs.readFileSync(route.graphql, 'utf8');
                if (graphqlSchemaIsValid(stringSchema) && !duplicateFunctions(root, resolverFunction)) {
                    Object.assign(root, resolverFunction);
                    schemas.push(stringSchema);
                } else {
                    logger.error({
                        source: config.source,
                        message: `function.: ${route.file}`
                    });
                    logger.error({
                        source: config.source,
                        message: `schema...: ${route.graphql}`
                    });
                }
            } catch (error) {
                logger.error({
                    source: config.source,
                    message: error.stack
                });
            }
        });
        if (!_.isEmpty(root) && schemas.length > 0) {
            let graphqlServer = null;
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
                    source: config.source,
                    message: error.stack
                });
                root = {};
            }
            if (graphqlServer) app.use('/graphql', graphqlServer);
        }
        return Object.keys(root);
    };

    const restList = routes.filter(route => route.controller === 'rest');
    const graphqlList = routes.filter(route => route.controller === 'graphql');

    return {
        rest: registerRoutesRest(restList),
        graphql: registerRoutesGraphql(graphqlList)
    };

}

module.exports = registerRoutes;
