/**
 * @file Modulo de apoio para validação de campos de entrada da API.
 * @author @douglaspands
 * @since 2017-11-13
 */
'use strict';
const _ = require('lodash');
const message = require('./message');

/**
 * @typedef {object} ErrorForm Mensagem de erro de campo na validação.
 * @property {string} field Campo validado.
 * @property {string|number} value Valor do campo.
 * @property {string} mensagem Mensagem de erro.
 */
/**
 * Class de erro do formulario.
 * @param {string} nomeCampo Nome do campo.
 * @param {any} valor Valor do campo.
 * @param {string} mensagemErro Mensagem de erro.
 * @return {ErrorForm} 
 */
function ErrorForm(nomeCampo, valor, mensagemErro) {
    this.field = _.isString(nomeCampo)
        ? nomeCampo
        : '';
    this.value = valor;
    this.message = _.isString(mensagem)
        ? mensagem
        : '';
}
/**
 * Modulo de apoio as validações de campos.
 * @param {object} log
 * @return {function} Retorno a função 'check'
 */
function validator() {

    let listaErros = [];

    /**
     * Modulo de checagem de campos.
     * @param {string} nome Nome do campo.
     * @param {any} campo Valor do campo.
     * @param {string} mensagemErro Mensagem de erro.
     * @return {void}
     */
    function check(nome, campo, mensagemErro) {
        if (!_.isString(nome) || !_.isString(mensagemErro)) {
            throw new Error('Campos de \'nome\' e/ou \'mensagem de erro\' estão preenchidos com valor diferente de texto!');
        }
        return {
            isValid(callback) {
                let retorno = (callback(campo) || false);
                if (!retorno) {
                    listaErros.push(new ErrorForm(nome, campo, mensagemErro))
                }
            }
        };
    }
    /**
     * Contem erros.
     * @return {boolean} 'true' se tiver erros.
     */
    function containErrors() {
        return _.size(listaErros) > 0;
    }
    /**
     * Retorna lista de erros.
     * @return {array} Lista de erros.
     */
    function getErrors() {
        return listaErros;
    }
    /**
     * Funções de retorno.
     */
    return {
        check,
        containErrors,
        getErrors
    };
}