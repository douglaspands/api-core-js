/**
 * @file Modulo para validar os parametros de entrada.
 * @author douglaspands
 * @author Victor Tripeno
 * @since 2017-11-23
 */
'use strict';

module.exports = ({ get }) => {

    const validator = get.self.module('utils/validator');

    /**
     * Função para validar objeto de entrada.
     * @param {object} funcionario Objeto que será inspecionado
     * @return {void} 
     */
    function validar(funcionario) {

        const { checkField, checkReportForREST } = validator(funcionario);

        checkField('nome', 'Nome invalido')
            .notEmpty();

        checkField('sobrenome', 'Sobrenome invalido')
            .notEmpty();

        checkField('cidade', 'Cidade invalida')
            .notEmpty();

        checkField('estado', 'Estado invalido')
            .isUF();

        checkField('telefone', 'Telefone invalido')
            .isPhoneNumber();

        checkField('email', 'Email invalido')
            .isEmail();

        return checkReportForREST();

    }

    return validar;

}