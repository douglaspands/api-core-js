/**
 * @file Transports para uso no Winston
 * @author douglaspands
 * @since 2017-12-07
 * @version 1.2.20180921
 */
'use strict';
const winston = require('winston');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const BOOT_ID = require('uuid/v4')();

/**
 * Customização dos transports do moduloe winstonjs 
 * @param {object} app Modulo expressjs
 * @return {object} Retorna funções que representam transports customizados.
 */
module.exports = (app, config) => {

    const pack = app.get('package');

    const { transports, format } = winston;
    const { combine, timestamp, colorize, label, printf } = format;

    /**
     * Customização da geração de log pelo console
     * @return {object} Objeto de transport do Winston. 
     */
    const customConsole = () => {

        return new transports.Console({
            level: (process.env.LOG_LEVEL || config.console.level),
            format: combine(
                colorize(),
                label({ label: config.label }),
                timestamp(),
                printf(info => {
                    if (info.request || _.get(info, 'message.request', null)) {
                        const requestLog = _.get(info, 'message.request', info.request);
                        const sourceLog = (_.get(info, 'message.source', info.source) || info.label);
                        return `[${info.level}] ${moment().format(config.format_date)} ${sourceLog} :\n${JSON.stringify(requestLog, null, 4)}`;
                    } else {
                        return `[${info.level}] ${moment().format(config.format_date)} ${(info.source || info.label)} - ${info.message}`;
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
        const logFolder = path.join(root, config.file.folder);
        const utils = require('../utils');

        if (!fs.existsSync(logFolder) || !fs.lstatSync(logFolder).isDirectory()) {
            fs.mkdirSync(logFolder);
        }

        const filename = utils.replaceDoubleBraces(config.file.filename, { name: pack.name, version: pack.version });

        return new transports.File({
            level: (process.env.LOG_LEVEL || config.file.level),
            options: { flags: config.file.flags, encoding: config.file.encoding },
            maxsize: 1024 * 1024 * config.file.max_size, // config.file.max_size = MB 
            maxFiles: config.file.max_files,
            filename: path.join(logFolder, filename),
            format: combine(
                label({ label: config.label }),
                timestamp(),
                printf(info => {
                    const requestLog = (_.get(info, 'message.request', info.request) || info.message);
                    const sourceLog = (_.get(info, 'message.source', info.source) || info.label);
                    const data = {
                        source: sourceLog,
                        'correlation-id': (app.get('id') || BOOT_ID),
                        level: info.level,
                        timestamp: moment().format(config.format_date),
                        message: requestLog
                    };
                    return JSON.stringify(data);
                })
            )
        });

    }

    return {
        customConsole,
        customFile
    }

}
