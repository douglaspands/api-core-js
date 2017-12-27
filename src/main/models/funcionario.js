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

        try {
            let ret = (await crud.find('funcionarios', id));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Obter lista de funcionarios.
     * @param {object} query pesquisa
     * @return {array} funcionario.
     */
    async function pesquisarFuncionarios(query) {

        try {
            let ret = (await crud.scan('funcionarios', query));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Incluir funcionario.
     * @param {objet} funcionario
     * @return {object} funcionario.
     */
    async function incluirFuncionario(funcionario) {

        try {
            let ret = (await crud.insert('funcionarios', funcionario));
            return ret.ops[0];
        } catch (error) {
            return error;
        }

    }

    /**
     * Atualizar funcionario.
     * @param {string} id
     * @param {object} funcionario
     * @return {object} funcionario.
     */
    async function atualizarFuncionario(id, funcionario) {

        try {
            let ret = (await crud.update('funcionarios', id, funcionario));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Remover funcionario.
     * @param {string} id id do funcionario.
     * @return {object} funcionario.
     */
    async function removerFuncionario(id) {

        try {
            const ret = (await crud.remove('funcionarios', id));
            return ret;
        } catch (error) {
            return error;
        }

    }

    return {
        pesquisarFuncionarios,
        obterFuncionario,
        incluirFuncionario,
        atualizarFuncionario,
        removerFuncionario
    }

}