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
const root = ({ get }) => {

    const service = get.self.context.module('services/funcionario-service');
    const validarEntrada = get.self.context.module('modules/validador-opcional');
    const validarEntradaInclusao = get.self.context.module('modules/validador-insert');
    const validarEntradaAtualizacao = get.self.context.module('modules/validador-update');
    const cache = get.self.context.module('utils/cache-crud');

    /**
     * Obter funcionario atraves do id
     * @param {object} input Objeto com _id (unico campo usado)
     * @return {object} funcionario
     */
    async function obterFuncionario({ _id }) {

        validarEntrada({ _id });
        return await cache
                        .obter(`get_funcionario_${_id}`)
                        .casoContrarioIncluirResultadoDoMetodo(service.obterFuncionario, _id)
                        .expirarEm(3600);
    }

    /**
     * Incluir funcionario
     * @param {object} input funcionario que será cadastrado.
     * @return {object} funcionario criado 
     */
    async function criarFuncionario({ input }) {

        validarEntradaInclusao(input);
        return await cache
                        .incluir(`get_funcionario_{{_id}}`)
                        .comResultadoDoMetodo(service.incluirFuncionario, input)
                        .expirarEm(3600);

    }

    /**
     * Atualizar funcionario
     * @param {string} funcionario Dados do funcionario.
     * @return {string} status 
     */
    async function atualizarFuncionario(funcionario) {

        validarEntradaAtualizacao(funcionario);

        const _id = funcionario._id;
        delete funcionario._id;
        return await cache
                        .incluir(`get_funcionario_${_id}`)
                        .comResultadoDoMetodo(service.atualizarFuncionario, [ _id, funcionario ])
                        .expirarEm(3600);

    }

    /**
     * Remover funcionario
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerFuncionario({ _id }) {

        validarEntrada({ _id });
        return await cache
                        .excluir(`get_funcionario_${_id}`)
                        .aposMetodo(service.removerFuncionario, _id);

    }

    /**
     * Pesquisar funcionarios
     * @param {object} pesquisa 
     * @return {array} lista de funcionarios
     */
    async function pesquisarFuncionarios(pesquisa) {

        validarEntrada(pesquisa);
        return await cache
                        .obter(`get_funcionarios_${JSON.stringify(pesquisa)}`)
                        .casoContrarioIncluirResultadoDoMetodo(service.pesquisarFuncionarios, pesquisa)
                        .expirarEm(600);

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