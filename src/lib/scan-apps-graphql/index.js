/**
 * @file Modulo de pesquisa de GraphQL APIs.
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const fs = require('fs');
const path = require('path');
const Context = require('../context-app');

// Diretorio das APIs em GraphQL
const folderApp = 'apps';
const dirApps = path.join(__dirname, '../..', folderApp);

// Sufixo da pasta com o codigo fonte da API
const prefix = 'graphql';

/**
 * Mapear script GraphQL
 * @param {object} server Modulo do Express
 * @return {array} 
 */
module.exports = (server) => {

    const logger = server.get('logger');
    const { graphqlSchemaIsValid, duplicateFunctions } = require('./utils')(logger);

    const root = {};
    const schemas = [];

    (fs.readdirSync(dirApps)).forEach((pasta) => {

        const dirAPI = path.join(dirApps, pasta);
        const prefixRegex = new RegExp('^' + prefix + '(.+)$', 'g')

        if (prefixRegex.test(pasta) && fs.lstatSync(dirAPI).isDirectory()) {

            let findIndex = '', findGraphQL = '';

            (fs.readdirSync(dirAPI)).forEach((f) => {
                if ((/^(.+).gql$/g).test(f)) {
                    findGraphQL = path.join(dirAPI, f);
                }
                if ((/^index.js$/g).test(f)) {
                    findIndex = path.join(dirAPI, f);
                }
            });

            if (findIndex && findGraphQL) {
                const regex = new RegExp('(.+)(?=([/\\\\]' + folderApp + '))', 'g');
                try {
                    const resolverFunction = require(findIndex)(new Context(dirAPI, server));
                    const stringSchema = fs.readFileSync(findGraphQL, 'utf8');
                    if (graphqlSchemaIsValid(stringSchema) && !duplicateFunctions(root, resolverFunction)) {
                        Object.assign(root, resolverFunction);
                        schemas.push(stringSchema);
                    } else {
                        const errorFormat = {
                            functionResolved: findIndex.replace(regex, '.'),
                            graphqlSchema: findGraphQL.replace(regex, '.')
                        };
                        logger.error(`[graphql-api] function.: ${errorFormat.functionResolved}`);
                        logger.error(`[graphql-api] schema...: ${errorFormat.graphqlSchema}`);
                    }
                } catch (error) {
                    const errorFormat = {
                        functionResolved: findIndex.replace(regex, '.'),
                        graphqlSchema: findGraphQL.replace(regex, '.')
                    };
                    logger.error(`[graphql-error] ${error}`);
                    logger.error(`[graphql-error] function.: ${errorFormat.functionResolved}`);
                    logger.error(`[graphql-error] schema...: ${errorFormat.graphqlSchema}`);
                }
            }

        }

    });

    const data = {};
    data.root = root;

    try {

        data.schema = buildSchema(mergeTypes(schemas));
        server.use('/graphql', graphqlHTTP({
            schema: data.schema,
            rootValue: data.root,
            // pretty: true,
            graphiql: (process.env.NODE_ENV !== 'production')
        }));
        logger.info('GraphqlHTTP ativado com sucesso!');

    } catch (error) {

        logger.error(`[mergeSchemas] ${error}`);
        logger.error('GraphqlHTTP não pode ser ativo!');
        data.root = [];

    } finally {

        return Object.keys(data.root);

    }
}

