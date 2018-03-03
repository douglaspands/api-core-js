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

    const modelFuncionario = getModule('services/funcionario', true);
    const validarEntrada = getModule('modules/form', true);
    const fields = getModule('utils/fields');
    const queryFields = (query['fields']) ? query['fields'] : '';
    delete query.fields;

    const errors = validarEntrada({ _id: params.id });

    if (errors) return res.status(400).send(errors);

    try {
        const ret = await modelFuncionario.obterFuncionario(params.id);
        const _ret = (queryFields)
            ? fields(ret, queryFields)
            : ret;
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            res.status(200).send({ data: _ret });
        }
    } catch (error) {
        res.status(500).send({
            codigo: 'Erro interno',
            mensagem: error.stack
        });
    }

};