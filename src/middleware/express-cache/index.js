/**
 * @file Conexão com o Redis
 * @author douglaspands
 * @since 2018-09-03
 */
'use strict';
const redis = require("redis");
const { source, host, port, database, time_default } = require('./config');
const REDIS_HOST = (process.env.CACHE_HOST || host);

/**
 * Obter conexão com o Redis
 * @param {function} app Servidor Express.
 */
module.exports = app => {

    const logger = app.get('logger');

    const cache = redis.createClient({
        host: REDIS_HOST,
        port: port,
        db: database,
        detect_buffers: true
    });

    cache.on("error", error => {
        app.set('cache', null);
        logger.log({
            level: 'warn',
            source: source,
            message: `Tentando conectar na url: redis://${REDIS_HOST}:${port}...`
        });
        logger.log({
            level: 'warn',
            source: source,
            message: error
        });
    });

    cache.on("connect", () => {
        let _cache = {
            get: (key) => {
                return new Promise(resolve => {
                    cache.get(key, (error, data) => {
                        if (error) return resolve(null);
                        else return resolve(data);
                    });
                });
            },
            set: (key, value, time = time_default) => {
                const _value = (typeof value === 'object')? JSON.stringify(value): value.toString();
                cache.setex(key, time, _value);
                return value;
            },
            url: REDIS_HOST
        }
        app.set('cache', _cache);
        logger.log({
            level: 'info',
            source: source,
            message: `Redis (cache) ativado com sucesso na url: redis://${REDIS_HOST}:${port}`
        });
    });

    app.use((req, res, next) => {
        const { method, originalUrl } = req;
        req['restCacheId'] = `${originalUrl}[${method}]`;
        next();
    });

}
