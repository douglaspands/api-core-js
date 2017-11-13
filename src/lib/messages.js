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
    this.status = statusCode || 500;
    if (!body || !_.includes(['object', 'string'], typeof body) || _.isEmpty(body)) {
        this.body = '';
    } else if (_.get(body, 'data', null) || _.isString(body)) {
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
        data: undefined
    };
    if (_.isObject(body) && !_.isEmpty(body)) {
        retorno.data = body;
    }
    if (_.isObject(optional) && !_.isEmpty(optional)) {
        _.forEach(Object.keys(optional), (o) => {
            if (o !== 'data') {
                retorno[o] = optional[o];
            }
        })
    }
    return new Response(200, retorno);
}
/**
 * Prepara retorno do com status 201.
 * @param {object} body Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status201(body) {
    let retorno = {
        data: {}
    };
    if (_.isObject(body) && !_.isEmpty(body)) {
        retorno.data = body;
    }
    return new Response(201, retorno);
}
/**
 * Prepara retorno do com status 204.
 * @param {object} body Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status204() {
    return new Response(204);
}
/**
 * Prepara retorno do com status 400.
 * @param {array} body Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status400(body) {
    let retorno = {
        code: 'validation error',
        message: []
    };
    if (_.isArray(body) && !_.isEmpty(body)) {
        retorno.message = body;
    }
    return new Response(400, retorno);
}
/**
 * Prepara retorno do com status 404.
 * @param {string} message Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status404(message) {
    let retorno = 'Route not found!';
    if (_.isString(message) && !_.isEmpty(message)) {
        retorno = message;
    }
    return new Response(404, retorno);
}
/**
 * Prepara retorno do com status 422.
 * @param {string} message Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status422(message) {
    let retorno = {
        code: 'semantic error',
        message: ''
    };
    if (_.isString(message) && !_.isEmpty(message)) {
        retorno.message = message;
    }
    return new Response(422, retorno);
}
/**
 * Prepara retorno do com status 500.
 * @param {string} message Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status500(message) {
    let retorno = {
        code: 'internal server error',
        message: ''
    };
    if (_.isString(message) && !_.isEmpty(message)) {
        retorno.message = message;
    }
    return new Response(500, retorno);
}
/**
 * Prepara retorno do com status 501.
 * @param {string} message Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status501(message) {
    let retorno = {
        code: 'not implemented',
        message: ''
    };
    if (_.isString(message) && !_.isEmpty(message)) {
        retorno.message = body;
    }
    return new Response(501, retorno);
}
/**
 * Prepara retorno do com status 503.
 * @param {string} message Mensagem de retorno
 * @return {Response} Retorna resposta.  
 */
function status503(message) {
    let retorno = {
        code: 'service unavailable',
        message: ''
    };
    if (_.isString(message) && !_.isEmpty(message)) {
        retorno.message = body;
    }
    return new Response(503, retorno);
}
module.exports = {
    sucess: status200,
    created: status201,
    noContent: status204,
    badRequest: status400,
    notFound: status404,
    semanticError: status422,
    internalError: status500,
    notImplemented: status501,
    serviceUnavailable: status503
}