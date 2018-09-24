/**
 * @file Modulo de apoio a API.
 * @author @douglaspands
 * @since 2018-09-08
 * @version 2.2.20180921
 */
'use strict';
const path = require('path');
const utils = require('../utils');
const config = utils.getYaml('config.yaml');
const regexFolderLimit = new RegExp(config.folderLimit);

/**
 * Class de contexto da API
 * @class Context
 * @param {object} app servidor Express 
 * @param {string} modulePath Diretorio da API
 */
function Context(app, modulePath) {

    if (!(this instanceof Context)) {
        throw new Error('Class Context não foi instanciada!');
    }

    // Log
    const logger = app.get('logger');

    // Variaveis privadas
    const _app = app;
    const _modulePath = modulePath;

    // Variavel que será atribuida a cada chamada
    let caller = null;

    /**
     * Encapsulando em paradigmas funcionais
     */
    this.get = {
        self: {
            context: {
                module: (moduleName) => {
                    caller = getCaller();
                    return getModule(moduleName, this);
                }
            },
            module: (moduleName) => {
                caller = getCaller();
                return getModule(moduleName, null);
            }
        },
        server: (moduleName) => {
            caller = getCaller();
            return getServer(moduleName);
        },
        module: (moduleName) => {
            caller = getCaller();
            logger.debug({
                source: caller.name,
                message: `Foi solicitado o modulo "${moduleName}" do node_modules.`
            });
            return require(moduleName);
        }
    }

    /**
     * Modulo de log
     */
    this.logger = logger;

    /**
     * Utilitarios de apoio
     */
    this.utils = utils;

    /**
     * Obter variaveis do servidor
     * @param {string} name Nome da variavel do servidor
     * @return {any} Retornar o valor da variavel obtida.
     */
    function getServer(name) {
        logger.debug({
            source: caller.name,
            message: `Foi solicitado a variavel "${name}" do servidor.`
        });
        const _mod = _app.get(name);
        if (!_mod) {
            logger.error({
                source: caller.name,
                message: `Modulo "${name}" do servidor não foi encontrada!`
            });
        }
        return _mod;
    };

    /**
     * Obter modulos locais.
     * @param {string} name Nome do modulo
     * @param {object} self this.
     * @return {object} Conexão com o MongoDB
     */
    function getModule(name, self) {

        logger.debug({
            source: caller.name,
            message: `Foi solicitado o modulo "${name}".`
        });

        if (typeof name !== 'string') return null;

        const _name = name;
        const _self = (self) ? self : null;

        function getLocalModule(modulePath, name) {
            if (!regexFolderLimit.test(modulePath)) return null;
            try {
                return require(path.join(modulePath, name));
            } catch (error) {
                const newModulePath = path.join(modulePath, '..');
                return getLocalModule(newModulePath, name);
            }
        }

        let _mod = getLocalModule(caller.folder, _name);

        if (_mod) {
            if (_self && (typeof _mod === 'function')) {
                _mod = _mod(_self);
            }
        } else {
            logger.error({
                source: caller.name,
                message: `Modulo "${_name}" não foi encontrado!`
            });
        }

        return _mod;

    }

    /**
     * Obter o fonte chamador
     * @returns {string} fonte chamador
     */
    function getCaller() {
        let result = {};
        if (_modulePath) {
            result.file = _modulePath;
        } else {
            const callerfile = (utils.getStackList())[config.stack.fileOrder];
            result.file = callerfile;
        }
        result.folder = path.join(result.file, '..');
        result.name = (result.folder.split(/[\\\/]/g)).pop();
        return result;
    }

    Object.freeze(this);

}

module.exports = Context;
