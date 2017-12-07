/**
 * @file Transports para uso no Winston
 * @author douglaspands
 * @since 2017-12-07
 */
'use strict';
const moment = require('moment');
const formatDate = 'YYYY-MM-DD HH.mm.ss.SSS';

module.exports = (winston) => {

    const { transports, format } = winston;
    const { combine, timestamp, colorize, label, printf } = format;

    /**
     * Customização da geração de log pelo console
     * @return {object} Objeto de transport do Winston. 
     */
    function customConsole() {

        return new transports.Console({
            format: combine(
                colorize(),
                label({ label: 'server' }),
                timestamp(),
                printf(info => {
                    if (info.request) {
                        return `[${info.level}] ${moment().format(formatDate)}\n${JSON.stringify(info.request, null, 4)}`;
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
    function customFile() {

        return new transports.File({
            format: combine(
                colorize(),
                label({ label: 'server' }),
                timestamp(),
                printf(info => `[${info.level}] ${info.timestamp} ${(info.source || info.label)} - ${info.message}`)
            )
        });

    }

    return {
        customConsole,
        customFile
    }

}
