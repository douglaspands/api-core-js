/**
 * @file Model Funcionarios
 * @author douglaspands
 * @since 2017-11-23
 */
'use strict';

module.exports = ({ getModule }) => {

    const crud = getModule('utils/mongodb-crud', true);

    /**
     * Obter funcionario pelo ID.
     * @param {string} id id do funcionario.
     * @return {object} funcionario.
     */
    async function obterFuncionario(id) {

        return await crud.find('funcionarios', id);

    }

    /**
     * Obter lista de funcionarios.
     * @param {object} query pesquisa
     * @return {array} funcionario.
     */
    async function pesquisarFuncionarios(query) {

        return await crud.scan('funcionarios', query);

    }

    /**
     * Incluir funcionario.
     * @param {objet} funcionario
     * @return {object} funcionario.
     */
    async function incluirFuncionario(funcionario) {

        return await crud.insert('funcionarios', funcionario);

    }

    /**
     * Atualizar funcionario.
     * @param {string} id
     * @param {object} funcionario
     * @return {object} funcionario.
     */
    async function atualizarFuncionario(id, funcionario) {

        return await crud.update('funcionarios', id, funcionario);

    }

    /**
     * Remover funcionario.
     * @param {string} id id do funcionario.
     * @return {object} funcionario.
     */
    async function removerFuncionario(id) {

        return await crud.remove('funcionarios', id);

    }

    return {
        pesquisarFuncionarios,
        obterFuncionario,
        incluirFuncionario,
        atualizarFuncionario,
        removerFuncionario
    }

}