/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
const HttpStatus = require('http-status-codes');
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @returns {void} 
 */
module.exports.controller = async ({ headers, params, query }, res, next, { get, logger }) => {

    const _ = get.module('lodash');
    logger.debug('Inicio da rota REST GET /v1/funcionarios');

    const service = get.self.context.module('services/funcionarios-service');
    const validarEntrada = get.self.context.module('modules/validador');
    const fields = get.self.module('utils/rest-fields');
    
    // Lista de campos que serão mostrados no resultado
    const filterFields = (() => {
        const fieldsList = (query['fields']) ? query['fields'] : '';
        delete query.fields;
        return fieldsList;
    })();
    
    // Validar parametros de entrada
    const errors = validarEntrada({ _id: params._id });
    if (errors) return res.status(HttpStatus.BAD_REQUEST).send(errors);

    try {
        // Executar service
        const ret = await service.obterFuncionario(params._id);
        if (_.isEmpty(ret)) {
            return res.status(HttpStatus.NOT_FOUND).send();
        } else {
            // Filtrando campos selecionados
            const _ret = (filterFields) ? fields(ret, filterFields) : ret;
            return res.status(HttpStatus.OK).send({ data: _ret });
        }
    } catch (error) {
        const err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        return res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

};
