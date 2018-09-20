/**
 * @file Classe de funções basicas do cache
 * @author @douglaspands
 * @since 2018-09-17
 * @version 1.0.0
 * Essa classe foi desenvolvida devido ao bug de não conseguir armazenar o client no Redis no Express.js
 */
'use strict';
/**
 * Classe com funções basicas do redis
 * @param {*} clientRedis 
 * @param {*} logger 
 */
function Cache(clientRedis, logger) {
    if (!(this instanceof Cache)) {
        return new Cache(clientRedis);
    }
    const _client = clientRedis;
    const _logger = logger;
    this.get = async (key) => new Promise((resolve, reject) => _client.get(key, (error, data) => {
        if (error) {
            _logger.warn({
                source: 'cache',
                message: `get error:${error.toString()}`
            });
            reject(error);
        } else {
            let _data = null; 
            try {
                _data = JSON.parse(data);
            } catch (error) {
                _data = data;
            }
            _logger.debug({
                source: 'cache',
                message: `get(${key}):${data}`
            });
            resolve(_data);    
        }
    }));
    this.set = async (key, value, seconds) => new Promise((resolve, reject) => {
        const _value = (typeof value === 'object') ? JSON.stringify(value) : value.toString();
        _client.set(key, _value, 'EX', seconds, error => {
            if (error) {
                _logger.warn({
                    source: 'cache',
                    message: `set error:${error.toString()}`
                });
                reject(error);
            } else {
                _logger.debug({
                    source: 'cache',
                    message: `set(${key}, ${_value}, \'EX\', ${seconds}):OK`
                });
                resolve();
            }
        });
    });
    this.del = async (key) => new Promise((resolve, reject) => _client.del(key, (error) => {
        if (error) {
            _logger.warn({
                source: 'cache',
                message: `del error:${error.toString()}`
            });
            reject(error);
        } else {
            _logger.debug({
                source: 'cache',
                message: `del(${key}):OK`
            });
            resolve();
        }
    }));
}
module.exports = Cache;