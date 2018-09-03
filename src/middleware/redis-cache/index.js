/**
 * @file Conexão com o Redis
 * @author douglaspands
 * @since 2018-09-03
 */
'use strict';
'use strict';
const redis = require("redis");
const { source, uri, database } = require('./config');
const URL_REDIS = (process.env.REDIS_CACHE || uri);

/**
 * Obter conexão com o Redis
 * @param {function} app Servidor Express.
 */
module.exports = app => {
    
    const logger = app.get('logger');

    const cache = redis.createClient({
        uri: `${URL_REDIS}/${database}`
    });

    cache.on("error", error => {
        app.set('cache', null);
        logger.log({
            level: 'error',
            source: source,
            message: error
        });
    });

    cache.on("connect", () => {
        cache.url = URL_REDIS;
        app.set('cache', cache);
        logger.log({
            level: 'info',
            source: source,
            message: `Redis (cache) ativado com sucesso na url: ${URL_REDIS}`
        });
    });

}
