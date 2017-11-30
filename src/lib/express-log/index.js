/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const winston = require('winston');

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {function} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (app) => {

    const _db = app.get('mongodb');

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            })
        ]
    });

    app.set('logger', logger);

    return logger;

}
