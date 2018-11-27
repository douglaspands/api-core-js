/**
 * @file Procura controller nos arquivos
 * @author @douglaspands
 * @since 2018-03-02
 * @version 2.1.20181126
 */
'use strict';
const fs = require('fs');
const path = require('path');
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

    const routesList = filesList.reduce((routes, file) => {
        if ((REGEX_FILE_TYPE).test(file)) {
            try {
                const route = utils.getYaml(file);
                if (route) {
                    if (verifyGraphql(route, file)) {
                        route['file'] = replaceFile(file, config.file);
                        routes.push(route);
                    } else if (verifyRest(route, file)) {
                        route['file'] = replaceFile(file, config.file);
                        routes.push(route);
                    }
                }
            } catch (error) { }
        }
        return routes;
    }, []);
    return routesList;
}
/**
 * Verifica se foi identificado todas as notações necessariaspara cadastro da rota.
 * @param {object} route Representa os parametros minimos pra cadastrar a rota.
 * @param {string} file Caminho do arquivo com parametrizações da rota.
 * @return {boolean} Retorna 'true' se a rota tiver o minimo necessario
 */
function verifyRest(route, file) {
    return route.type &&
        typeof route.type === 'string' &&
        route.type.toUpperCase() === 'REST' &&
        route.method &&
        typeof route.method === 'string' &&
        _.includes(config.methods, route.method) &&
        route.uri &&
        typeof route.uri === 'string' &&
        route.uri.length > 0 &&
        fs.existsSync(replaceFile(file, config.file)) &&
        fs.lstatSync(replaceFile(file, config.file)).isFile();
}
/**
 * Verifica se foi identificado todas as notações necessariaspara cadastro da rota.
 * @param {object} route Representa os parametros minimos pra cadastrar a rota.
 * @param {string} file Caminho do arquivo com parametrizações da rota.
 * @return {boolean} Retorna 'true' se a rota tiver o minimo necessario
 */
function verifyGraphql(route, file) {
    return route.type &&
        typeof route.type === 'string' &&
        route.type.toUpperCase() === 'GRAPHQL' &&
        route.schema &&
        typeof route.schema === 'string' &&
        route.schema.length > 0 &&
        fs.existsSync(replaceFile(file, route.schema)) &&
        fs.lstatSync(replaceFile(file, route.schema)).isFile() &&
        fs.existsSync(replaceFile(file, config.file)) &&
        fs.lstatSync(replaceFile(file, config.file)).isFile()
}
/**
 * Substituir nome do arquivo no endereço completo.
 * @param {string} fullpath Endereço completo do arquivo.
 * @param {string} fileName Nome do arquivo irá substituir.
 * @return {string} Caminho no novo arquivo.
 */
function replaceFile(fullpath, fileName) {
    return path.join(fullpath, '..', fileName);
}

module.exports = searchController;