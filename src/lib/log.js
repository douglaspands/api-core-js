/**
 * @file Modulo de log.
 * @author @douglaspands
 * @since 2017-11-08
 */
'use strict';
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
/**
 * Função de geração de Log.
 * @return {object} Retorna objeto com funções.
 */
function Log() {
    let registros = [];
    let firstLog, folderRoute;
    let folderLog = '';
    /**
     * Inclui Log.
     * @param {string} code Codigo da log. 
     * @param {any} log Log.
     * @return {void} 
     */
    function push(code, log) {
        let timestamp = moment().format('YYYY.MM.DD_HH:MM:Sss');
        if (_.isEmpty(registros)) {
            firstLog = timestamp.replace(/[.:]/g, '');
            let div = (log.routeDirectory.indexOf('/') >= 0) ? '/' : '\\';
            folderRoute = (log.routeDirectory.split(div)).pop();
        }
        let registro = {
            index: _.size(registros) + 1,
            timestamp: timestamp,
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
        if (!folderLog) {
            folderLog = path.join(__dirname, '..', 'logs');
            if (!fs.existsSync(folderLog)) {
                fs.mkdirSync(folderLog);
            }
        }
        let fileWrite = path.join(folderLog, (firstLog + '-' + folderRoute + '.log'));
        fs.writeFile(fileWrite, JSON.stringify(registros, null, 4), 'utf8', (err) => {
            if (err) console.log('ERROR: Erro na gravação do arquivo de log!\n', err);
        });
        // 
        console.log('============================================================================');
        console.log(JSON.stringify(registros, null, 4));
        //
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