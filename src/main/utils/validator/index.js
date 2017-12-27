/**
 * @file Modulo de validação de campos
 * @author Victor Tripeno
 * @author douglaspands
 * @since 2017-11-23
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
const constant = require('./constants');
const ext = require('./extends');

/**
 * Modulo de verificação do objeto.
 * @param {object} objeto Objeto que será inspecionado.
 * @return {object} Retorna a função "check" para validação do campo.
 */
function inspection(objeto) {

    const listaErros = [];

    /**
     * @typedef {object} InspectFail
     * @property {string} campo 
     * @property {any} valor 
     * @property {string} mensagem 
     */
    function InspectFail(campo, valor, mensagemErro) {
        this.field = campo;
        this.value = valor;
        this.message = mensagemErro;
    }

    /**
     * Função que recebe o campo e a mensagem de erro.
     * @param {string} propriedade Nome da propriedade validada. 
     * @param {string} mensagemErro Mensagem que será exibida em caso de erro. 
     */
    function CheckField(propriedade, mensagemErro) {

        if (!(this instanceof CheckField)) {
            return new CheckField(propriedade, mensagemErro);
        }

        let flgErro = false, flgValidation = true;
        let elemento = _.get(objeto, propriedade);

        /**
         * Função para tornar a validação opcional caso o campo esteja vazio.
         * @return {void}
         */
        this.isOptional = () => {

            if (!elemento) flgValidation = false;
            return this;

        }

        /**
         * Função para verificar se data é valida. 
         * @return {void}
         */
        this.isDateValid = () => {

            if (!flgValidation) return this;

            let ret = moment(elemento).isValid();
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o ID do MongoDB
         * @return {void}
         */
        this.isMongoId = () => {

            if (!flgValidation) return this;

            const regex = new RegExp(constant.REGEX.MONGOID, 'g');
            const ret = regex.test(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar Email
         * @return {void}
         */
        this.isEmail = () => {

            if (!flgValidation) return this;

            const regex = new RegExp(constant.REGEX.EMAIL, 'g');
            const ret = regex.test(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o telefone
         * @return {void}
         */
        this.isPhoneNumber = () => {

            if (!flgValidation) return this;

            const regex = new RegExp(constant.REGEX.PHONE, 'g');
            const ret = regex.test(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o CEP
         * @return {void}
         */
        this.isCEP = () => {

            if (!flgValidation) return this;

            const regex = new RegExp(constant.REGEX.CEP, 'g');
            const ret = regex.test(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar se é booleano.
         * @return {void}
         */
        this.isBoolean = () => {

            if (!flgValidation) return this;

            let ret = _.isBoolean(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar é numero.
         * @return {void}
         */
        this.isNumber = () => {

            if (!flgValidation) return this;

            let ret = _.isNumber(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar se é texto.
         * @return {void}
         */
        this.isString = () => {

            if (!flgValidation) return this;

            let ret = _.isString(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o tamanho.
         * @param {number} min Tamanho minimo
         * @param {number} max Tamanho maximo
         * @return {void}
         */
        this.isLength = (min, max) => {

            if (!flgValidation) return this;

            let _min = (_.isNumber(min)) ? min : 0;
            let _max = (_.isNumber(max)) ? max : _min;

            let ret = (_.size(elemento) >= _min && _.size(elemento) <= _max);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o texto faz parte de uma lista.
         * @param {array} lista 
         * @return {void}
         */
        this.isIn = (lista) => {

            if (!flgValidation) return this;

            let _lista = _.isArray(lista) ? lista : [];
            let ret = _.includes(_lista, elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar o texto não esta vazio.
         * @return {void}
         */
        this.notEmpty = (lista) => {

            if (!flgValidation) return this;

            let ret = !_.isEmpty(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar se o CPF é valido.
         * @return {void}
         */
        this.isCPF = () => {

            if (!flgValidation) return this;

            let ret = ext.validarCPF(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar se o CNPJ é valido.
         * @return {void}
         */
        this.isCNPJ = () => {

            if (!flgValidation) return this;

            let ret = ext.validarCNPJ(elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função para verificar a sigla do estado.
         * @return {void}
         */
        this.isUF = () => {

            if (!flgValidation) return this;

            let _elemento = _.isString(elemento) ? elemento.toUpperCase() : '';
            let ret = _.includes(constant.UF_LIST, _elemento);
            if (!ret && !flgErro) {
                listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                flgErro = true;
            }
            return this;

        }

        /**
         * Função de validação customizada.
         * @param {function} callback Função que retornara true ou false
         * @return {void} 
         */
        this.custom = (callback) => {

            if (!flgValidation) return this;

            if (typeof callback === 'function') {
                let ret = callback(elemento);
                if (!ret && !flgErro) {
                    listaErros.push(new InspectFail(propriedade, elemento, mensagemErro));
                    flgErro = true;
                }
            }
            return this;
        }

    };

    /**
     * Função para emitir evento de erro para o GraphQL.
     * @return {void}
     */
    function checkReportForGraphQL() {
        if (listaErros.length > 0) {
            const { GraphQLError } = require('graphql');
            throw new GraphQLError(listaErros);
        }
    }

    /**
     * Retorna lista de erros.
     * @return {array} lista de erros.
     */
    function getListErrors() {
        return listaErros;
    }

    /**
     * Retorna objeto de erro.
     * @return {object} Retorna objeto de erro.
     */
    function checkReportForREST() {
        if (listaErros.length > 0) {
            return {
                code: 'validation error',
                message: listaErros
            };
        } else {
            return null;
        }
    }

    /**
     * Funções retornadas.
     */
    return {
        checkField: CheckField,
        getListErrors,
        checkReportForGraphQL,
        checkReportForREST
    }
}

module.exports = inspection;
