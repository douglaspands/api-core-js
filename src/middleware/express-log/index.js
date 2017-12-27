/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-12-06
 */
'use strict';
const winston = require('winston');
const { createLogger } = winston;
const uuid = require('uuid/v1');

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {object} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = (app) => {

    // transports customizados
    const transports = require('./transports')(winston, app);

    const logger = createLogger({
        transports: [
            transports.customConsole(),
            transports.customFile()
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
        app.set('id', correlationId);

        res.setHeader('X-Correlation-Id', correlationId);

        // Capturando send 
        const end = res.end;
        res.end = (chunk, encoding, callback) => {

            res.end = end;
            res.end(chunk, encoding, callback);

            let dataLog = {
                'x-correlation-id': correlationId,
                method: req.method,
                url: req.originalUrl,
                request: {
                    headers: req.headers,
                    params: req.params,
                    query: req.query,
                    body: req.body
                },
                response: {
                    headers: res._headers,
                    body: (chunk) ? JSON.parse(chunk.toString()) : {}
                }
            }

            logger.log({
                level: 'info',
                source: 'express-log',
                request: dataLog
            });

            app.set('id', '');

        };

        next();
    }
    
    // Armazenando logger no servidor
    app.set('logger', logger)

    // Incluindo gerador de log pelo Express
    app.use(expressLogger);

    return logger;

}
