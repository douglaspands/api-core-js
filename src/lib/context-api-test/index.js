/**
 * @file Modulo de apoio a API para testes.
 * @author @douglaspands
 * @since 2017-12-29
 * @version 1.2.0
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
    this.getServer = name => {

        _logger.debug({
            source: _moduleName,
            message: `Foi solicitado a variavel "${name}" do servidor.`
        });

        let _mod = null;

        //-- mock
        let mock = serverMock.find(m => m.name === name);
        if (mock) return mock.behavior;
        //--

        try {
            _mod = _app.get(name);
        } catch (error) {
            _logger.error({
                source: _moduleName,
                message: error.stack
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
    this.getModule = (name, self) => {

        _logger.debug({
            source: _moduleName,
            message: `Foi solicitado o modulo "${name}".`
        });

        if (typeof name !== 'string') return null;

        const _name = name;
        const _self = (typeof self === 'boolean') ? self : false;

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

        function getLocalModule(modulePath, name) {
            if (!regexFolderLimit.test(modulePath)) return null;
            try {
                return require(path.join(modulePath, name));
            } catch (error) {
                const newModulePath = path.join(modulePath, '..');
                return getLocalModule(newModulePath, name);
            }
        }

        const _mod = getLocalModule(_modulePath, _name);

        if (!_mod) {
            _logger.error({
                source: _moduleName,
                message: `Modulo "${_name}" não foi encontrado!`
            })
            return null;
        } else if (_self && typeof _mod === 'function') {
            return _mod(this);
        } else {
            return _mod;
        }

    }

    /**
     * Encapsulando em paradigmas funcionais
     */
    this.get = {
        self: {
            context: {
                module: (moduleName) => {
                    return this.getModule(moduleName, true);
                },
                server: (moduleName) => {
                    return this.getServer(moduleName, true);
                }
            }
        },
        module: (moduleName) => {
            return this.getModule(moduleName, false);
        },
        server: (moduleName) => {
            return this.getServer(moduleName, false);
        }
    }

    /**
     * Inserir mock nas variaveis do servidor
     * @param {string} name Nome da variavel
     * @param {any} behavior Comportamento
     */
    this.setServerMock = (name, behavior) => {
        if (typeof name === 'string' && name.length > 0) {
            serverMock.push({ name, behavior });
        }
    }

    /**
     * Inserir mock nos modulos
     * @param {string} name Nome do modulo
     * @param {any} behavior Comportamento
     */
    this.setModuleMock = (name, behavior) => {
        if (typeof name === 'string' && name.length > 0) {
            serverMock.push({ name, behavior });
        }
    }

    if (this instanceof Context) {
        Object.freeze(this);
    }

}

module.exports = Context;
