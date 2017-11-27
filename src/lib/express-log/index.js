/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {function} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (app) => {

    const _db = app.get('mongodb');

    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');

    let transports = [];

    if (_db) {
        require('winston-mongodb').MongoDB;
        transports.push(new winston.transports.MongoDB({
            db: _db
        }));
        transports.push(new winston.transports.Console({
            level: 'error',
            colorize: true
        }));
    } else {
        transports.push(new winston.transports.Console({
            colorize: true
        }));
    }

    // Criando modulo de log geral
    const logger = new (winston.Logger)({
        transports: transports
    });

    // Criando modulo de log para o express
    const expressLogger = expressWinston.logger({
        winstonInstance: logger
    });

    // Criando modulo de log de erro para o express
    const expressLoggerError = expressWinston.errorLogger({
        winstonInstance: logger
    });

    app.use(expressLogger);
    app.use(expressLoggerError);

    app.set('logger', logger);

    return logger;

}
