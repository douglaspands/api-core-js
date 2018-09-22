/**
 * @file Transforma o YAML em objeto javascript
 * @author @douglaspands
 * @since 2018-09-21
 * @version 1.0.20180922
 */
'use strict';
const YAML = require('yamljs');
const path = require('path');
const utils = require('../utils');
/**
 * Utilitario que faz a leitura de arquivos yaml e transforma em objeto javascript
 * @param {string} yamlFile nome do arquivo yaml (Ex.: test.yaml)
 * @returns {object}
 */
module.exports = (yamlFile) => {
    if (typeof yamlFile !== 'string' || yamlFile.length === 0) return undefined;
    let json = undefined;
    try {
        const callerfile = (utils.getStackList())[2];
        json = YAML.load(path.join(callerfile, '..', yamlFile));
    } catch (error) { }
    return json;
}