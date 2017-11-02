/**
 * @file Class de erro da API.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
/**
 * Class de erro.
 * @param {number} statusCode statusCode http para o erro. 
 * @param {string} message Mensagem de erro
 * @return {Erro} Class de erro. 
 */
function Erro(statusCode, message) {
    this.code = _.isNumber(statusCode)
        ? statusCode
        : 500;
    this.message = message;
}

module.exports = Erro;