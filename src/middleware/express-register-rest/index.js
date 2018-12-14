/**
 * @file Cadastrando rotas REST no express.Router()
 * @author @douglaspands
 * @since 2018-09-13
 * @version 1.2.0-20181213
 */
'use strict';
const _ = require('lodash');
const source = (__dirname).split('/').pop();
const utils = require('./handlers-utils');

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
        _.forEach(restList, route => {
            const api = require(route.file);
            const handlersList = utils.handlerList(api, app);
            if (_.size(handlersList) > 0) {
                if (!router) router = require('express').Router();
                try {
                    router[route.method](route.uri, handlersList);
                    list.push({ uri: route.uri, method: route.method });
                } catch (error) {
                    logger.error({ source: source, message: error.stack });
                }
            }
        });
        return { router, list };
    }
    return { register };
};
