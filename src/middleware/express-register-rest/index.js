/**
 * @file Cadastrando rotas REST no express.Router()
 * @author @douglaspands
 * @since 2018-09-13
 * @version 1.0.0
 */
'use strict';
const _ = require('lodash');
const source = (__dirname).split('/').pop();
// Objeto de contexto
const Context = require('../../middleware/express-context');

module.exports = app => {
    // Objeto de log
    const logger = app.get('logger');
    /**
     * Registra rotas rest no servidor app
     * @param {array<object>} restList
     * - controller: tipo de api
     * - method: qual o metodo http
     * - uri: rota
     * - file: arquivo com os handlers (controller)
     * @returns {object} Retorna um objeto com as propriedades:
     * - router: objeto express.Router() com as rotas cadastradas
     * - list: Lista com as rotas cadastradas. Cada objeto contem
     * +- uri: rota pra execução
     * +- method: metodo pra execução 
     */
    const register = restList => {
        let router = null;
        let list = [];
        // Pra cada api na lista, sera feito o registro dela
        restList.forEach(route => {
            const api = require(route.file);
            const context = new Context(route.file, app);
            let functionsList = [];
            if (typeof api === 'function') functionsList = [api];
            else if (typeof api === 'object') functionsList = (_.pull(Object.keys(api), 'route')).map(fn => api[fn]);
            const handlersList = functionsList.reduce((handlers, fn) => {
                function createHandler(fn) {
                    function handler() {
                        let args = Array.prototype.slice.call(arguments);
                        args.push(context);
                        fn.apply(this, args);
                    }
                    return handler;
                }
                if (typeof fn === 'function') handlers.push(new createHandler(fn));
                return handlers;
            }, []);
            try {
                if (!router) router = require('express').Router();
                router[route.method](route.uri, handlersList);
                list.push({ uri: route.uri, method: route.method });
            } catch (error) {
                logger.error({
                    source: source,
                    message: error.stack
                });
            }
        });
        return { router, list };
    }
    return { register };
};
