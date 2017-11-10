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
function errorSend(statusCode, message) {
    let retorno = {};
    retorno.code = _.isNumber(statusCode)
        ? statusCode
        : 500;
    retorno.message = message;
    return retorno;
}
/**
 * Classe de erro.
 * @param {string} nomeCampo 
 * @param {string} valor 
 * @param {string} mensagem
 * @return {Erro} Class de erro. 
 */
function errorForm(nomeCampo, valor, mensagem) {
    let retorno = {};
    retorno.field = _.isString(nomeCampo)
        ? nomeCampo
        : '';
    retorno.value = _.isString(valor)
        ? valor
        : '';
    retorno.message = _.isString(mensagem)
        ? mensagem
        : '';
    return retorno;
}
/**
 * Modulos de exportação.
 */
module.exports = {
    send: errorSend,
    form: errorForm
};