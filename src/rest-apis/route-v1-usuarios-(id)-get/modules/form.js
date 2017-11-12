/**
 * @file Validar parametros de entrada.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
/**
 * Validar parametros de entrada.
 * @param {object} req Objeto com parametros de entrada.
 * @return {Array.<Object>}
 */
function validator (req, context) {

    const _ = context.require('lodash');
    const error = context.util('error');
    
    let listaErros = [];

    if (!_.isString(req.params.id) || !(/^[0-9]+$/g).test(req.params.id)) {
        listaErros.push(error.form('id', req.params.id, 'Campo preenchido com caracteres não numericos.'));
    }

    return listaErros;

}
module.exports = validator;
