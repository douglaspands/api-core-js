/**
 * @file Arquivo de alternancia de cache
 * @author @douglaspands
 * @since 2018-09-08
 * @version 1.3.0
 */
'use strict'
module.exports = (context) => {
    const cache = context.get.server('cache');
    /**
     * Enviar erro
     * @param {string} message Mensagem de erro.
     * @returns {void}
     */
    const sendError = (message) => {
        const error = new Error(`Cache Error: Missing the "${message}"!`);
        throw error;
    }
    /**
     * Consultar cache.
     * @param {string} key cache key
     * @returns {function} 
     * - orElseSetValue
     * - orElseSetResultOfMethod 
     */
    function Get(key = sendError('cache key')) {

        if (!(this instanceof Get)) {
            return new Get(key)
        }

        let _key = key;
        let _value = null;
        let _method = null;
        let _args = null;
        let _resetCache = null;
        /**
         * Armazenar em cache e retorna valor.
         * @param {number} segundos para expirar. Caso não preenchido, o valor default é 600 segundos (15 min) 
         * @returns {Promise<object>} Retorna objeto do banco de dados
         */
        this.expireOn = async (seconds = sendError('seconds to expire')) => {
            if (!_value) {
                _value = (!_resetCache && cache) ? await cache.get(_key) : null;
                if (_value) _value = JSON.parse(_value);
                else {
                    _value = await ((Array.isArray(_args)) ? _method(..._args) : _method(_args));
                    if (_value && cache) cache.set(_key, _value, seconds);
                }
            }
            return _value;
        }
        /**
         * set o valor
         * @param {any} value armazenado em cache
         * @returns {function} expireOn
         */
        this.orElseSetValue = (value = sendError('seconds to expire')) => {
            _value = value;
            return this;
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} method para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expireOn 
         */
        this.orElseSetResultOfMethod = (method = sendError('method to be executed'), args = sendError('arguments from method')) => {
            if (typeof method !== 'function') sendError('method as function');
            _method = method;
            _args = args;
            return this;
        }

        /**
         * Serve pra verificar se existe uma solicitação  pra limpar o cache
         * @param {boolean} reset parametro para resetar o cache da api 
         * @returns {this}
         */
        this.resetCache = (reset) => {
            _resetCache = (reset === true) ? true : false;
            return this;
        }
    }
    /**
     * set cache.
     * @param {string} key key
     * @returns {function} 
     * - setValue
     * - withResultOfMethod
     */
    function Set(key = sendError('cache key')) {

        if (!(this instanceof Set)) {
            return new Set(key)
        }

        let _key = key;
        let _value = null;
        let _method = null;
        let _args = null;
        const EXTRACT_KEY = new RegExp('(?<=\{\{)(.+)(?=\}\})', 'g');
        const REPLACE_KEY = new RegExp('(\{\{)(.+)(\}\})', 'g');
        /**
         * Armazenar em cache e retorna valor.
         * @param {number} seconds para expirar. Caso não preenchido, o valor default é 600 segundos (15 min) 
         * @returns {Promise<object>} Retorna objeto do banco de dados
         */
        this.expireOn = async (seconds = sendError('seconds to expire')) => {
            if (!_value) _value = (Array.isArray(_args)) ? await _method(..._args) : await _method(_args);
            try {
                const [key] = _key.match(EXTRACT_KEY);
                if (_value && cache) cache.set(_key.replace(REPLACE_KEY, _value[key]), _value, seconds);
                return _value;
            } catch (error) {
                if (_value && cache) cache.set(_key, _value, seconds);
                return _value;
            }
        }
        /**
         * set o valor
         * @param {any} value armazenado em cache
         * @returns {function} expireOn
         */
        this.withValue = (value = sendError('seconds to expire')) => {
            _value = value;
            return this;
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} method para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expireOn 
         */
        this.withResultOfMethod = (method = sendError('method to be executed'), args = sendError('arguments from method')) => {
            if (typeof method !== 'function') sendError('method as function');
            _method = method;
            _args = args;
            return this;
        }
    }
    /**
     * remove cache.
     * @param {string} cache key
     * @returns {function} 
     * - now
     * - afterMethod
     */
    function Remove(key = sendError('cache key')) {

        if (!(this instanceof Remove)) {
            return new Remove(key)
        }

        let _key = key;
        let _method = null;
        let _args = null;
        let _value = null;
        /**
         * Remove do cache
         * @returns {Promise<any>}
         */
        this.now = async () => {
            if (_method) _value = await _method(_args)
            if (cache) cache.del(_key);
            return (_value) ? _value : true;
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} method para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expirarCacheEm 
         */
        this.afterMethod = async (method = sendError('method to be executed'), args = sendError('arguments from method')) => {
            if (typeof method !== 'function') sendError('method as function');
            _method = method;
            _args = args;
            return this.now();
        }
    }

    return {
        get: Get,
        set: Set,
        remove: Remove
    }
}