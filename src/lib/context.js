/**
 * @file Objeto de contexto das apis para apoio.
 * @author @douglaspands
 * @since 2017-11-06
 */
'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
/**
 * Construtor do Context.
 * @param {string} diretorio Diretorio da api
 * @return {object} Retorna objeto de funções.
 */
function Context(folder, method, uri, xReq) {
    let erros = [];
    let indice = 0;
    let logs = [];
    let diretorio = '';
    let metodo = method;
    let rota = uri;
    let req = {
        headers: _.get(xReq, 'headers', {}),
        query: _.get(xReq, 'query', {}),
        body: _.get(xReq, 'body', {})
    }
    if (_.isString(folder) && fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        diretorio = folder;
    }
    if (!process.env['NODE_ENV']) {
        logs.push({
            index: ++(indice),
            code: 'request',
            message: {
                method: metodo,
                route: rota
            }
        });
    };
    /**
 * Require de modulos com geração de Log.
 * @param {string} modulo Modulo requisitado.
 * @return {object} Retorna modulo solicitado.
 */
    function require(modulo) {
        let mod;
        try {
            mod = require(modulo);
            if (!process.env['NODE_ENV']) {
                logs.push({
                    index: ++(indice),
                    code: 'require',
                    message: modulo
                });
            }
        } catch (e) {
            if (!process.env['NODE_ENV']) {
                logs.push({
                    index: ++(indice),
                    code: 'require error',
                    message: e
                });
            }
        }
        return mod;
    }
    /**
     * Require de modulos com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function module(modulo) {
        let mod, tipo = 'modules';
        switch (true) {
            case fs.existsSync(path.join(diretorio, tipo, modulo + '.js')):
            case fs.existsSync(path.join(diretorio, tipo, modulo + '.json')):
                mod = require(path.join(diretorio, tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Module found',
                        message: modulo
                    });
                }
                break;
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.js')):
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.json')):
                mod = require(path.join(diretorio, '..', tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Module found',
                        message: modulo
                    });
                }
                break;
            default:
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Module not found',
                        message: modulo
                    });
                }
                break;
        }
        return mod;
    }
    /**
     * Require de model com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function model(modulo) {
        let mod, tipo = 'models';
        switch (true) {
            case fs.existsSync(path.join(diretorio, tipo, modulo + '.js')):
                mod = require(path.join(diretorio, tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Model found',
                        message: modulo
                    });
                }
                break;
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.js')):
                mod = require(path.join(diretorio, '..', tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Model found',
                        message: modulo
                    });
                }
                break;
            default:
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Model not found',
                        message: modulo
                    });
                }
                break;
        }
        return mod;
    }
    /**
     * Require de processor com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function processor(modulo) {
        let mod, tipo = 'processors';
        switch (true) {
            case fs.existsSync(path.join(diretorio, tipo, modulo + '.js')):
                mod = require(path.join(diretorio, tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Processor found',
                        message: modulo
                    });
                }
                break;
            default:
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Processor not found',
                        message: modulo
                    });
                }
                break;
        }
        return mod;
    }
    /**
     * Require de service com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function model(modulo) {
        let mod, tipo = 'services';
        switch (true) {
            case fs.existsSync(path.join(diretorio, tipo, modulo + '.js')):
                mod = require(path.join(diretorio, tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Service found',
                        message: modulo
                    });
                }
                break;
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.js')):
                mod = require(path.join(diretorio, '..', tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Service found',
                        message: modulo
                    });
                }
                break;
            default:
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Service not found',
                        message: modulo
                    });
                }
                break;
        }
        return mod;
    }
    /**
     * Require de util com geração de Log.
     * @param {string} modulo Modulo requisitado.
     * @return {object} Retorna modulo solicitado.
     */
    function util(modulo) {
        let mod, tipo = 'utils';
        switch (true) {
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.js')):
            case fs.existsSync(path.join(diretorio, '..', tipo, modulo + '.json')):
                mod = require(path.join(diretorio, '..', tipo, modulo));
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'utils found',
                        message: modulo
                    });
                }
                break;
            default:
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'Utils not found',
                        message: modulo
                    });
                }
                break;
        }
        return mod;
    }
    /**
     * Response da api.
     * @param {number} status Status code da api.
     * @param {object} retorno Retorno da api.
     * @return {void}
     */
    function response() {
        return {
            send: (status, retorno) => {
                let ret = {
                    status: 500,
                    body: {}
                }
                if (_.isNumber(status) && _.isObject(retorno)) {
                    ret.status = status;
                    ret.body = retorno;
                }
                if (!process.env['NODE_ENV']) {
                    logs.push({
                        index: ++(indice),
                        code: 'response',
                        message: ret
                    });
                }
                res.status(ret.status).send(ret.body);
                // Geração de log no console.
                console.log('==========================')
                console.log(JSON.stringify(logs, null, 4));
                console.log('==========================');
            }
        }
    }
    /**
     * Response da api.
     * @param {number} status Status code da api.
     * @param {object} retorno Retorno da api.
     * @return {void}
     */
    function request() {
        if (!process.env['NODE_ENV']) {
            logs.push({
                index: ++(indice),
                code: 'request',
                message: req
            });
        }
        return req;
    }

    return {
        require,
        processor,
        util,
        model,
        module,
        request
    }
}
module.exports = Context;