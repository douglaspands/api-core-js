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
 * @param {string} diretorio Diretorio da api
 * @return {object} Retorna objeto de funções.
 */
function Context(folder, log) {
    let indice = 0;
    let diretorio = '';
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
                    // mod = require(files[0].replace(/(.js|.json)/g, ''));
                    mod = require(files[0]);
                    logger(('require ' + tipo), files[0]);
                    break;
                case fs.existsSync(files[1]):
                    // mod = require(files[1].replace(/(.js|.json)/g, ''));
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
    function getMessages() {
        return require('./messages');
    }
    return {
        module: getLocalModule,
        processor: getProcessor,
        util: getUtil,
        model: getModel,
        domain: getDomain,
        require: getRequire,
        message: getMessages
    }
}
module.exports = Context;
