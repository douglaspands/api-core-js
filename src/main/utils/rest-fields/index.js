/**
 * @file Filtrar o objeto de retorno pelos campos selecionados
 * @author douglaspands
 * @since 2017-12-08
 */
'use strict';

const _ = require('lodash');

/**
 * Seleciona apenas os campos recebidos.
 * @param {object} body Objeto de retorno
 * @param {string} fields Lista de campos que serão recortados do objeto de retorno.
 * Ex.: ?fields=nome,empresa,estado
 * @return {object} Será retornado somente os campos recebidos. 
 */
function fieldsIncludes(body, fields) {

    if (!_.isObjectLike(body) || _.isEmpty(body)) return {};
    if (!_.isString(fields) || _.isEmpty(fields)) return {};

    const _fields = (fields.split(',')).map(_.trim);

    return _.reduce(_fields, (_body, f) => {
        _body[f] = body[f];
        return _body;
    }, {});

}

module.exports = fieldsIncludes;