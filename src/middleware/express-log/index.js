/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-12-06
 * @version 1.2.20180919
 */
'use strict';
const winston = require('winston');
const source = (__dirname).split('/').pop();
const { createLogger } = winston;
const uuid = require('uuid/v4');
const config = require('./config');

/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {object} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = app => {

    // transports customizados
    const transports = require('./transports')(app);

    const logger = createLogger({
        transports: [
            transports.customFile()
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(transports.customConsole());
    };

    /**
     * Função de geração de log no express.
     * @param {object} req Request (express) 
     * @param {object} res Response (express)
     * @param {function} next Next (express)
     */
    const expressLogger = (req, res, next) => {

        const correlationId = uuid();
        app.set('id', correlationId);

        res.setHeader('X-Correlation-Id', correlationId);

        // Capturando send 
        const oldWrite = res.write;
        const oldEnd = res.end;
        let chunks = [];

        res.write = function (chunk) {
            chunks.push(chunk);
            oldWrite.apply(res, arguments);
        };

        res.end = function (chunk) {
            
            if (chunk) chunks.push(chunk);

            let body = null; 
            try {
                body = Buffer.concat(chunks).toString('utf8');
                body = JSON.parse(body);
            } catch (e1) {
                try {
                    body = JSON.parse(chunks[0]);
                } catch (e2) {
                    body = {};
                }
            }

            const dataLog = {
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
                    statusCode: res.statusCode,
                    headers: res._headers,
                    body: body
                }
            };
    
            logger.info({
                source: config.request.name,
                request: dataLog
            });
            app.set('id', '');
    
            oldEnd.apply(res, arguments);
        };

        next();
    }

    /**
     * Inclui log no Elastic Search
     * @return {void}
     */
    const addLogElasticSeach = () => {
        const es = app.get('es');
        if (es) {
            logger.add(transports.customElasticSearch());
        } else {
            logger.warn({
                source: source,
                message: 'Não será possivel incluir log no Elastic Search'
            });
        }
    }

    // Armazenando logger no servidor
    app.set('logger', logger)

    // Incluindo gerador de log pelo Express
    app.use(expressLogger);

    return {
        logger,
        addLogElasticSeach
    }
}