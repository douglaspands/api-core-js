/**
 * @file Consultar usuario.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
/**
 * Registro da Rota
 * @return {object} Retorna o metodo e a uri da rota.
 */
module.exports.route = {
    method: 'get',
    uri: '/v1/usuarios/:id'
};
/**
 * Modulo para validar os parametros de entrada.
 * @param {object} req Objeto que contem parametros de entrada da api.
 * @param {object} res Objeto com modulos de envio de dados.
 * @param {object} context Objeto de contexto para apis.
 * @return {void}
 */
module.exports.validator = (req, res, context) => {

    // Modulos
    const _ = context.require('lodash');    
 
    const form = context.module('form');
    const message = context.message();
    
    // Validar parametros de entrada
    const errorForm = form(req, context);
    if (!_.isEmpty(errorForm)) {
        res.send(message.badRequest(errorForm));
    }

}
/**
 * Controller da rota.
 * @param {object} req Objeto que contem parametros de entrada da api.
 * @param {object} res Objeto com modulos de envio de dados.
 * @param {object} context Objeto de contexto para apis.
 * @return {void}
 */
module.exports.controller = (req, res, context) => {

    const message = context.message()
    const _ = context.require('lodash');
    const processor = context.processor('processor');

    processor(req, context, (erro, resultado) => {
        if (erro) {
            res.send(erro.status, erro.message);
        } else {
            if (_.isEmpty(resultado)) {
                res.send(message.noContent());
            } else {
                res.send(message.sucess(resultado));
            }
        }
    });
};
