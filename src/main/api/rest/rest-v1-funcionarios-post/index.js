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
        method: 'post',
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
module.exports.controller = async ({ body }, res, next, { getModule, getServer }) => {

    const service = getModule('services/funcionario-service', true);
    const validarEntrada = getModule('modules/form', true);

    const errors = validarEntrada(body);
    if (errors) return res.status(400).send(errors);

    const cache = getServer('cache');
    try {
        const ret = await service.incluirFuncionario(body);
        res.status(201).send({ data: cache.set(`/v1/funcionarios/${ret['_id']}-get`, ret) });
    } catch (error) {
        let err = (error.constructor.name === 'TypeError') ? {
            code: error.message,
            message: (error.stack).toString().split('\n')
        } : error;
        res.status(500).send(err);
    }

};