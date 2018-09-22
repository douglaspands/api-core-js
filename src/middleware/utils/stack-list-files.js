/**
 * @file Retorna a lista de arquivos da stack
 * @author @douglaspands
 * @since 2018-09-22
 * @version 1.0.20180922
 */
'use strict';
/**
 * Utilitario que retorna a lista de arquivo da stack de execução
 * @returns {array<string>}
 */
module.exports = () => {
    const stack = (new Error()).stack.toString();
    return stack.match(new RegExp('(?!\\()([\\w\\-\\/\\.]+)(?=\\:\\d+\\:\\d+\\))', 'g'));
}