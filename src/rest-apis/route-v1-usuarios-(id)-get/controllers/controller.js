/**
 * @file Controller da api de consulta usuarios.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
const form = require('../forms/form');
const model = require('../../models/usuario');
/**
 * Controller da API.
 * @param {object} req Parametros de entrada da API. 
 */
function controller(req) {
    return new Promise((resolve, reject) => {
        let errors = form(req);
        if (_.size(errors) > 0) {
            const Error = require('../../utils/error');
            return reject(new Error(400, errors));
        }
        model.find(req.params.id)
            .then(resultado => {
                resolve({
                    data: resultado
                });
            })
            .catch(erro => {
                reject(erro);
            });
    });
}
module.exports = controller;