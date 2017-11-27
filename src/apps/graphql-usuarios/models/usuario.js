/**
 * @file Model Usuarios
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';

module.exports = ({ getModule }) => {

    const crud = getModule('utils/mongodb-crud', true);

    /**
     * Obter usuario pelo ID.
     * @param {string} id id do usuario.
     * @return {object} usuario.
     */
    async function obterUsuario(id) {

        try {
            let ret = (await crud.find('usuarios', id));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Obter lista de usuarios.
     * @param {object} query pesquisa
     * @return {array} usuario.
     */
    async function pesquisarUsuarios(query) {

        try {
            let ret = (await crud.scan('usuarios', query));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Incluir usuario.
     * @param {objet} usuario
     * @return {object} usuario.
     */
    async function incluirUsuario(usuario) {

        try {
            let ret = (await crud.insert('usuarios', usuario));
            return ret.ops[0];
        } catch (error) {
            return error;
        }

    }

    /**
     * Atualizar usuario.
     * @param {string} id
     * @param {object} usuario
     * @return {object} usuario.
     */
    async function atualizarUsuario(id, usuario) {

        try {
            let ret = (await crud.update('usuarios', id, usuario));
            return ret;
        } catch (error) {
            return error;
        }

    }

    /**
     * Remover usuario.
     * @param {string} id id do usuario.
     * @return {object} usuario.
     */
    async function removerUsuario(id) {

        try {
            const ret = (await crud.remove('usuarios', id));
            return ret;
        } catch (error) {
            return error;
        }

    }

    return {
        pesquisarUsuarios,
        obterUsuario,
        incluirUsuario,
        atualizarUsuario,
        removerUsuario
    }

}