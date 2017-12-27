/**
 * @file Modulo de apoio para testes.
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const winston = require('winston');

function Context(pathApp) {

    const _pathApp = pathApp;
    const _moduleName = (path => {
        let div = '/';
        if (path.indexOf(div) < 0) div = '\\\\';
        let nome = path.split(div);
        return nome[nome.length - 1];
    })(_pathApp);
    const _db = undefined;
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

    /**
     * Função pra geração de mensagens de erro
     * @param {string} message mensagem de erro
     * @return {void} 
     */
    function logError(message) {
        message = (typeof message === 'string') ? message : 'N/A';
        _logger.log({
            level: 'error',
            source: _moduleName,
            message: message
        });
    }

    // Lista de mocks
    const listMocks = [];

    /**
     * Nome do modulo
     */
    this.moduleName = _moduleName;

    /**
     * Obter variaveis do servidor
     * @param {string} name Nome da variavel do servidor
     * @return {object} Retornar o valor da variavel obtida.
     */
    this.get = function (name) {

        logError(`Variavel ${name} não foi encontrado!`);
        return undefined;

    };

    /**
     * Modulo de log (winston)
     */
    this.logger = function (level, message) {

        const listLevels = {
            error: 0,
            warn: 1,
            info: 2,
            verbose: 3,
            debug: 4,
            silly: 5
        };
        const _level = (_.includes(Object.keys(listLevels), level)) ? level : 'silly';
        const _envLog = (_.includes(Object.keys(listLevels), process.env.LOG)) ? listLevels[process.env.LOG] : -1;

        if ((listLevels[_level] <= _envLog) || (process.env.NODE_ENV !== 'production')) {
            _logger.log({
                level: _level,
                source: _moduleName,
                message: (typeof message === 'string') ? message : 'N/A'
            });
        }

    };

    /**
     * Obter modulos locais.
     * @param {string} name Nome do modulo
     * @param {boolean} self "true" - Executa a primeira função passando o "this".
     * @return {object} Conexão com o MongoDB
     */
    this.getModule = (name, self) => {

        if (typeof name !== 'string') {
            return undefined;
        }

        const _self = (typeof self === 'boolean') ? self : false;
        const _name = name;

        // Verificando mocks
        let mock = _.find(listMocks, (o) => {
            return o.name === _name;
        });
        if (mock) return mock.mod;
        //--

        let _mod;
        try {
            _mod = require(path.join(_pathApp, _name));
            try {
                _mod = (_self && _mod && typeof _mod === 'function') ? _mod(this) : _mod;
            } catch (err1) {
                logError(err1);
            }
        } catch (err2) {
            try {
                _mod = require(path.join(_pathApp, '..', _name));
                try {
                    _mod = (_self && _mod && typeof _mod === 'function') ? _mod(this) : _mod;
                } catch (err3) {
                    logError(err3);
                }
            } catch (err4) {
                logError(`Modulo "${_name}" não foi encontrado!`);
            }
        }

        return _mod;

    }

    /**
     * Inclusão de modulos mockados
     * @param {string} name Nome do modulo
     * @param {function} mod Modulo que será executado
     */
    this.setMock = (name, mod) => {

        if (_.isString(name) && !_.isEmpty(name) && _.includes(['object', 'function'], typeof mod)) {
            listMocks.push({
                name: name,
                mod: mod
            })
            _logger.log({
                level: 'debug',
                source: _moduleName,
                message: `Foi incluido o mock do modulo "${name}" com sucesso!`
            });

        } else {

            _logger.log({
                level: 'debug',
                source: _moduleName,
                message: `Não foi possivel incluir o mock do modulo "${name}"!`
            });

        }

    }

}

module.exports = Context;

