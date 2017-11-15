/**
 * @file Classe usuario.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
// Modulos
const _ = require('lodash');
const moment = require('moment');
/**
 * Classe Usuario.
 * @param {string} id id do usuario.
 * @param {string} nome Nome completo.
 * @param {number} idade Idade.
 * @param {string} sexo Orientação sexual.
 * @return {Usuario}
 * - masculino
 * - feminino
 */
function Usuario(id, nome, idade, sexo) {
    this.id = (_.isString(id) && _.size(id) > 0)
        ? id
        : moment().format('YYYYMMDDHHmmss');
    this.nome = (_.isString(nome) && _.size(nome) > 0)
        ? nome
        : undefined;
    this.idade = (_.isNumber(idade) && idade > 0)
        ? idade
        : undefined;
    this.sexo = (_.isString(sexo) && _.includes(['MASCULINO', 'FEMININO'], sexo.toUpperCase()))
        ? sexo.toLowerCase()
        : undefined;
}
module.exports = Usuario;