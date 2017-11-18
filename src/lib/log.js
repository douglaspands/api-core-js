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
const pkg = require('../package');

// Formatos e configurações da Log
const formatTimestamp = require('../config/formats').TIMESTAMP;
const nameFile = (pkg.name + '_v' + pkg.version + '_' + moment().format(formatTimestamp) + '.log');
const fileName = {
    filename: path.join(__dirname, '..', 'logs', nameFile)
};

// Configurações de Log
const logger = winston.createLogger({
    format: winston.format.prettyPrint(),
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File(fileName)
    ]
});

/**
 * Função de geração de Log.
 * @return {object} Retorna objeto com funções.
 */
function Log() {
    let registros = [];
    let ocorreuErro = false;
    /**
     * Inclui Log.
     * @param {string} code Codigo da log. 
     * @param {any} log Log.
     * @return {void} 
     */
    function push(code, log) {
        let registro = {
            order: _.size(registros) + 1,
            timestamp: moment().format(formatTimestamp),
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
            timestamp: moment().format(formatTimestamp),
            code: _.get(error, 'code', ''),
            message: _.get(error, 'message', ''),
            stack: _.get(error, 'stack', '')
        };
        registros.push(registro);
        ocorreuErro = true;
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
        if (ocorreuErro) {
            let req = registros[0];
            if (req.code === 'request') {
                let message = {
                    method: req.method,
                    path: req.path,
                    uri: req.uri,
                    timestamp: req.timestamp
                };
                logger.error(message, registros);
            } else {
                logger.error(registros);
            }
        } else {
            let req = registros[0];
            let message = {
                method: req.method,
                path: req.path,
                uri: req.uri,
                timestamp: req.timestamp
            };
            logger.info(message, registros);
        }
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
module.exports = {
    Log,
    logger
};