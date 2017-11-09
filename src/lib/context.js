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
function Context(folder, log) {
    let indice = 0;
    let diretorio = '';
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
    return {
        require,
        processor,
        util,
        model,
        module,
    }
}
module.exports = Context;