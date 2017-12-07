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
 * - obterErro : Obter Erro através do ID
 * - criarErro: Criar o Erro
 * - listarErros: Listar Erros
 * - atualizarErro: Atualizar Erro
 * - removerErro: Remover Erros
 * - pesquisarErros: Pesquisar Erro atraves de qualquer parametro do recurso 
 */
module.exports = ({ getModule }) => {

    const modelErro = getModule('models/Erro', true);
    const validarEntrada = getModule('modules/form', true);

    /**
     * Obter Erro atraves do id
     * @param {string} id 
     * @return {object} Erro
     */
    async function obterErro({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelErro.obterErro(_id));
        return ret;

    }

    /**
     * Incluir Erro
     * @param {object} input Erro que será cadastrado.
     * @return {object} Erro criado 
     */
    async function criarErro({ input }) {

        validarEntrada(input);

        const ret = (await modelErro.incluirErro(input));
        return ret;

    }

    /**
     * Obter lista de Erros
     * @return {array} lista de Erros
     */
    async function listarErros() {

        const ret = (await modelErro.pesquisarErros({}));
        return ret;

    }

    /**
     * Atualizar Erro
     * @param {string} Erro Dados do Erro.
     * @return {string} status 
     */
    async function atualizarErro(Erro) {

        validarEntrada(Erro);

        const _id = Erro._id, body = Erro;
        delete body._id;
        const ret = (await modelErro.atualizarErro(_id, body));
        return ret;

    }

    /**
     * Remover Erro
     * @param {string} _id 
     * @return {object} status 
     */
    async function removerErro({ _id }) {

        validarEntrada({ _id });

        const ret = (await modelErro.removerErro(_id));
        return ret;

    }

    /**
     * Pesquisar Erros
     * @param {object} pesquisa 
     * @return {array} lista de Erros
     */
    async function pesquisarErros(pesquisa) {

        validarEntrada(pesquisa);

        const ret = (await modelErro.pesquisarErros(pesquisa));
        return ret;

    }

    return {
        obterErro,
        criarErro,
        listarErros,
        atualizarErro,
        removerErro,
        pesquisarErros
    }
}