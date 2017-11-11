/**
 * @file Modulo de response das APIS
 * @author @douglaspands
 * @since 2017-11-07
 */
'use strict';
// Modulo Lodash
const _ = require('lodash');
/**
 * Response da api.
 * @param {object} res Modulo de envio de mensagem do Express.
 * @param {object} log Modulo de geração de log.
 * @return {object} Retorna função 'send' de responder api.
 */
function response(res, log) {
    /**
     * Envia mensagem da api.
     * @param {number} status Status code da api.
     * @param {object} retorno Retorno da api.
     * @return {void}
     */
    function send(status, retorno = {}) {
        let ret = {};
        if (_.isNumber(status) && _.gte(status, 200) && _.lt(status, 600) && _.isObjectLike(retorno)) {
            ret.status = status;
            ret.body = retorno;
            res.status(ret.status).send(ret.body);
            if (log) log.push('response', ret);
        } else {
            ret.status = 500;
            ret.body = { code: 'send error', message: 'Parametros passado para envio da mensagem invalido!' };
            if (log) log.push('response error', ret);
        }
    }
    /**
     * Envia arquivo html da api.
     * @param {number} status Status code da api.
     * @param {string} filePath Arquivo html que será retornado.
     * @return {void}
     */
    function sendFile(status, filePath) {
        let ret = {};
        if (_.isNumber(status) && _.gte(status, 200) && _.lt(status, 600) && _.isString(filePath) && !_.isEmpty(filePath)) {
            ret.status = status;
            ret.filePath = filePath;
            try {
                res.status(ret.status).sendFile(ret.filePath);
                if (log) log.push('response', ret);
            } catch (error) {
                if (log) log.push('response error', error);
            }
        } else {
            ret.status = 500;
            ret.body = { code: 'send error', message: 'Parametros passado para envio da mensagem invalido!' };
            res.status(ret.status).send(ret.body);
            if (log) log.push('response error', ret);
        }
    }
    return {
        send,
        sendFile,
        express: res
    }
}
module.exports = response;