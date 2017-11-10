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
    const FormError = context.util('formError');
        
    let errors = [];

    if (!_.isString(req.params.cpf) || !(/^[0-9]+$/g).test(req.params.cpf)) {
        errors.push(new FormError('cpf', req.params.cpf, 'CPF Invalido!'));
    }

    return errors;

}
module.exports = validator;