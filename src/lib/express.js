/**
 * @file Utilitarios para o framework express.js.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Log = require('./log');
const Context = require('./context');
const Response = require('./response');
const config = require('../config/server');
/**
 * @param {string} dir diretorio do servidor.
 * @return {utilsExpress} Retorna funções.
 */
module.exports = (dir) => {

    let server;
    let diretorioServidor = dir;

    /**
     * Criar o servidor.
     * @return {object} Objeto do express().
     */
    function create() {
        server = express();
        server.use(express.static(path.join(__dirname, 'public')));
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());
        return server; 
    }
    /**
     * Executa iteração para cada rota.
     * @param {function} callback Funcao que sera executada a cada rota encontrada.
     * @return {array} Lista de rotas registradas.
     */
    function forEachRoute(callback) {
        return (server._router.stack || []).reduce((routes, o) => {
            if (o.route && o.route.path) {
                let route = {
                    path: o.route.path,
                    method: (Object.keys(o.route.methods)[0]).toUpperCase()
                };
                if (typeof callback === 'function') callback(route);
                routes.push(route);
            }
            return routes;
        }, []);
    }
    /**
     * Procura arquivo index.js no segundo nivel de diretorios.
     * @return {void}
     */
    function scanRoutes() {
        const folder = path.join(diretorioServidor, config.PASTA_APIS);
        (fs.readdirSync(folder)).forEach(route => {
            if ((/^(route-)(.)+$/g).test(route)) {
                const folderRoute = path.join(folder, route);
                const controller = path.join(folder, route, 'index.js');
                if (fs.existsSync(controller)) {
                    const api = require(controller);
                    const method = (_.get(api, 'route.method', '')).toLowerCase();
                    const uri = (_.get(api, 'route.route', '')).toLowerCase();
                    try {
                        server[method](uri, (req, res) => {
                            const log = new Log();
                            const context = new Context(folderRoute, log);
                            const response = new Response(res, log);
                            log.push('Request', {
                                method: method,
                                uri: req.path,
                                folderRoute: folderRoute,
                                headers: req.headers,
                                params: req.params,
                                query: req.query,
                                body: req.body
                            });
                            try {
                                api.controller(req, response, context);
                            } catch (error) {
                                response.send(500, {
                                    code: 'Erro interno',
                                    message: 'Favor contatar o administrador do sistema!'
                                });
                                log.push('error', {
                                    code: error.code,
                                    message: error.message,
                                    stack: error.stack
                                });
                            }
                            // Geração de log no console.
                            log.display();
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });
        server.use((req, res, next) => {
            res.status(404).send('Rota não encontrada!');
        });        
    }
    /**
     * Iniciando o servidor.
     * @param {number} port Numero da porta de conexão.
     * @param {function} callback Função que será executada apos iniciar o servidor.
     * @return {object} Retorno resultado do inicio do servidor. 
     */
    function start(callback) {
        const porta = process.env.PORT || config.PORTA || 3000;
        return server.listen(porta, (callback)? callback(porta) : null);
    }
    /**
     * Objeto de retorno.
     */
    return {
        start,
        create,
        forEachRoute,
        scanRoutes
    }
}
