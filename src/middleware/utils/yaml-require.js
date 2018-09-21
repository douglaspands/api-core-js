/**
 * @file Transforma o YAML em objeto javascript
 * @author @douglaspands
 * @since 2018-09-21
 * @version 1.0.20180921
 */
'use strict';
const YAML = require('yamljs');
const path = require('path');
const REGEX = new RegExp('(?!\\()([\\w\\-\\/\\.]+)(?=\\:\\d+\\:\\d+\\))', 'g');
/**
 * Utilitario que faz a leitura de arquivos yaml e transforma em objeto javascript
 * @param {string} yamlFile nome do arquivo yaml (Ex.: test.yaml)
 * @returns {object}
 */
module.exports = (yamlFile) => {
    let json = undefined;
    try {
        const stack = (new Error()).stack.toString();
        const callerfile = stack.match(REGEX)[1];
        json = YAML.load(path.join(callerfile, '..', yamlFile));            
    } catch (error) {}
    return json;
}