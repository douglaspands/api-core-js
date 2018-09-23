/**
 * @file Modulo de apoio a API.
 * @author @douglaspands
 * @since 2018-09-08
 * @version 2.1.20180923
 */
'use strict';
const path = require('path');
const utils = require('../utils');
const config = utils.getYaml('config.yaml');
const regexFolderLimit = new RegExp(config.folderLimit);

const winston = require('winston');
let serverMock = {};
let moduleMock = {};

/**
 * Class de contexto da API
 * @class Context
 * @param {string} modulePath Diretorio da API
 */
function Context(modulePath) {

    if (!(this instanceof Context)) {
        throw new Error('Class Context não foi instanciada!');
    }

    // Log
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'silly',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.label({ label: 'server' }),
                    winston.format.timestamp(),
                    winston.format.printf(info => `[${info.level}] ${info.timestamp} ${(info.source || info.label)} - ${info.message}`)
                )
            })
        ]
    });
    serverMock['logger'] = logger;

    // Variaveis privadas
    const _app = {
        get: () => null
    };
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
     * Incluir os mocks de execução 
     */
    this.set = {
        mock: {
            module: (name, behavior) => {
                setModuleMock(name, behavior)
            },
            server: (name, behavior) => {
                setServerMock(name, behavior)
            }
        }
    }

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
        //-- mock
        let mock = serverMock[name];
        if (mock) return mock;
        //--
        let _mod = _app.get(name);
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
     * @param {object} self Recebe o this.
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
            } s
        }

        //-- mock
        let mock = moduleMock[_name];
        if (mock) {
            if (_self && typeof mock === 'function') {
                return mock(self);
            } else {
                return mock;
            }
        }
        //--

        let _mod = getLocalModule(_modulePath, _name);

        if (_mod) {
            if (_self && typeof _mod === 'function') {
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
     * Inserir mock nas variaveis do servidor
     * @param {string} name Nome da variavel
     * @param {any} behavior Comportamento
     */
    function setServerMock(name, behavior) {
        if (typeof name === 'string' && name.length > 0) {
            serverMock[name] = behavior;
        }
    }

    /**
     * Inserir mock nos modulos
     * @param {string} name Nome do modulo
     * @param {any} behavior Comportamento
     */
    function setModuleMock(name, behavior) {
        if (typeof name === 'string' && name.length > 0) {
            moduleMock[name] = behavior;
        }
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
