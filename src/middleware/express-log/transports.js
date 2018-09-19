/**
 * @file Transports para uso no Winston
 * @author douglaspands
 * @since 2017-12-07
 */
'use strict';
const pack = require('../../package.json');
const winston = require('winston');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const formatDate = 'YYYY-MM-DD HH.mm.ss.SSS';
const BOOT_ID = require('uuid/v4')();

/**
 * Customização dos transports do moduloe winstonjs 
 * @param {object} winston Modulo winstonjs 
 * @param {object} app Modulo expressjs
 * @return {object} Retorna funções que representam transports customizados.
 */
module.exports = (app) => {

    const { transports, format } = winston;
    const { combine, timestamp, colorize, label, printf } = format;
    const LEVEL = (process.env.LOG_LEVEL || 'silly');

    /**
     * Customização da geração de log pelo console
     * @return {object} Objeto de transport do Winston. 
     */
    const customConsole = () => {

        return new transports.Console({
            level: LEVEL,
            format: combine(
                colorize(),
                label({ label: 'server' }),
                timestamp(),
                printf(info => {
                    if (info.request || _.get(info, 'message.request', null)) {
                        const requestLog = _.get(info, 'message.request', info.request);
                        const sourceLog = (_.get(info, 'message.source', info.source) || info.label);
                        return `[${info.level}] ${moment().format(formatDate)} ${sourceLog} :\n${JSON.stringify(requestLog, null, 4)}`;
                    } else {
                        return `[${info.level}] ${moment().format(formatDate)} ${(info.source || info.label)} - ${info.message}`;
                    }
                })
            )
        });

    }

    /**
     * Customização da geração de log pelo arquivo
     * @return {object} Objeto de transport do Winston. 
     */
    const customFile = () => {

        const root = app.get('root');
        const logFolder = path.join(root, 'logs');

        if (!fs.existsSync(logFolder) || !fs.lstatSync(logFolder).isDirectory()) {
            fs.mkdirSync(logFolder);
        }

        return new transports.File({
            level: LEVEL,
            options: { flags: 'a+', encoding: 'utf8' },
            maxsize: 10240,
            maxFiles: 10,
            filename: path.join(logFolder, `${pack.name}_v${pack.version}_.log`),
            format: combine(
                label({ label: 'server' }),
                timestamp(),
                printf(info => {
                    const requestLog = (_.get(info, 'message.request', info.request) || info.message);
                    const sourceLog = (_.get(info, 'message.source', info.source) || info.label);
                    const data = {
                        source: sourceLog,
                        'correlation-id': (app.get('id') || BOOT_ID),
                        level: info.level,
                        timestamp: moment().format(formatDate),
                        message: requestLog
                    };
                    return JSON.stringify(data);
                })
            )
        });

    }

    /**
      * Customização da geração de log para o Elastic Search
      * @return {object} Objeto de transport do Winston. 
      */
    const customElasticSearch = () => {

        const Elasticsearch = require('winston-elasticsearch');

        return new Elasticsearch({
            level: LEVEL,
            indexPrefix: 'apicore-logs',
            client: app.get('es')
        });
    }

    return {
        customConsole,
        customFile,
        customElasticSearch
    }

}
