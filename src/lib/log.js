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
function Log(){
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
            timestamp: moment().format('YYYY.MM.DD.HH:MM:Sss'),
        };
        switch (true) {
            case (_.isString(code) && !_.isEmpty(code)):
                registro.code = code;
            case (_.includes(['string', 'number'], typeof log)):
                registro.log = log;
                break;
            case (_.isPlainObject(log)):
                registro = _.merge(registro, log);
                break;
            case (_.isArray(log)):
                registro.log = log;
                break;
            default:
                break;
        }
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
     * Console da Log Completa.
     * @return {array} Retorna lista com todas as logs incluidas.
     */
    function console() {
        console.log('==========================')
        console.log(JSON.stringify(registros, null, 4));
        console.log('==========================');
    }
    return {
        push,
        getAll,
        console
    }
}
/**
 * Modulos exportados.
 */
module.exports = new Log();