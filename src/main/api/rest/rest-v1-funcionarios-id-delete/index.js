/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ params }, res, next, { get }) => {

    const service = get.self.context.module('services/funcionarios-service');
    const validarEntrada = get.self.context.module('modules/validador');

    const errors = validarEntrada({ _id: params._id });
    if (errors) return res.status(400).send(errors);

    try {
        const ret = await service.removerFuncionario(params._id);
        return res.status(200).send({ data: ret });
    } catch (error) {
        return res.status(404).send();
    }

};