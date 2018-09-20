/**
 * @file Validar codigo do Schema
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict'
const _ = require('lodash');
const source = (__dirname).split('/').pop();
const { buildSchema } = require('graphql');

/**
 * Modulo de validação de log
 * @param {object} logger Objeto logger do Winston
 * @return {object} exportando modulos. 
 */
const utils = logger => {
    /**
     * Validar codigo fonte do graphql
     * @param {string} source 
     * @return {boolean} Retorna 'true' se o codigo for valido.
     */
    const graphqlSchemaIsValid = source => {
        try {
            buildSchema(source);
            return true;
        } catch (error) {
            logger.warn({
                source: source,
                message: `buildSchema.: ${error}`
            });
            return false;
        }
    }
    // Exportar funções
    return {
        graphqlSchemaIsValid
    };
}

module.exports = utils;
