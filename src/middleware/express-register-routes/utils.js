/**
 * @file Validar codigo do Schema
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict'
const _ = require('lodash');
const { buildSchema } = require('graphql');
const config = require('./config');

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
            logger.log({
                level: 'warn',
                source: config.source,
                message: `buildSchema.: ${error}`
            });
            return false;
        }
    }
    /**
     * Verifica se existem duplicidades nas funções.
     * @param {object} root Objeto root do GraphQL 
     * @param {object} resolvedFunction Funções da api
     * @return {boolean} Retorna 'true' se houver duplicidade. 
     */
    const duplicateFunctions = (root, resolvedFunction) => {
        const rfn = Object.keys(resolvedFunction);
        const r = Object.keys(root);
        let duplicate = false;
        rfn.forEach((fn) => {
            if (_.includes(r, fn)) {
                logger.log({
                    level: 'warn',
                    source: config.source,
                    message: `Função "${fn}" já existe no root do GraphQL`
                });
                duplicate = true;
            }
        })
        return duplicate;
    }
    // Exportar funções
    return {
        graphqlSchemaIsValid,
        duplicateFunctions
    };
}

module.exports = utils;
