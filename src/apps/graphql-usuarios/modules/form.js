/**
 * @file Modulo para validar os parametros de entrada.
 * @author douglaspands
 * @author Victor Tripeno
 * @since 2017-11-23
 */
'use strict';

module.exports = ({ getModule }) => {

    const validator = getModule('utils/validator');

    /**
     * Função para validar objeto de entrada.
     * @param {object} funcionario Objeto que será inspecionado
     * @return {void} 
     */
    function validar(usuario) {

        const { checkField, checkReportForGraphQL } = validator(usuario);        

        checkField('_id', 'ID invalido')
            .isOptional()
            .isMongoId();

        checkField('nome', 'Nome invalido')
            .isOptional()
            .notEmpty();

        checkField('sobrenome', 'Sobrenome invalido')
            .isOptional()
            .notEmpty();

        checkField('idade', 'Idade invalida')
            .isOptional()
            .isNumber();

        checkField('cidade', 'Cidade invalida')
            .isOptional()
            .notEmpty();

        checkField('estado', 'Estado invalido')
            .isOptional()
            .isUF();

        checkField('telefone', 'Telefone invalido')
            .isOptional()
            .isPhoneNumber();

        checkField('cep', 'CEP invalido')
            .isOptional()
            .isCEP();

        checkReportForGraphQL();

    }

    return validar;

}