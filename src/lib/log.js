/**
 * @file Modulo de log.
 * @author @douglaspands
 * @since 2017-11-08
 */
'use strict';
const moment = require('moment');
const _ = require('lodash');
/**
 * Função de geração de Log.
 * @return {object} Retorna objeto com funções.
 */
function Log() {
    let registros = [];
    /**
     * Inclui Log.
     * @param {string} code Codigo da log. 
     * @param {any} log Log.
     * @return {void} 
     */
    function push(code, log) {
        let registro = {
            index: _.size(registros) + 1,
            timestamp: moment().format('YYYY.MM.DD_HH:MM:Sss'),
        };
        if (_.isString(code) && !_.isEmpty(code)) registro.code = code;
        switch (true) {
            case (_.isPlainObject(log)):
                registro = _.merge(registro, log);
                break;
            default:
                registro.log = log;
                break;
        }
        registros.push(registro);
    }
    /**
     * Inclui log de erro.
     * @param {object} error. 
     * @return {void} 
     */
    function pushError(error) {
        let registro = {
            index: _.size(registros) + 1,
            timestamp: moment().format('YYYY.MM.DD_HH:MM:Sss'),
            code: _.get(error, 'code', ''),
            message: _.get(error, 'message', ''),
            stack: _.get(error, 'stack', '')
        };
        registros.push(registro);
    }
    /**
     * Obter a Log Completa.
     * @return {array} Retorna lista com todas as logs incluidas.
     */
    function getAll() {
        return registros;
    }
    /**
     * Envia a log para o servidor dedicado.
     * @return {void}
     */
    function sendLog() {
        /**
         * Função de envio não implementada.
         * Será mostrado apenas no console inicialmente.
         */
        console.log('==========================');
        console.log(JSON.stringify(registros, null, 4));
        console.log('==========================');
    }
    return {
        push,
        pushError,
        getAll,
        sendLog
    }
}
/**
 * Modulos exportados.
 */
module.exports = Log;