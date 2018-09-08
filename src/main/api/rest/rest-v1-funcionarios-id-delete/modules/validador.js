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

        checkField('_id', 'ID invalido')
            .isOptional()
            .isMongoId();

        checkField('nome', 'Nome invalido')
            .isOptional()
            .notEmpty();

        checkField('sobrenome', 'Sobrenome invalido')
            .isOptional()
            .notEmpty();

        checkField('cidade', 'Cidade invalida')
            .isOptional()
            .notEmpty();

        checkField('estado', 'Estado invalido')
            .isOptional()
            .isUF();

        checkField('telefone', 'Telefone invalido')
            .isOptional()
            .isPhoneNumber();

        checkField('empresa', 'Empresa invalida')
            .isOptional()
            .notEmpty();

        return checkReportForREST();

    }

    return validar;

}