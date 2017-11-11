/**
 * @file Consultar usuario.
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
 * Controller da rota..
 * @param {object} req Objeto que contem parametros de entrada da api.
 * @param {object} res Objeto com modulos de envio de dados.
 * @param {object} context Objeto de contexto para apis.
 * @return {void}
 */
module.exports.controller = (req, res, context) => {
    
    const _ = context.require('lodash');
    const processor = context.processor('processor');
    
    processor(req, context, (erro, resultado) => {
        if (erro) {
            res.send(erro.status, erro.message);
        } else {
            if (_.isEmpty(resultado)) {
                res.send(204, {});
            } else {
                res.send(200, {
                    data: resultado
                });
            }
        }
    });
};
