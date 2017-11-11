/**
 * @file Obter lista de usuarios.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
/**
 * Registro da Rota 
 */
module.exports.route = {
    method: 'get',
    route: '/v1/usuarios/:id'
};
/**
 * Registro da rota.
 * @param {object} server Objeto do framework http.
 * @return {void}
 */
module.exports.controller = (req, res, context) => {
    
    const _ = context.require('lodash');
    const processor = context.processor('processor');
    
    processor(req, context, (erro, resultado) => {
        if (erro) {
            res.send(erro.code, erro);
        } else {
            if (_.get(resultado, 'data', null) && _.isEmpty(resultado.data)) {
                res.send(204, {});
            } else {
                res.send(200, {
                    data: resultado
                });
            }
        }
    });
};
