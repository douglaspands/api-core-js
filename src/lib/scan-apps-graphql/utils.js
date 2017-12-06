/**
 * @file Validar codigo do Schema
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict'
const _ = require('lodash');
const { buildSchema } = require('graphql');

/**
 * Modulo de validação de log
 * @param {object} logger Objeto logger do Winston
 * @return {object} exportando modulos. 
 */
module.exports = (logger) => {
    /**
     * Validar codigo fonte do graphql
     * @param {string} source 
     * @return {boolean} Retorna 'true' se o codigo for valido.
     */
    function graphqlSchemaIsValid(source) {
        try {
            buildSchema(source);
            return true;
        } catch (error) {
            if (logger) logger.error(`[buildSchema] ${error}`);
            return false;
        }
    }
    /**
     * Verifica se existem duplicidades nas funções.
     * @param {object} root Objeto root do GraphQL 
     * @param {object} resolvedFunction Funções da api
     * @return {boolean} Retorna 'true' se houver duplicidade. 
     */
    function duplicateFunctions(root, resolvedFunction) {
        const rfn = Object.keys(resolvedFunction);
        const r = Object.keys(root);
        let duplicate = false;
        rfn.forEach((fn) => {
            if (_.includes(r, fn)) {
                logger.error(`[duplicateFunctions] Função "${fn}" já existe no root do GraphQL`);
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
