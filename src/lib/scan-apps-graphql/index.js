/**
 * @file Modulo de pesquisa de GraphQL APIs.
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';

const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const fs = require('fs');
const path = require('path');
const { graphqlSchemaIsValid } = require('./utils');
const Context = require('../context-app');


// Diretorio das APIs em GraphQL
const folderApp = 'apps';
const dirApps = path.join(__dirname, '../..', folderApp);

// Sufixo da pasta com o codigo fonte da API
const prefix = 'graphql';

/**
 * Mapear script GraphQL
 * @param {object} server Modulo do Express
 * @return {object} Retorna funções root e os graphql schemas unificados 
 */
module.exports = server => {

    const root = {};
    const schemas = [];
    const errors = [];

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
                    const resolverFunction = require(findIndex)(new Context(dirAPI, server));
                    const stringSchema = fs.readFileSync(findGraphQL, 'utf8');
                    if (graphqlSchemaIsValid(stringSchema)) {
                        schemas.push(stringSchema);
                        Object.assign(root, resolverFunction);
                    }
                } catch (error) {
                    const regex = new RegExp('(.+)(?=([/\\\\]' + folderApp + '))', 'g');
                    errors.push({
                        functionResolved: findIndex.replace(regex, '.'),
                        graphqlSchema: findGraphQL.replace(regex, '.')
                    });
                }
            }

        }

    });

    if (errors.length > 0) {
        console.log('Erro no registro da API GraphQL:');
        errors.forEach(error => {
            console.log(`-> Function Resolved.: ${error.functionResolved}`);
            console.log(`-> GraphQL Schema....: ${error.graphqlSchema}`);
        })
    }

    return {
        root: root,
        schema: buildSchema(mergeTypes(schemas))
    };

}

