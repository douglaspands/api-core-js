/**
 * @file Modulo para scanear APIs REST.
 * @author douglaspands
 * @since 2017-12-26
 */
'use strict';

const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const _ = require('lodash');
const { prefix, nome_modulo, folder_app } = require('config');
const Context = require('../context-app');
const dirApps = path.join(__dirname, '../..', folder_app);

/**
 * Rotas Rest
 * @param {object} app Modulo do Express
 * @return {Promise.<Array>} Lista de rotas.
 */
module.exports = async app => {

    const logger = app.get('logger');

    /**
     * Função pra geração de mensagens de erro
     * @param {object} errorFormat mensagem de erro
     * @return {void} 
     */
    function logError(errorFormat) {
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: `folder.: ${errorFormat.dir}`
        });
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: `route..: ${errorFormat.route}`
        });
    }

    const rest = [];

    (fs.readdirSync(dirApps)).forEach((pasta) => {

        const dirAPI = path.join(dirApps, pasta);
        const prefixRegex = new RegExp('^' + prefix + '(.+)$', 'g');

        if (prefixRegex.test(pasta) && fs.lstatSync(dirAPI).isDirectory()) {

            if (_.includes(fs.readdirSync(dirAPI), 'index.js')) {
                const api = require(dirAPI);
                let route;
                const context = new Context(dirAPI, app);
                try {
                    const listHandlers = _.reduce((_.without(Object.keys(api), 'route')), (handlers, fn) => {
                        function createHandler() {
                            function handler() {
                                let args = Array.prototype.slice.call(arguments);
                                args.push(context);
                                api[fn].apply(this, args);
                            }
                            return handler;
                        }
                        handlers.push(new createHandler());
                        return handlers;
                    }, []);
                    route = api.route();
                    router[route.method](route.uri, listHandlers);
                    rest.push(route);
                } catch (error) {
                    const errorFormat = {
                        dir: dirAPI,
                        route: route
                    };
                    logger.log({
                        level: 'error',
                        source: nome_modulo,
                        message: error
                    });
                    logError(errorFormat);
                }
            }
        }
    });

    // Registrar todas as rotas
    app.use('/', router);

    logger.log({
        level: 'info',
        source: nome_modulo,
        message: 'RestServer ativado com sucesso!'
    });

    return rest;

}

