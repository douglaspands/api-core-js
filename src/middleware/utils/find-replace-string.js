/**
 * @file Substituir com dupla chaves 
 * @author @douglaspands
 * @since 2018-09-21
 * @version 1.0.20180922
 */
'use strict';
const VAR_GET = '(?!\\{\\{\\s*)(VAR)(?=\\s*\\}\\})';
const VAR_REPLACE = '(\\{\\{\\s*)(VAR)(\\s*\\}\\})';
/**
 * Substituir dupla chaves por variaveis no objeto 
 * @param {string} text
 * Ex.: '{{nome}} {{sobrenome}}'
 * @param {object} obj
 * Ex.: {nome: 'Joao', sobrenome: 'Silva'} 
 * @returns {string} 
 * Ex.: 'Joao Silva'
 */
module.exports = (text, obj) => {
    if (typeof text !== 'string' || typeof obj !== 'object') return '';
    const varGet = new RegExp(VAR_GET.replace('VAR', '[\\w\\.]+'), 'g');
    const list = text.match(varGet);
    return (list || []).reduce((textFinal, prop) => {
        const varReplace = new RegExp(VAR_REPLACE.replace('VAR', prop), 'g');
        textFinal = textFinal.replace(varReplace, (obj[prop] || ''));
        return textFinal;
    }, text);
};
