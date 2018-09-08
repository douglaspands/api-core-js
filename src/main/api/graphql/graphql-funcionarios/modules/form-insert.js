/**
 * @file Modulo para validar os parametros de entrada na inclusão de funcionario.
 * @author douglaspands
 * @since 2018-09-06
 */
'use strict';

module.exports = ({ getModule }) => {

    const validator = getModule('utils/validator');

    /**
     * Função para validar objeto de entrada.
     * @param {object} funcionario Objeto que será inspecionado
     * @return {void} 
     */
    function validar(funcionario) {

        const { checkField, checkReportForGraphQL } = validator(funcionario);        

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

        checkReportForGraphQL();

    }

    return validar;

}