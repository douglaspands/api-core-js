/**
 * @file Modulo de log utilizando o Winston.
 * @author @douglaspands
 * @since 2017-11-19
 */
'use strict';
const winston = require('winston');
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// Formatos e configurações da Log
const timestampFormat = 'YYYY-MM-DDTHH.mm.ss.SSS';
const fileName = {
    filename: path.join(__dirname, '..', 'logs', ('log_' + moment().format(timestampFormat) + '.log'))
};
const consoleLog = new winston.transports.Console({ level: 'error' });
const fileLog = new winston.transports.File(fileName);

// Configurações de Log
const logger = winston.createLogger({
    format: winston.format.prettyPrint(),
    transports: [
        consoleLog,
        fileLog
    ]
});

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
            order: _.size(registros) + 1,
            timestamp: moment().format(timestampFormat),
        };
        if (_.isString(code) && !_.isEmpty(code)) registro.code = code;
        switch (true) {
            case (_.isPlainObject(log)):
                registro = _.merge(registro, log);
                break;
            case (log.constructor.name === 'Response'):
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
            order: _.size(registros) + 1,
            timestamp: moment().format(timestampFormat),
            code: _.get(error, 'code', ''),
            message: _.get(error, 'message', ''),
            stack: _.get(error, 'stack', '')
        };
        registros.push(registro);
        logger.error(registros);
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
        logger.info(registros);
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