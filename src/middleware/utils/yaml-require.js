/**
 * @file Transforma o YAML em objeto javascript
 * @author @douglaspands
 * @since 2018-09-21
 * @version 1.0.20180922
 */
'use strict';
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
/**
 * Utilitario que faz a leitura de arquivos yaml e transforma em objeto javascript
 * @param {string} yamlFile nome do arquivo yaml (Ex.: test.yaml)
 * @returns {object}
 */
module.exports = (yamlFile) => {
    if (typeof yamlFile !== 'string' || yamlFile.length === 0) return undefined;
    let json = null;
    try {
        let yamlFileData = undefined;
        if (yamlFile.substr(0, 1) === '/') {
            yamlFileData = fs.readFileSync(yamlFile, 'utf8');
        } else {
            const callerfile = (utils.getStackList())[2];
            yamlFileData = fs.readFileSync(path.join(callerfile, '..', yamlFile), 'utf8');
        }
        json = yaml.safeLoad(yamlFileData);
    } catch (error) { }
    return json;
}