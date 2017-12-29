/**
 * @file Procura controller nos arquivos
 * @author @douglaspands
 * @since 2017-12-28
 * Será pesquisado as controllers de apis rest e graphql.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('./config');
const REGEX_FILE_TYPE = new RegExp(config.file_type);
const REGEX_ANNOTATIONS = new RegExp(`(${config.annotations.join('|')})\\s(.+)?(?=[\\n\\s\\t])`, 'gi');
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
     * @param {object} r Representa os parametros minimos pra cadastrar a rota.
     * @return {boolean} Retorna 'true' se a rota tiver o minimo necessario
     */
    const verifyRestRoute = route => {
        return route.controller && route.controller.length > 0 &&
            route.verb && route.verb.length > 0 && _.includes(['get', 'put', 'post', 'patch', 'delete'], route.verb) &&
            route.uri && route.uri.length > 0;
    }
    const verifyGraphql = route => {
        return route.controller && route.controller.length > 0 &&
            route.graphql && route.graphql.length > 0 && fs.existsSync(route.graphql) && fs.lstatSync(route.graphql).isFile();
    }
    const routesList = filesList.reduce((routes, file) => {
        if ((REGEX_FILE_TYPE).test(file)) {
            const f = fs.readFileSync(file, 'utf8');
            const annotations = (f.match(REGEX_ANNOTATIONS) || []);
            if (annotations.length > 0) {
                let route = annotations.reduce((_route, stringDoc) => {
                    let _parms = stringDoc.split(' ');
                    _parms[0] = _parms[0].replace('@', '');
                    _route[_parms[0]] = _parms[1];
                    if (_route.verb) _route.verb = _route.verb.toLowerCase();
                    if (_route.graphql) _route.graphql = path.join(file, '..', _route.graphql);
                    return _route;
                }, {});
                if (verifyRestRoute(route) || verifyGraphql(route)) {
                    route['file'] = file;
                    routes.push(route);
                }
            }
        }
        return routes;
    }, []);
    return routesList;
}

module.exports = searchController;