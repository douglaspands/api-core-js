/**
 * @file Objeto de contexto das apis para apoio.
 * @author @douglaspands
 * @since 2017-11-06
 */
'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
/**
 * Construtor do Context.
 * @param {string} folder Diretorio da api.
 * @param {object} log Modulo de geração de logs (opcional).
 * @param {object} req Objeto de request do Express (opcional).
 * @return {object} Retorna objeto de funções.
 */
function Context(folder, log, req) {
    let indice = 0;
    let diretorio = '';
    let varServer = _.get(req, 'app', {});
    if (_.isString(folder) && fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        diretorio = folder;
    } else {
        throw Error('É necessario passar o nome da pasta da api no contructor do modulo \'Context\'.');
    }
    /**
     * Gerador de log
     * @param {string} code codigo da mensagem
     * @param {any} message mensagem que será gravado
     * @return {void}
     */
    function logger(code, message) {
        if (log) log.push(code, message);
    }
    /**
    * Require de modulos com geração de Log.
    * @param {string} modulo Modulo requisitado.
    * @return {object} Retorna modulo solicitado.
    */
    function getRequire(modulo) {
        try {
            var mod = require(modulo);
            logger('require', modulo);
        } catch (e) {
            logger('require error', e);
        }
        return mod;
    }
    /**
     * Obter modulos.
     * @param {string} modulo Nome do modulo.
     * @param {string} tipo Tipo do modulo.
     * @param {string} nivel Nivel do diretorio.
     * @return {object} Objeto requisitado pelo modulo.
     */
    function getModule(modulo, tipo, nivel = '', semNivel = false) {
        let mod = null;
        if ((semNivel && !nivel) || _.size(nivel) < 4) {
            let files = [
                path.join(diretorio, nivel, tipo, modulo + '.js'),
                path.join(diretorio, nivel, tipo, modulo + '.json'),
            ]
            switch (true) {
                case fs.existsSync(files[0]):
                    mod = require(files[0]);
                    logger(('require ' + tipo), files[0]);
                    break;
                case fs.existsSync(files[1]):
                    mod = require(files[1]);
                    logger(('require ' + tipo), files[1]);
                    break;
                default:
                    mod = getModule(modulo, tipo, (nivel + '..'));
                    break;
            }
        } else {
            logger(('require ' + tipo + ' error'), modulo);
        }
        return mod;
    }
    /**
     * Require de modulos com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getLocalModule(modulo) {
        let tipo = 'modules';
        return getModule(modulo, tipo);
    }
    /**
     * Require de model com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getModel(modulo) {
        let tipo = 'models';
        return getModule(modulo, tipo);
    }
    /**
     * Require de processor com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getProcessor(modulo) {
        let tipo = 'processors';
        return getModule(modulo, tipo, '', true);
    }
    /**
     * Require de service com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getService(modulo) {
        let tipo = 'services';
        return getModule(modulo, tipo);
    }
    /**
     * Require de util com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getUtil(modulo) {
        let tipo = 'utils';
        return getModule(modulo, tipo);
    }
    /**
     * Require de domain com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function getDomain(modulo) {
        let tipo = 'domains';
        return getModule(modulo, tipo);
    }
    /**
     * Obter tratamento de mensagens de erro.
     * @return {object} Modulo de montagem de mensagens.
     */
    function getMessages() {
        return require('./messages');
    }
    /**
     * Obter tratamento de mensagens de erro.
     * @return {object} Modulo de montagem de mensagens.
     */
    function getValidator() {
        return require('./validator')();
    }
    /**
     * Obter variaveis do servidor.
     * @param {string} key Nome da varivel que se quer obter;
     * @return {object} Retorna objeto ou variavel do servidor.
     */
    function getServer(key) {
        if (_.isString(key) && !_.isEmpty(key) && _.has(varServer, key)) {
            return varServer[key];
        } else {
            return varServer;
        }
    }
    return {
        module: getLocalModule,
        processor: getProcessor,
        util: getUtil,
        model: getModel,
        domain: getDomain,
        require: getRequire,
        message: getMessages,
        verify: getValidator,
        get: getServer
    }
}
module.exports = Context;
