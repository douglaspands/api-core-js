/**
 * @file Service Funcionarios
 * @author @douglaspands
 * @since 2017-11-23
 * @version 1.4.0
 */
'use strict';

module.exports = ({ get }) => {

    const crud = get.self.context.module('utils/db-crud');

    /**
     * Obter funcionario pelo ID.
     * @param {string} id id do funcionario.
     * @return {Promise.<object>} funcionario.
     */
    const obterFuncionario = async (id) => {
        let ret = await crud.find('funcionarios', id, 3600);
        if (ret && ret['_id']) ret['_id'] = ret['_id'].toString();
        return ret;
    }

    /**
     * Obter lista de funcionarios.
     * @param {object} query pesquisa
     * @return {Promise.<array>} funcionario.
     */
    const pesquisarFuncionarios = async (query) => {
        let ret = await crud.scan('funcionarios', query, 600);
        return (ret || []).map(o => {
            if (o['_id']) o['_id'] = o['_id'].toString();
            return o;
        }, []);
    }

    /**
     * Incluir funcionario.
     * @param {objet} funcionario
     * @return {Promise.<object>} funcionario.
     */
    const incluirFuncionario = async (funcionario) => {
        let ret = await crud.insert('funcionarios', funcionario, 3600);
        if (ret && ret['_id']) ret['_id'] = ret['_id'].toString();
        return ret;
    }

    /**
     * Atualizar funcionario.
     * @param {string} id
     * @param {object} funcionario
     * @return {Promise.<object>} funcionario.
     */
    const atualizarFuncionario = async (id, funcionario) => {
        let ret = await crud.update('funcionarios', id, funcionario, 3600);
        if (ret && ret['_id']) ret['_id'] = ret['_id'].toString();
        return ret;
    }

    /**
     * Remover funcionario.
     * @param {string} id id do funcionario.
     * @return {Promise.<string>} funcionario.
     */
    const removerFuncionario = async (id) => {
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