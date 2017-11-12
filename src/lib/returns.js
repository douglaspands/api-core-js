/**
 * @file Modulo de formatação de retornos positivos e negativos.
 * @author @douglaspands
 * @since 2017-11-11
 */
'use strict';
const _ = require('lodash');
/**
 * @typedef {object} MessageSucess
 * @property {object} data Envelope da mensagem de retorno com sucess.
 * 
 * @typedef {object} MessageError
 * @property {string} code Codigo com infomação do erro.
 * @property {string} message Mensagem de retorno.

 * @typedef {object} Response Objeto de resposta.
 * @property {number} statusCode Status que será retornado.
 * @property {string|MessageSucess|MessageError} body Mensagem que será retornado.
 */
/**
 * Classe de resposta.
 * @param {number} statusCode status http de retorno.
 * @param {string|Response} body Mensagem de resposta.
 * @return {Response} Retorna objeto de resposta.
 */
function Response(statusCode, body) {
    this.status = statusCode || null;
    if (!body || !_.includes(['object', 'string'], typeof body) || _.isEmpty(body)) {
        this.body = {};
    } else if (_.get(body, 'data', null)) {
        this.body = body;        
    } else {
        this.body = {
            code: _.isString(body) ? '' : _.get(body, 'code', ''),
            message: _.isString(body) ? body : _.get(body, 'message', '')
        };
    }    
}
/**
 * Prepara retorno do com status 200.
 * @param {object} body Mensagem de retorno
 * @param {object} optional Parametros adicionais.
 * @return {Response} Retorna resposta.  
 */
function status200(body, optional) {
    let retorno = {
        data = null
    };
    if (_.isPlainObject(body) && !_.isEmpty(body)) {
        retorno.data = body;
    }
    if (_.isPlainObject(optional) && !_.isEmpty(optional)) {
        _.forEach(Object.keys(optional), (o) => {
            if (o !== 'data') {
                retorno[o] = optional[o];
            }
        })
    }
    return new Response(200, retorno);
}
/**
 * Prepara retorno do com status 400.
 * @param {array} body Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status400(body) {
    let retorno = {
        code = 'validation error',
        message = []
    };
    if (_.isArray(body) && !_.isEmpty(body)) {
        retorno.message = body;
    }
    return new Response(400, retorno);
}