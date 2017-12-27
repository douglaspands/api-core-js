/**
 * @file Modulo de pesquisa de GraphQL APIs.
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
const fs = require('fs');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { prefix, nome_modulo, folder_app } = require('config');
const dirApps = path.join(__dirname, '../..', folder_app);

const Context = require('../context-app');

/**
 * Mapear script GraphQL
 * @param {object} app Modulo do Express
 * @return {array} 
 */
module.exports = async (app) => {

    const regex = new RegExp('(.+)(?=([/\\\\]' + folder_app + '))', 'g');
    const logger = app.get('logger');
    const { graphqlSchemaIsValid, duplicateFunctions } = require('./utils')(logger);

    /**
     * Função pra geração de mensagens de erro
     * @param {object} errorFormat mensagem de erro
     * @return {void} 
     */
    function logError(errorFormat) {
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: `function.: ${errorFormat.functionResolved}`
        });
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: `schema...: ${errorFormat.graphqlSchema}`
        });
    }

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

                try {
                    const resolverFunction = require(findIndex)(new Context(dirAPI, app));
                    const stringSchema = fs.readFileSync(findGraphQL, 'utf8');
                    if (graphqlSchemaIsValid(stringSchema) && !duplicateFunctions(root, resolverFunction)) {
                        Object.assign(root, resolverFunction);
                        schemas.push(stringSchema);
                    } else {
                        const errorFormat = {
                            functionResolved: findIndex.replace(regex, '.'),
                            graphqlSchema: findGraphQL.replace(regex, '.')
                        };
                        logError(errorFormat);
                    }
                } catch (error) {
                    const errorFormat = {
                        functionResolved: findIndex.replace(regex, '.'),
                        graphqlSchema: findGraphQL.replace(regex, '.')
                    };
                    logger.log({
                        level: 'error',
                        source: nome_modulo,
                        message: error
                    });
                    logError(errorFormat);
                }
            }

        }

    });

    try {

        const data = {
            root: root,
            schema: buildSchema(mergeTypes(schemas))
        };

        app.use('/graphql', graphqlHTTP({
            schema: data.schema,
            rootValue: data.root,
            // pretty: true,
            graphiql: (process.env.NODE_ENV !== 'production')
        }));
        logger.log({
            level: 'info',
            source: nome_modulo,
            message: 'GraphqlHTTP ativado com sucesso!'
        });
        return Object.keys(data.root);

    } catch (error) {

        logger.log({
            level: 'error',
            source: nome_modulo,
            message: error
        });
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: 'GraphqlHTTP não pode ser ativo!'
        });
        return [];

    }

}

