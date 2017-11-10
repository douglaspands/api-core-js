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
    const _ = context.require('lodash');
    const form = context.module('form');
    const model = context.model('usuario');
    const error = context.util('error');    

    let errors = form(req, context);
    if (_.size(errors) > 0) {
        return done(error.send(400, errors));
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