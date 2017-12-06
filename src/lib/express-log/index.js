/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-12-06
 */
'use strict';
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, label, printf } = format;

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {function} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (app) => {

    const logger = createLogger({
        transports: [
            new transports.Console({
                format: combine(
                    colorize(),
                    label({ label: 'core-api-js' }),
                    timestamp(),
                    printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
                )
            })
        ]
    });

    return logger;

}
