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
module.exports.controller = async (req, res, next, { get }) => {

    const _ = get.module('lodash');
    const service = get.self.context.module('services/funcionarios-service');

    const { query } = req;
    const fields = get.self.module('utils/rest-fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    try {
        const ret = await service.pesquisarFuncionarios(query);
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            const _ret = (queryFields && _.isArray(ret)) ? _.map(ret, o => fields(o, queryFields)) : ret;
            res.status(200).send({ data: _ret });
        }
    } catch (error) {
        const err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        res.status(error.statusCode || 500).send(err);
    }

};
