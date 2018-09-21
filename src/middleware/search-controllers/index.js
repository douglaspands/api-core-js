/**
 * @file Procura controller nos arquivos
 * @author @douglaspands
 * @since 2018-03-02
 * @version 2.0.20180921
 */
'use strict';
const fs = require('fs');
const _ = require('lodash');
const utils = require('../utils');
const config = utils.getYaml('config.yaml');

const REGEX_FILE_TYPE = new RegExp(config.file_type, 'i');
/**
 * Identifica notações abaixo para identificação se é uma controller e anota a rota.
 * @controller - tipo da api
 * @verb - verbo http
 * @uri - rota
 * @param {array} filesList lista de arquivos .js para analisar
 * @return {array} Retorna uma lista de objetos contendo:
 * controller: tipo de api
 * verb: verbo http
 * uri: rota
 * file: endereço do arquivo
 */
const searchController = filesList => {
    /**
     * Verifica se foi identificado todas as notações necessariaspara cadastro da rota.
     * @param {object} route Representa os parametros minimos pra cadastrar a rota.
     * @return {boolean} Retorna 'true' se a rota tiver o minimo necessario
     */
    const verifyRest = route => {
        return route.controller && route.controller.length > 0 &&
            route.method && route.method.length > 0 && _.includes(config.methods, route.method) &&
            route.uri && route.uri.length > 0;
    }
    /**
     * Verifica se foi identificado todas as notações necessariaspara cadastro da rota.
     * @param {object} route Representa os parametros minimos pra cadastrar a rota.
     * @return {boolean} Retorna 'true' se a rota tiver o minimo necessario
     */
    const verifyGraphql = route => {
        return route.controller && route.controller.length > 0 &&
            route.graphql && route.graphql.length > 0 && fs.existsSync(route.graphql) && fs.lstatSync(route.graphql).isFile();
    }
    const routesList = filesList.reduce((routes, file) => {
        if ((REGEX_FILE_TYPE).test(file)) {
            try {
                const controller = require(file);
                if (controller.route && typeof controller.route === 'function') {
                    const route = controller.route();
                    if (route.graphql) {
                        route.graphql = file.replace(config.file, route.graphql);
                        if (verifyGraphql(route)) {
                            route['file'] = file;
                            routes.push(route);
                        }
                    } else if (verifyRest(route)) {
                        route['file'] = file;
                        routes.push(route);
                    }
                }
            } catch (error) { }
        }
        return routes;
    }, []);
    return routesList;
}

module.exports = searchController;