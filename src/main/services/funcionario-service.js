/**
 * @file Service Funcionarios
 * @author @douglaspands
 * @since 2017-11-23
 * @version 1.3.0
 */
'use strict';

module.exports = ({ get }) => {

    const crud = get.self.context.module('utils/mongodb-crud');

    /**
     * Obter funcionario pelo ID.
     * @param {string} id id do funcionario.
     * @return {object} funcionario.
     */
    async function obterFuncionario(id) {

        let ret = await crud.find('funcionarios', id);
        if (ret) ret['_id'] = ret['_id'].toString();
        return ret;
    }

    /**
     * Obter lista de funcionarios.
     * @param {object} query pesquisa
     * @return {array} funcionario.
     */
    async function pesquisarFuncionarios(query) {

        let ret = await crud.scan('funcionarios', query);
        return (ret || []).map(o => {
            o['_id'] = o['_id'].toString();
            return o;
        }, []);

    }

    /**
     * Incluir funcionario.
     * @param {objet} funcionario
     * @return {object} funcionario.
     */
    async function incluirFuncionario(funcionario) {

        delete funcionario.id;
        delete funcionario._id;
        let ret = await crud.insert('funcionarios', funcionario);
        ret = (ret.ops) ? ret.ops[0] : ret;
        if (ret['_id']) ret['_id'] = ret['_id'].toString();
        return ret;

    }

    /**
     * Atualizar funcionario.
     * @param {string} id
     * @param {object} funcionario
     * @return {object} funcionario.
     */
    async function atualizarFuncionario(id, funcionario) {

        await crud.update('funcionarios', id, funcionario);
        let ret = await crud.find('funcionarios', id);
        if (ret) ret['_id'] = ret['_id'].toString();
        return ret;

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