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
module.exports.controller = async ({ params, query }, res, next, { get }) => {

    const _ = require('lodash');
    const logger = get.server('logger');

    logger.debug('Inicio da rota REST GET /v1/funcionarios');

    const service = get.self.context.module('services/funcionario-service');
    const validarEntrada = get.self.context.moduleet('modules/validador');
    const cache = get.self.context.module('utils/cache-crud');

    const fields = get.self.module('utils/fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    const errors = validarEntrada({ _id: params.id });
    if (errors) return res.status(400).send(errors);

    try {
        const ret = await cache
                            .obter(`get_funcionario_${params.id}`)
                            .casoContrarioIncluirResultadoDoMetodo(service.obterFuncionario, params.id)
                            .expirarEm(3600);
        if (_.isEmpty(ret)) {
            res.status(404).send();
        } else {
            const _ret = (queryFields) ? fields(ret, queryFields) : ret;
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