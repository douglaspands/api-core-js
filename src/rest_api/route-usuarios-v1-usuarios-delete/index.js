/**
 * @file Excluir usuarios.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
module.exports = (server) => {
    let method = 'delete';
    let route = '/usuarios/v1/usuarios';
    server[method](route, (req, res, next) => {
        res.status(200).send('API REST - DELETE /usuarios/v1/usuarios');
    });
};