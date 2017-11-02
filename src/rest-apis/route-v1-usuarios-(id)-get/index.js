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
        const controller = require('./controllers/controller');
        controller(req)
            .then(resultado => {
                res.status(200).send(resultado);
            })
            .catch(erro => {
                res.status(erro.code).send(erro)
            });
    });
};
module.exports = route;