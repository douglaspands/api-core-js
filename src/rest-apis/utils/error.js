/**
 * @file Modulo com tratamentos de erro da API.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
/**
 * Modulo de criação de erro para envio.
 * @param {number} statusCode statusCode http para o erro. 
 * @param {any} message Mensagem de erro
 * @return {object} Class de erro. 
 */
function errorSend(statusCode, message) {
    let retorno = {};
    retorno.status = _.isNumber(statusCode)
        ? statusCode
        : 500;
    retorno.message = message;
    return retorno;
}
/**
 * Modulo de criação de erro generico.
 * @param {straing|number} code Codigo de erro. 
 * @param {string} message Mensagem de erro.
 * @return {object} Objeto de retorno. 
 */
function errorCreate(code, message) {
    let retorno = {};
    retorno.status = (_.includes(['string', 'number'], typeof code)) ? code : '';
    retorno.message = message;
    return retorno;
}
/**
 * Mensagem de erro de campo na validação.
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
 * Mensagem de erro de campo na validação.
 * @param {array} listaErros 
 * @return {object} Mensagem de erro. 
 */
function errorValidator(listaErros = []) {
    let message = {};
    if (_.isArray(listaErros) && !_.isEmpty(listaErros)) {
        message.code = 'validation error';
        message.message = listaErros;
    }
    return message;
}
/**
 * Modulos de exportação.
 */
module.exports = {
    create: errorCreate,
    send: errorSend,
    form: errorForm,
    validator: errorValidator
};