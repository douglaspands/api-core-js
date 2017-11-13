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
    let onlyOnce = false;
    /**
     * Envia mensagem da api.
     * @param {number} status Status code da api.
     * @param {object} retorno Retorno da api.
     * @return {void}
     */
    function send(status, retorno = {}) {
        if (!onlyOnce) {
            if (arguments['0'].constructor.name === 'Response') {
                let ret = arguments['0'];
                res.status(ret.status).send(ret.body);
                if (log) log.push('response', ret);
            } else {
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
            onlyOnce = true;
        } else {
            if (log) log.push('response error', 'Só é possivel executar uma vez o modulo \'response\'!');
        }
    }
    /**
     * Envia arquivo html da api.
     * @param {number} status Status code da api.
     * @param {string} filePath Arquivo html que será retornado.
     * @return {void}
     */
    function sendFile(status, filePath) {
        if (!onlyOnce) {
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
            onlyOnce = true;
        } else {
            if (log) log.push('response error', 'Só é possivel executar uma vez o modulo \'response\'!');
        }
    }
    /**
     * Opção de incluir paramtros no header.
     * @param {object} header Objeto com parametros que serão incluidos no header.
     * @return {void}
     */
    function setHeader(header) {
        if (_.isPlainObject(header) && !_.isEmpty(header)) {
            res.set(header);
        }
    }
    /**
     * Verifica se o coando 'send' já foi executado.
     * @return {boolean} Retorna 'true' se já foi executado.
     */
    function verifySendExecute() {
        return onlyOnce;
    }
    /**
     * Retorna objeto de response nativo do express.js.
     * @return {object} Retorna objeto de response nativo do express.js
     */
    function express() {
        return res;
    }
    return {
        send,
        sendFile,
        setHeader,
        verifySendExecute,
        express
    };
}
module.exports = response;