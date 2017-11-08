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
    function send(status, retorno) {
        let ret = {};
        if (_.isNumber(status) && _.gte(status, 200) && _.lt(status, 600) && _.isObject(retorno)) {
            ret.status = status;
            ret.body = retorno;
        } else {
            ret.status = 500;
            ret.body = {
                code: 'Send error',
                message: 'Erro no retorno da API'
            };
        }
        res.status(ret.status).send(ret.body);
        if (_.isObject(log) && _.isFunction(log.insert)) {
            log.insert('response', ret);
            // Geração de log no console.
            console.log('==========================')
            console.log(JSON.stringify(log.get(), null, 4));
            console.log('==========================');
        }
    }
    return {
        send
    }
}
module.exports = response;