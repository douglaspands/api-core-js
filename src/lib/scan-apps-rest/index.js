/**
 * @file Modulo para scanear APIs REST.
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Context = require('../context-app');

// Diretorio das APIs em GraphQL
const folderApp = 'apps';
const dirApps = path.join(__dirname, '../..', folderApp);

// Sufixo da pasta com o codigo fonte da API
const prefix = 'rest';

/**
 * Mapear script GraphQL
 * @param {object} server Modulo do Express
 * @return {array} Lista de rotas.
 */
module.exports = server => {

    const rest = [];
    const errors = [];

    (fs.readdirSync(dirApps)).forEach((pasta) => {

        const dirAPI = path.join(dirApps, pasta);
        const prefixRegex = new RegExp('^' + prefix + '(.+)$', 'g');

        if (prefixRegex.test(pasta) && fs.lstatSync(dirAPI).isDirectory()) {

            if (_.includes(fs.readdirSync(dirAPI), 'index.js')) {
                const api = require(dirAPI);
                let route;
                const context = new Context(dirAPI, server);
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
                    server[route.method](route.uri, listHandlers);
                    rest.push(route);
                } catch (error) {
                    errors.push({
                        dir: dirAPI,
                        route: route
                    })
                }

            }
        }
    });

    if (errors.length > 0) {
        console.log('Erro no registro da API REST:');
        errors.forEach(error => {
            console.log(`-> Diretorio da REST API.: ${error.dir}`);
            console.log(`-> Rota.: [${_.get(error, 'route.method', '')}] ${_.get(error, 'route.uri', '')}`);
        })
    }

    return rest;

}

