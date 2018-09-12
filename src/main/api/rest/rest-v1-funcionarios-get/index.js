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
        uri: '/v1/funcionarios'
    }
};
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ headers, query }, res, next, { get }) => {

    const _ = get.module('lodash');
    const service = get.self.context.module('services/funcionario-service', true);
    const cache = get.self.context.module('utils/cache-crud', true);

    const fields = get.self.module('utils/fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    try {
        const ret = await cache
                            .get(`api:funcionarios|${JSON.stringify(pesquisa)}`)
                            .resetCache((headers['x-cache-reset'] === 'true')? true: false)
                            .orElseSetResultOfMethod(service.pesquisarFuncionarios, query)
                            .expireOn(600);        
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            const _ret = (queryFields && _.isArray(ret)) ? _.map(ret, o => fields(o, queryFields)) : ret;            
            res.status(200).send({ data: _ret });
        }
    } catch (error) {
        let err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        res.status(500).send(err);
    }

};
