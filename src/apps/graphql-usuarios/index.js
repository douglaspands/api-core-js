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
 * - obterUsuario : Obter usuario através do ID
 * - criarUsuario: Criar o usuario
 * - listarUsuarios: Listar usuarios
 * - atualizarUsuario: Atualizar usuario
 * - removerUsuario: Remover usuarios
 * - pesquisarUsuarios: Pesquisar usuario atraves de qualquer parametro do recurso 
 */
module.exports = ({ getModule }) => {

    const modelUsuario = getModule('models/usuario', true);
    const validarEntrada = getModule('modules/form', true);

    /**
     * Obter usuario atraves do id
     * @param {string} id 
     * @return {object} usuario
     */
    async function obterUsuario({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelUsuario.obterUsuario(_id));
        return ret;

    }

    /**
     * Incluir usuario
     * @param {object} input usuario que será cadastrado.
     * @return {object} usuario criado 
     */
    async function criarUsuario({ input }) {

        validarEntrada(input);

        const ret = (await modelUsuario.incluirUsuario(input));
        return ret;

    }

    /**
     * Obter lista de usuarios
     * @return {array} lista de usuarios
     */
    async function listarUsuarios() {

        const ret = (await modelUsuario.pesquisarUsuarios({}));
        return ret;

    }

    /**
     * Atualizar usuario
     * @param {string} usuario Dados do usuario.
     * @return {string} status da atualização. 
     */
    async function atualizarUsuario(usuario) {

        validarEntrada(usuario);

        const _id = usuario._id, body = usuario;
        delete body._id;
        const ret = (await modelUsuario.atualizarUsuario(_id, body));
        return ret;

    }

    /**
     * Remover usuario
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerUsuario({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelUsuario.removerUsuario(_id));
        return ret;

    }

    /**
     * Pesquisar usuarios
     * @param {object} pesquisa 
     * @return {array} usuario criado 
     */
    async function pesquisarUsuarios(pesquisa) {

        validarEntrada(pesquisa);

        const ret = (await modelUsuario.pesquisarUsuarios(pesquisa));
        return ret;

    }

    return {
        obterUsuario,
        criarUsuario,
        listarUsuarios,
        atualizarUsuario,
        removerUsuario,
        pesquisarUsuarios
    }
}