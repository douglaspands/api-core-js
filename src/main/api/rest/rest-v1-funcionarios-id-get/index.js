/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/** 
 * Configuracoes da rota
 * @returns {object} Retorna os campos:
 * controller: tipo de api (rest|graphql)
 * method: verbo http que esta sendo executado
 * uri: rota 
 * graphql: nome do arquivo .gql
 */
module.exports.route = () => {
    return {
        controller: 'rest',
        method: 'get',
        uri: '/v1/funcionarios/:id'
    }
};
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ params, query }, res, next, { getModule, getServer }) => {

    const _ = require('lodash');
    const logger = getServer('logger');

    logger.debug('Inicio da rota REST GET /v1/funcionarios');

    const service = getModule('services/funcionario-service', true);
    const validarEntrada = getModule('modules/form', true);
    const fields = getModule('utils/fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    const errors = validarEntrada({ _id: params.id });
    if (errors) return res.status(400).send(errors);

    const cache = getServer('cache');
    const cacheId = `/v1/funcionarios/${params.id}-get`;
    try {
        let ret = await cache.getJson(cacheId);
        if (!ret) ret = await service.obterFuncionario(params.id);
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            const _ret = (queryFields)? fields(ret, queryFields) : ret;
            res.status(200).send({ data: cache.set(cacheId, _ret) });
        }
    } catch (error) {
        let err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        res.status(500).send(err);
    }

};