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
 * Cache
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.cache = async ({ method, originalUrl, query }, res, next, { getServer }) => {
    const cache = getServer('cache');
    const result = await cache.get(`${method}_${originalUrl}`);
    if (result) {
        res.set('X-Cache', true);
        res.status(200).send({ data: JSON.parse(result) });
    } else {
        next();
    }
};
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ method, originalUrl, query }, res, next, { getModule, getServer }) => {
    const _ = require('lodash');
    const service = getModule('services/funcionario-service', true);
    const fields = getModule('utils/fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    try {
        const ret = await service.pesquisarFuncionarios(query);
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            const _ret = (queryFields && _.isArray(ret)) ? _.map(ret, o => fields(o, queryFields)) : ret;
            
            // Inclusão no cache
            const cache = getServer('cache');
            cache.set(`${method}_${originalUrl}`, JSON.stringify(_ret), 60);
            
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
