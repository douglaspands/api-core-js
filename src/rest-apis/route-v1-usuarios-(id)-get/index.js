/**
 * @file Obter lista de usuarios.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
/**
 * Registro da rota.
 * @param {object} server Objeto do framework http.
 * @return {void}
 */
function route(server) {
    let method = 'get';
    let route = '/v1/usuarios/:id';
    server[method](route, (req, res, next) => {
        const _ = require('lodash');
        const controller = require('./controllers/controller');
        controller(req, (erro, resultado) => {
            if (erro) {
                res.status(erro.code).send(erro);
            } else {
                if (_.isEmpty(resultado.data)) {
                    res.sendStatus(204);
                } else {
                    res.status(200).send(resultado);
                }
            }
        });
    });
};
module.exports = route;