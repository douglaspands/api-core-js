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
    const _ = context.module('lodash');
    const form = context.localModule('form');
    const model = context.model('usuario');
    const Error = context.util('error');    
    let errors = form(req, context);
    if (_.size(errors) > 0) {
        return done(new Error(400, errors));
    }
    model.find(req.params.id, (erro, resultado) => {
        if (erro) {
            done(erro);
        } else {
            done(null, resultado);
        }
    });
};
module.exports = controller;