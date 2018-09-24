/**
 * @file Utilitarios comuns para apoio dos middlewares
 * @author @douglaspands
 * @since 2018-09-21
 * @version 1.0.0
 */
'use strict';
module.exports.replaceDoubleBraces = require('./find-replace-string');
module.exports.getYaml = require('./yaml-require');
module.exports.getStackList = require('./stack-list-files');
module.exports.container = require('./Container');
module.exports.promisifyAll = require('./promisify-all');
