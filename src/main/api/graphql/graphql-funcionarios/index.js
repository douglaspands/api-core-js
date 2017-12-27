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
module.exports = ({ getModule }) => {

    const modelFuncionario = getModule('models/funcionario', true);
    const validarEntrada = getModule('modules/form', true);

    /**
     * Obter funcionario atraves do id
     * @param {string} id 
     * @return {object} funcionario
     */
    async function obterFuncionario({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelFuncionario.obterFuncionario(_id));
        return ret;

    }

    /**
     * Incluir funcionario
     * @param {object} input funcionario que será cadastrado.
     * @return {object} funcionario criado 
     */
    async function criarFuncionario({ input }) {

        validarEntrada(input);

        const ret = (await modelFuncionario.incluirFuncionario(input));
        return ret;

    }

    /**
     * Obter lista de funcionarios
     * @return {array} lista de funcionarios
     */
    async function listarFuncionarios() {

        const ret = (await modelFuncionario.pesquisarFuncionarios({}));
        return ret;

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
        const ret = (await modelFuncionario.atualizarFuncionario(_id, body));
        return ret;

    }

    /**
     * Remover funcionario
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerFuncionario({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelFuncionario.removerFuncionario(_id));
        return ret;

    }

    /**
     * Pesquisar funcionarios
     * @param {object} pesquisa 
     * @return {array} lista de funcionarios
     */
    async function pesquisarFuncionarios(pesquisa) {

        validarEntrada(pesquisa);

        const ret = (await modelFuncionario.pesquisarFuncionarios(pesquisa));
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