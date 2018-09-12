/**
 * @file Conexão com o Redis
 * @author douglaspands
 * @since 2018-09-03
 */
'use strict';
const redis = require("redis");
const { source, uri, database, time_default } = require('./config');
const [REDIS_HOST, REDIS_PORT] = (process.env.REDIS_URL || uri).split(':');
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

/**
 * Obter conexão com o Redis
 * @param {function} app Servidor Express.
 */
module.exports = app => {

    const logger = app.get('logger');
    
    /**
     * Criando conexão.
     */
    const cache = redis.createClient({
        host: REDIS_HOST,
        port: REDIS_PORT,
        db: database,
        detect_buffers: true
    });

    /**
     * Em caso de erro no acesso ao cache.
     */
    cache.on("error", error => {
        app.set('cache', null);
        logger.log({
            level: 'warn',
            source: source,
            message: `Tentando conectar na url: ${REDIS_URL}...`
        });
        logger.log({
            level: 'warn',
            source: source,
            message: error
        });
    });

    /**
     * Em caso de conexão com sucesso.
     */
    cache.on("connect", () => {
        let _cache = {
            get: (key) => {
                return new Promise(resolve => {
                    cache.get(key, (error, data) => {
                        if (error) {
                            logger.log({
                                level: 'debug',
                                source: source,
                                message: `cache.get(key=${key}): error=${error}`
                            });                    
                            return resolve(null);
                        } else {
                            logger.log({
                                level: 'debug',
                                source: source,
                                message: `cache.get(key=${key}): value=${data}`
                            });                    
                            return resolve(data);
                        }
                    });
                });
            },
            set: (key, value, time = time_default) => {
                const _value = (typeof value === 'object')? JSON.stringify(value): value.toString();
                cache.set(key, _value, 'EX', time);
                logger.log({
                    level: 'debug',
                    source: source,
                    message: `cache.set(key=${key}, value=${_value}, 'EX', seconds=${time})`
                });                    
                return value;
            },
            del: (key) => {
                cache.del(key);
                logger.log({
                    level: 'debug',
                    source: source,
                    message: `cache.del(key=${key})`
                });                    
            },
            url: REDIS_URL
        }
        app.set('cache', _cache);
        logger.log({
            level: 'info',
            source: source,
            message: `Redis (cache) ativado com sucesso na url: ${REDIS_URL}`
        });
    });

}
