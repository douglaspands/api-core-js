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
module.exports.route = () => {
    return {
        method: 'get',
        uri: '/v1/usuarios/:id'
    }
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
    const verify = context.verify();

    verify.check('id', req.params.id, 'Campo preenchido com caracteres não numericos.')
        .isValid((id) => _.isString(id) && (/^[0-9]+$/g).test(id));

    if (verify.containErrors()) {
        res.send(verify.messageBadRequest());
    }
    return verify.getErrors();

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
            res.send(erro);
        } else {
            if (_.isEmpty(resultado)) {
                res.send(message.noContent());
            } else {
                res.send(message.sucess(resultado));
            }
        }
    });
};
