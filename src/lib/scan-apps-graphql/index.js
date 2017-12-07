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

// Node do modulo
const nomeModulo = 'scan-apps-graphql';

// Diretorio das APIs em GraphQL
const folderApp = 'apps';
const dirApps = path.join(__dirname, '../..', folderApp);

// Sufixo da pasta com o codigo fonte da API
const prefix = 'graphql';

/**
 * Mapear script GraphQL
 * @param {object} app Modulo do Express
 * @return {array} 
 */
module.exports = (app) => {

    const logger = app.get('logger');

    /**
     * Função pra geração de mensagens de erro
     * @param {object} errorFormat mensagem de erro
     * @return {void} 
     */
    function logError(errorFormat) {
        logger.log({
            level: 'error',
            source: nomeModulo,
            message: `function.: ${errorFormat.functionResolved}`
        });
        logger.log({
            level: 'error',
            source: nomeModulo,
            message: `schema...: ${errorFormat.graphqlSchema}`
        });
    }

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
                        source: nomeModulo,
                        message: error
                    });
                    logError(errorFormat);
                }
            }

        }

    });

    const data = {
        root: root
    };

    return new Promise(resolve => {

        try {

            data.schema = buildSchema(mergeTypes(schemas));
            app.use('/graphql', graphqlHTTP({
                schema: data.schema,
                rootValue: data.root,
                // pretty: true,
                graphiql: (process.env.NODE_ENV !== 'production')
            }));
            logger.log({
                level: 'info',
                source: nomeModulo,
                message: 'GraphqlHTTP ativado com sucesso!'
            });
            resolve(Object.keys(data.root));

        } catch (error) {

            logger.log({
                level: 'error',
                source: nomeModulo,
                message: error
            });
            logger.log({
                level: 'error',
                source: nomeModulo,
                message: 'GraphqlHTTP não pode ser ativo!'
            });
            resolve([]);

        }

    });

}

