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
module.exports.controller = async ({ body }, res, next, { get }) => {

    const service = get.self.context.module('services/funcionarios-service');
    const validarEntrada = get.self.context.module('modules/validador');

    const errors = validarEntrada(body);
    if (errors) return res.status(400).send(errors);

    try {
        const ret = await service.incluirFuncionario(body);
        res.status(201).send({ data: ret });
    } catch (error) {
        let err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        res.status(error.statusCode || 500).send(err);
    }

};