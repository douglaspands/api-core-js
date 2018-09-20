/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/** 
 * Configuracoes da rota
 * @returns {object} Retorna os campos:
 * controller: tipo de api (rest:graphql)
 * method: verbo http que esta sendo executado
 * uri: rota 
 * graphql: nome do arquivo .gql
 */
module.exports.route = () => {
    return {
        controller: 'rest',
        method: 'get',
        uri: '/v1/funcionarios/:_id'
    }
};
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ headers, params, query }, res, next, { get, logger }) => {

    const _ = get.module('lodash');
    logger.debug('Inicio da rota REST GET /v1/funcionarios');

    const service = get.self.context.module('services/funcionarios-service');
    const validarEntrada = get.self.context.module('modules/validador');

    const fields = get.self.module('utils/rest-fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    const errors = validarEntrada({ _id: params._id });
    if (errors) return res.status(400).send(errors);

    try {
        const ret = await service.obterFuncionario(params._id);
        if (_.isEmpty(ret)) {
            return res.status(404).send();
        } else {
            const _ret = (queryFields) ? fields(ret, queryFields) : ret;
            return res.status(200).send({ data: _ret });
        }
    } catch (error) {
        let err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        return res.status(error.statusCode || 500).send(err);
    }

};