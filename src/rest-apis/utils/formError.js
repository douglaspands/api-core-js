/**
 * @file Class de erro do form.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
/**
 * Classe de erro.
 * @param {string} nomeCampo 
 * @param {string} valor 
 * @param {string} mensagem
 * @return {Erro} Class de erro. 
 */
function Erro(nomeCampo, valor, mensagem) {
    this.field = _.isString(nomeCampo)
        ? nomeCampo
        : '';
    this.value = _.isString(valor)
        ? valor
        : '';
    this.message = _.isString(mensagem)
        ? mensagem
        : '';
}

module.exports = Erro;