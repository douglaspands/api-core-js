/**
 * @file Validar codigo do Schema
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict'

const { buildSchema } = require('graphql');
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
        return false;
    }
}

module.exports = {
    graphqlSchemaIsValid
}