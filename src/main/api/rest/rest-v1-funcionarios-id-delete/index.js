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
        method: 'delete',
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
module.exports.controller = async ({ params }, res, next, { getModule, getServer }) => {

    const service = getModule('services/funcionario-service', true);
    const validarEntrada = getModule('modules/form', true);

    const errors = validarEntrada({ _id: params.id });
    if (errors) return res.status(400).send(errors);

    const cache = getServer('cache');
    const cacheId = `/v1/funcionarios/${params.id}-get`;
    try {
        const ret = await service.removerFuncionario(params.id);
        cache.del(cacheId);
        res.status(200).send({ data: ret });
    } catch (error) {
        res.status(204).send({});
    }

};