/**
 * @file Modulo de apoio a API.
 * @author @douglaspands
 * @since 2018-09-08
 * @version 2.0.0
 */
'use strict';
const path = require('path');
const config = require('./config');
const regexFolderLimit = new RegExp(config.folderLimit);
const winston = require('winston');
let serverMock = [];
let moduleMock = [];

/**
 * Class de contexto da API
 * @class Context
 * @param {string} apiPath Diretorio da API
 * @param {object} app servidor Express 
 */
function Context(modulePath, app) {

    const _app = app;
    const _modulePath = path.join(modulePath, '..');
    const _moduleName = (_modulePath.split(/[\\\/]/g)).pop();
    const _logger = winston.createLogger({
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
    serverMock.push({ name: 'logger', behavior: _logger });

    /**
     * Obter variaveis do servidor
     * @param {string} name Nome da variavel do servidor
     * @return {any} Retornar o valor da variavel obtida.
     */
    function getServer(name) {
        _logger.debug({
            source: _moduleName,
            message: `Foi solicitado a variavel "${name}" do servidor.`
        });
        //-- mock
        let mock = serverMock.find(m => m.name === name);
        if (mock) return mock.behavior;
        //--
        let _mod = _app.get(name);
        if (!_mod) {
            _logger.error({
                source: _moduleName,
                message: `Modulo "${name}" do servidor não foi encontrada!`
            });
        }
        return _mod;
    };

    /**
     * Obter modulos locais.
     * @param {string} name Nome do modulo
     * @param {boolean} self "true" - Executa a primeira função passando o "this".
     * @return {object} Conexão com o MongoDB
     */
    function getModule(name, self) {

        _logger.debug({
            source: _moduleName,
            message: `Foi solicitado o modulo "${name}".`
        });

        if (typeof name !== 'string') return null;

        const _name = name;
        const _self = (typeof self === 'boolean') ? self : false;

        function getLocalModule(modulePath, name) {
            if (!regexFolderLimit.test(modulePath)) return null;
            try {
                return require(path.join(modulePath, name));
            } catch (error) {
                const newModulePath = path.join(modulePath, '..');
                return getLocalModule(newModulePath, name);
            }
        }

        //-- mock
        let mock = moduleMock.find(m => m.name === _name);
        if (mock) {
            if (_self && typeof mock.behavior === 'function') {
                return mock.behavior(this);
            } else {
                return mock.behavior;
            }
        }
        //--

        let _mod = getLocalModule(_modulePath, _name);

        if (_mod) {
            if (_self && typeof _mod === 'function') _mod = _mod(this);
        } else {
            _logger.error({
                source: _moduleName,
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
            serverMock.push({ name, behavior });
        }
    }

    /**
     * Inserir mock nos modulos
     * @param {string} name Nome do modulo
     * @param {any} behavior Comportamento
     */
    function setModuleMock(name, behavior) {
        if (typeof name === 'string' && name.length > 0) {
            serverMock.push({ name, behavior });
        }
    }

    /**
     * Encapsulando em paradigmas funcionais
     */
    this.get = {
        self: {
            context: {
                module: (moduleName) => {
                    return getModule(moduleName, true);
                }
            },
            module: (moduleName) => {
                return getModule(moduleName, false);
            }
        },
        server: (moduleName) => {
            return getServer(moduleName);
        },
        module: (moduleName) => {
            _logger.debug({
                source: _moduleName,
                message: `Foi solicitado o modulo "${moduleName}" do node_modules.`
            });
            return require(moduleName);
        }
    }

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

    if (this instanceof Context) {
        Object.freeze(this);
    }

}

module.exports = Context;
