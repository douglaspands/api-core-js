/**
 * @file Arquivo para inclusão de modulos no servidor.
 * @author @douglaspands
 * @since 2017-11-18
 */
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const async = require('async');
const config = require('../config/server');

module.exports = (server, log) => {

    const logger = log.logger;
    const modulesFolder = path.join(__dirname, '..', config.DIR_MODULOS);
    let modulesFind = [];

    /**
     * Inclusão de modulos externos.
     * @param {function} done Callback de conclusão.
     * @return {void} 
     */
    function setModule(done) {

        let execucoes = {};

        let modulos = _.forEach(fs.readdirSync(modulesFolder), (mod) => {
            let file = path.join(modulesFolder, mod);
            if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
                execucoes[mod] = require(file)(server, logger);
            }
        });

        async.parallel(execucoes, (err, result) => {
            modulesFind = _.map(Object.keys(result), (mod) => {
                return {
                    module: mod,
                    load: result[mod]
                };
            }, []);
            if (!_.isEmpty(modulesFind)) logger.info('Modulos encontrados', modulesFind);
            done();
        });

    }

    return setModule;

}

