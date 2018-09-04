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
 * controller: tipo de api (rest|graphql)
 * method: verbo http que esta sendo executado
 * uri: rota 
 * graphql: nome do arquivo .gql
 */
const route = () => {
    return {
        controller: 'graphql',
        graphql: 'funcionarios.gql'
    }
};
/**
 *  Root do servidor GraphQL 
 */
const root = ({ getModule, getServer }) => {

    const service = getModule('services/funcionario-service', true);
    const validarEntrada = getModule('modules/form', true);
    const cache = getServer('cache');

    /**
     * Obter funcionario atraves do id
     * @param {string} id 
     * @return {object} funcionario
     */
    async function obterFuncionario({ _id }) {

        validarEntrada({ _id });

        const graphqlCacheId = `obterFuncionario+${_id}`;
        let ret = await cache.get(graphqlCacheId);
        if (ret) {
            return JSON.parse(ret);
        } else {
            ret = await service.obterFuncionario(_id);
            cache.set(graphqlCacheId, ret, 600);
            return ret;
        }
    }

    /**
     * Incluir funcionario
     * @param {object} input funcionario que será cadastrado.
     * @return {object} funcionario criado 
     */
    async function criarFuncionario({ input }) {

        validarEntrada(input);

        const ret = await service.incluirFuncionario(input);
        return ret;

    }

    /**
     * Obter lista de funcionarios
     * @return {array} lista de funcionarios
     */
    async function listarFuncionarios() {

        const graphqlCacheId = `listarFuncionarios`;
        let ret = await cache.get(graphqlCacheId);
        if (ret) {
            return JSON.parse(ret);
        } else {
            ret = await service.pesquisarFuncionarios({});
            cache.set(graphqlCacheId, ret, 60);
            return ret;
        }

    }

    /**
     * Atualizar funcionario
     * @param {string} funcionario Dados do funcionario.
     * @return {string} status 
     */
    async function atualizarFuncionario(funcionario) {

        validarEntrada(funcionario);

        const _id = funcionario._id, body = funcionario;
        delete body._id;
        const ret = await service.atualizarFuncionario(_id, body);
        return ret;

    }

    /**
     * Remover funcionario
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerFuncionario({ _id }) {

        validarEntrada({ _id });

        const ret = await service.removerFuncionario(_id);
        return ret;

    }

    /**
     * Pesquisar funcionarios
     * @param {object} pesquisa 
     * @return {array} lista de funcionarios
     */
    async function pesquisarFuncionarios(pesquisa) {

        validarEntrada(pesquisa);

        const graphqlCacheId = `pesquisarFuncionarios+${JSON.stringify(pesquisa)}`;
        let ret = cache.get(graphqlCacheId);
        if (ret) {
            return JSON.parse(ret);
        } else {
            ret = await service.pesquisarFuncionarios(pesquisa);
            cache.set(graphqlCacheId, ret, 600);
            return ret;
        }
    }

    return {
        obterFuncionario,
        criarFuncionario,
        listarFuncionarios,
        atualizarFuncionario,
        removerFuncionario,
        pesquisarFuncionarios
    }
}

module.exports = {
    route,
    root
}