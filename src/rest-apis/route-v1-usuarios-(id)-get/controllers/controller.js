/**
 * @file Controller da api de consulta usuarios.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
const form = require('../modules/form');
const model = require('../../models/usuario');
const Error = require('../../utils/error');
/**
 * Controller da API.
 * @param {object} req Parametros de entrada da API.
 * @param {function} done Callback de finalização.
 * @return {void}
 */
function controller(req, done) {
    let errors = form(req);
    if (_.size(errors) > 0) {
        return done(new Error(400, errors));
    }
    model.find(req.params.id, (erro, resultado) => {
        if (erro) {
            done(erro);
        } else {
            done(null, {
                data: resultado
            });
        }
    });
};
module.exports = controller;