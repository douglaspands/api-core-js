/**
 * @file utils.js
 * @description Utilitarios de apoio a montagem de apis
 * @since 2018-12-13
 */
'use strict';
const _ = require('lodash');
const Context = require('../express-context');

/**
 * Retorna a lista de handlers da api
 * @param {Object} api Objeto que representa uma api
 * @returns {Array.<Function>} Lista de funções que representam handlers.
 */
function handlerList (api, app) {
    let functionsList = [];
    if (_.isFunction(api)) {
        functionsList = [api];
    } else if (_.isObjectLike(api)) {
        functionsList = _.reduce(Object.keys(api),
            (handlers, fn) => {
                if (_.isFunction(api[fn])) {
                    handlers.push(createHandler(api[fn], app));
                }
                return handlers;
            }, []);
    }
    return functionsList;
}

/**
 * Classe para encapulamento de handlers de execução.
 * @param {Function} fn 
 * @param {Object} app Express() 
 */
function createHandler(fn, app) {
    return function () {
        let args = [].slice.call(arguments);
        args.push(new Context(app));
        fn.apply(this, args);
    }
}

module.exports = {
    handlerList,
    createHandler
}
