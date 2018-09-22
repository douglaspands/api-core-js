/**
 * @file Conexão com o Redis
 * @author douglaspands
 * @since 2018-09-03
 * @version 1.1.20180917
 */
'use strict';
const redis = require('redis');
const Cache = require('./Cache');
const source = (__dirname).split('/').pop();
const utils = require('../utils');
const config = utils.getYaml('config.yaml');
const [REDIS_HOST, REDIS_PORT] = (process.env.REDIS_URL || config.uri).split(':');
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

/**
 * Obter conexão com o Redis
 * @param {object} app Servidor Express.
 */
module.exports = app => {

    const logger = app.get('logger');

    /**
     * Criando conexão.
     */
    const redisConfig = {
        host: REDIS_HOST,
        port: REDIS_PORT,
        detect_buffers: true
    };
    const client = redis.createClient(redisConfig);
    app.set('redis-config', redisConfig);
    app.set('cache', new Cache(client, config, logger));
    /**
     * Em caso de erro no acesso ao Redis.
     */
    client.on("error", error => {
        logger.warn({
            source: source,
            message: error
        });
    });

    /**
     * Em caso de conexão com sucesso.
     */
    client.on("connect", () => {
        logger.info({
            source: source,
            message: `Redis ativado com sucesso na url: ${REDIS_URL}`
        });
    });
    // Armazenamento no container
    setClient('redis', client, app, 'client');
    setClient('redis', redisConfig, app, 'client-config');
    return client;
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
