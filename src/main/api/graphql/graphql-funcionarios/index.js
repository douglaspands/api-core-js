/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 * @version 1.1.20180917
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
 * Root do servidor GraphQL 
 * @param {object} context
 * @returns {object} 
 * - root
 * - route
 */
const root = ({ get }) => {

    const service = get.self.context.module('services/funcionarios-service');
    const validarEntrada = get.self.context.module('modules/validador-opcional');
    const validarEntradaInclusao = get.self.context.module('modules/validador-insert');
    const validarEntradaAtualizacao = get.self.context.module('modules/validador-update');

    /**
     * Obter funcionario atraves do id
     * @param {object} parent contem o resultado de um resolve anterior.
     * @param {object} args argumentos passado, no caso "funcionario".
     * @param {object} context contem objetos compartilhados.
     * @param {object} info contem informações da execução. 
     * @return {Promise.<object>} recurso funcionario
     */
    async function obterFuncionario(root, args, context, info) {

        validarEntrada({ _id: args._id });
        return await service.obterFuncionario(args._id);
    }

    /**
     * Incluir funcionario
     * @param {object} parent contem o resultado de um resolve anterior.
     * @param {object} args argumentos passado, no caso "funcionario".
     * @param {object} context contem objetos compartilhados.
     * @param {object} info contem informações da execução.     
     * @return {Promise.<object>} funcionario criado 
     */
    async function criarFuncionario(root, args, context, info) {

        validarEntradaInclusao(args);
        return await service.incluirFuncionario(args);

    }

    /**
     * Atualizar funcionario
     * @param {object} parent contem o resultado de um resolve anterior.
     * @param {object} args argumentos passado, no caso "funcionario".
     * @param {object} context contem objetos compartilhados.
     * @param {object} info contem informações da execução.
     * @return {Promise.<object>} recurso funcionario atualizado 
     */
    async function atualizarFuncionario(root, args, context, info) {

        validarEntradaAtualizacao(args);
        return await service.atualizarFuncionario(args._id, args);

    }

    /**
     * Remover funcionario
     * @param {object} parent contem o resultado de um resolve anterior.
     * @param {object} args argumentos passado, no caso "funcionario".
     * @param {object} context contem objetos compartilhados.
     * @param {object} info contem informações da execução.
     * @return {Promise.<string>} status 
     */
    async function removerFuncionario(root, args, context, info) {

        validarEntrada({ _id: args._id });
        return await service.removerFuncionario(args._id);

    }

    /**
     * Pesquisar funcionarios
     * @param {object} parent contem o resultado de um resolve anterior.
     * @param {object} args argumentos passado, no caso "funcionario".
     * @param {object} context contem objetos compartilhados.
     * @param {object} info contem informações da execução.   
     * @return {Promise.<array>} lista de funcionarios
     */
    async function pesquisarFuncionarios(root, args, context, info) {

        validarEntrada(args);
        return await service.pesquisarFuncionarios(args);

    }

    /**
     * Funções de transformação do resultado
     */
    const transforms = {
        Funcionario: {
            nome_completo: (result) => {
                return `${result.nome} ${result.sobrenome}`;
            }
        }
    }

    return {
        Query: {
            obterFuncionario,
            pesquisarFuncionarios
        },
        Mutation: {
            criarFuncionario,
            atualizarFuncionario,
            removerFuncionario
        },
        ...transforms
    }
}

module.exports = {
    route,
    root
}