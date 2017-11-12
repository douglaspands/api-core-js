/**
 * @file Utilitarios de apoio.
 * @author @douglaspands
 * @since 2017-11-11
 */
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
/**
 * Pesquisa em uma determinada pasta uma rota.
 * @param {string} diretorio Diretorio que será scaneado. 
 * @param {string} initial Identificador que pasta é uma rota.
 * @return {array} Lista de diretorios que constitui uma api. 
 */
function scanRoutes(diretorio, initial) {

    let retorno = [];

    if (!diretorio || !_.isString(diretorio) || !fs.existsSync(diretorio) || !fs.lstatSync(diretorio).isDirectory()) {
        return retorno;
    }
    if (!initial || !_.isString(initial)) {
        initial = 'route';
    }
    let diretorioRegex = new RegExp(('^(' + initial + ')(-.+)$'));

    retorno = _.reduce(fs.readdirSync(diretorio), (lista, pasta) => {
        let index = path.join(diretorio, pasta, 'index.js');
        if (diretorioRegex.test(pasta) && fs.existsSync(index)) {
            lista.push(path.join(diretorio, pasta));
        }
        return lista;
    }, []);

    return retorno;
}
/**
 * Modulos exportados
 */
module.exports = {
    scanRoutes
}
