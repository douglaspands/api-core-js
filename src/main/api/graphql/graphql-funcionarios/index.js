/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/**
 * Construtor da função.
 * @param {object} context Objeto de contexto da API
 * @return {object.<function>} 
 * - obterFuncionario : Obter funcionario através do ID
 * - criarFuncionario: Criar o funcionario
 * - listarFuncionarios: Listar funcionarios
 * - atualizarFuncionario: Atualizar funcionario
 * - removerFuncionario: Remover funcionarios
 * - pesquisarFuncionarios: Pesquisar funcionario atraves de qualquer parametro do recurso 
 */
/** 
 * Configuracoes da rota
 * @returns {object} Retorna os campos:
 * controller: tipo de api (rest:graphql)
 * method: verbo http que esta sendo executado
 * uri: rota 
 * graphql: nome do arquivo .gql
 */
const route = () => {
    return {
        controller: 'graphql',
        graphql: 'funcionario.graphql'
    }
};
/**
 *  Root do servidor GraphQL 
 */
const root = ({ get }) => {

    const service = get.self.context.module('services/funcionario-service');
    const validarEntrada = get.self.context.module('modules/validador-opcional');
    const validarEntradaInclusao = get.self.context.module('modules/validador-insert');
    const validarEntradaAtualizacao = get.self.context.module('modules/validador-update');
    const cache = get.self.context.module('utils/cache-crud');

    /**
     * Obter funcionario atraves do id
     * @param {object} body Objeto com _id (unico campo usado)
     * @param {*} req Objeto do framework express.js
     * @return {object} funcionario
     */
    async function obterFuncionario(body, req) {

        const { _id } = body;
        const { headers } = req; 

        validarEntrada({ _id });
        return await cache
                        .get(`api:funcionarios:${_id}`)
                        .resetCache((headers['x-cache-reset'] === 'true')? true: false)
                        .orElseSetResultOfMethod(service.obterFuncionario, _id)
                        .expireOn(3600);
    }

    /**
     * Incluir funcionario
     * @param {object} body funcionario que será cadastrado.
     * @return {object} funcionario criado 
     */
    async function criarFuncionario(body, req) {

        const { input } = body;

        validarEntradaInclusao(input);
        return await cache
                        .set(`api:funcionarios:{{_id}}`)
                        .withResultOfMethod(service.incluirFuncionario, input)
                        .expireOn(3600);

    }

    /**
     * Atualizar funcionario
     * @param {string} body Dados do funcionario.
     * @param {*} req Objeto do framework express.js
     * @return {string} status 
     */
    async function atualizarFuncionario(body, req) {

        validarEntradaAtualizacao(body);

        const _id = body._id;
        delete body._id;
        return await cache
                        .set(`api:funcionarios:${_id}`)
                        .withResultOfMethod(service.atualizarFuncionario, [ _id, body ])
                        .expireOn(3600);

    }

    /**
     * Remover funcionario
     * @param {string} body Dados do funcionario.
     * @param {*} req Objeto do framework express.js
     * @return {object} status 
     */
    async function removerFuncionario(body, req) {

        const { _id } = body;

        validarEntrada({ _id });
        return await cache
                        .remove(`api:funcionarios:${_id}`)
                        .afterMethod(service.removerFuncionario, _id);

    }

    /**
     * Pesquisar funcionarios
     * @param {string} body Dados do funcionario.
     * @param {*} req Objeto do framework express.js
     * @return {array} lista de funcionarios
     */
    async function pesquisarFuncionarios(body, req) {

        const { headers } = req;

        validarEntrada(body);
        return await cache
                        .get(`api:funcionarios:search:${JSON.stringify(body)}`)
                        .resetCache((headers['x-cache-reset'] === 'true')? true: false)
                        .orElseSetResultOfMethod(service.pesquisarFuncionarios, body)
                        .expireOn(600);

    }

    return {
        obterFuncionario,
        criarFuncionario,
        atualizarFuncionario,
        removerFuncionario,
        pesquisarFuncionarios
    }
}

module.exports = {
    route,
    root
}