/**
 * @file Modulo de configurações de Log no Express
 * @author douglaspands
 * @since 2017-12-06
 * @version 1.2.20180921
 */
'use strict';
const winston = require('winston');
const zlib = require('zlib');
const { createLogger } = winston;
const uuid = require('uuid/v4');
const utils = require('../utils');
const config = utils.getYaml('config.yaml');
/**
 * Função que disponibiliza o modulo de log pra cadastro no express.js
 * @param {object} app express().
 * @return {function} Retorna o modulo "logger" do winston.
 */
module.exports = app => {

    // transports customizados
    const transports = require('./transports')(app, config);

    const logger = createLogger({
        transports: [
            transports.customFile()
        ]
    });

    logger.add(transports.customConsole());

    // Gera log da request da execução
    app.use((req, res, next) => {

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
                const _compact = Buffer.concat(chunks);
                const _buffer = zlib.gunzipSync(_compact);
                const _text = _buffer.toString('utf8');
                body = JSON.parse(_text);
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
    });

    // Armazenando logger no servidor
    app.set('logger', logger);

    // Armazenamento no container
    setClient('logger', logger, app, 'client');
    
    return {
        logger
    }
}
/**
 * Incluir no client 
 * @param {string} name nome do client
 * @param {any} data dados para armazenar
 * @param {object} app express.js
 * @param {string} containerName nome do container
 * @returns {void}
 */
function setClient(name, data, app, containerName) {
    let container = app.get(containerName);
    if (!container) container = utils.container();
    app.set(containerName, container.set(name, data));
}
