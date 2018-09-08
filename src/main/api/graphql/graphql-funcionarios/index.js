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
    const validarEntradaInclusao = getModule('modules/form-insert', true);
    const cache = getServer('cache');

    /**
     * Obter funcionario atraves do id
     * @param {string} id 
     * @return {object} funcionario
     */
    async function obterFuncionario({ _id }) {

        validarEntrada({ _id });

        const cacheId = `obterFuncionario(${_id})`;
        let ret = await cache.getJson(cacheId);
        if (!ret) ret = await service.obterFuncionario(_id);
        return (ret)? cache.set(cacheId, ret): ret;

    }

    /**
     * Incluir funcionario
     * @param {object} input funcionario que será cadastrado.
     * @return {object} funcionario criado 
     */
    async function criarFuncionario({ input }) {

        validarEntradaInclusao(input);

        const ret = await service.incluirFuncionario(input);

        const cacheId = `obterFuncionario(${ret['_id']})`;
        return cache.set(cacheId, ret);

    }

    /**
     * Obter lista de funcionarios
     * @return {array} lista de funcionarios
     */
    async function listarFuncionarios() {

        return await service.pesquisarFuncionarios({});

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
        await service.atualizarFuncionario(_id, body);

        const ret = await service.obterFuncionario(_id);
        const cacheId = `obterFuncionario(${_id})`;
        return (ret)? cache.set(cacheId, ret) : ret;

    }

    /**
     * Remover funcionario
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerFuncionario({ _id }) {

        validarEntrada({ _id });

        const ret = await service.removerFuncionario(_id);
        cache.del(`obterFuncionario(${_id})`);
        return ret;

    }

    /**
     * Pesquisar funcionarios
     * @param {object} pesquisa 
     * @return {array} lista de funcionarios
     */
    async function pesquisarFuncionarios(pesquisa) {

        validarEntrada(pesquisa);

        ret = await service.pesquisarFuncionarios(pesquisa);
        return ret;

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