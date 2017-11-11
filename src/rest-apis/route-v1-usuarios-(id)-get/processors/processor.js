/**
 * @file Controller da api de consulta usuarios.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
/**
 * Controller da API.
 * @param {object} req Parametros de entrada da API.
 * @param {object} context Objeto de contexto.
 * @param {function} done Callback de finalização.
 * @return {void}
 */
function controller(req, context, done) {

    // Modulos
    const _ = context.require('lodash');
    const form = context.module('form');
    const model = context.model('usuario');
    const error = context.util('error');    

    // Validar parametros de entrada
    const errorForm = form(req, context);
    if (!_.isEmpty(errorForm)) {
        return done(error.create(400, errorForm));
    }

    // Pesquisando usuario pelo id
    model.find(req.params.id, (erro, resultado) => {
        if (erro) {
            done(erro);
        } else {
            done(null, resultado);
        }
    });
};

module.exports = controller;
