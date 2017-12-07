/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-12-06
 */
'use strict';
const winston = require('winston');
const { createLogger } = winston;
const uuid = require('uuid/v1');

// transports customizados
const transports = require('./transports')(winston);

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {object} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (app) => {

    const logger = createLogger({
        transports: [
            transports.customConsole()
        ]
    });

    /**
     * Função de geração de log no express.
     * @param {object} req Request (express) 
     * @param {object} res Response (express)
     * @param {function} next Next (express)
     */
    function expressLogger(req, res, next) {
        const correlationId = uuid();
        res.setHeader('X-Correlation-Id', correlationId);
        
        // Capturando send 
        const end = res.end;
        res.end = (chunk, encoding, callback) => {

            res.end = end;
            res.end(chunk, encoding, callback);

            //
            const responseBody = chunk.toString();
            console.log('===================');
            console.log(req.params);
            console.log(req.query);
            console.log(req.body);
            console.log('===================');

            let dataLog = {
                //request: req,
                response: {
                    header: res._headers,
                    body: JSON.parse(responseBody)
                }
            }

            console.log(JSON.stringify(dataLog, null, 4));


        };

        next();
    }

    // Incluindo gerador de log pelo Express
    app.use(expressLogger);

    return logger;

}
