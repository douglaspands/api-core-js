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
 * @param {function} db Conexão do MongoDB.
 * @param {function} callback Função para passar o modulo de log.
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (db, callback) => {

    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');

    let transports = [];
    transports.push(new winston.transports.Console({
        json: true,
        colorize: true
    }));

    if (db) {
        require('winston-mongodb').MongoDB;
        transports.push(new winston.transports.MongoDB({
            db: db
        }));
    }

    const logger = expressWinston.logger({
        transports: transports
    });

    if (typeof callback === 'function') callback(logger);
    else return logger;

}
