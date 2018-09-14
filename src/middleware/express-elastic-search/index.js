/**
 * @file Conexão com o Elastic
 * @author douglaspands
 * @since 2018-09-12
 */
'use strict';
const elasticsearch = require('elasticsearch');
const source = (__dirname).split('/').pop();
const { uri } = require('./config');
const ELASTIC_URL = [
    `${(process.env.ELASTIC_URL || uri)}:9200`,
    `${(process.env.ELASTIC_URL || uri)}:9300`
];

/**
 * Obter conexão com o Elastic
 * @param {function} app Servidor Express.
 * @return {Promise.<object>} Retorna a conexão do Elastic. 
 */
const connect = app => {
    const logger = app.get('logger');
    return new Promise((resolve, reject) => {
        const client = new elasticsearch.Client({
            hosts: ELASTIC_URL,
            keepAlive: false,
            sniffOnStart: true,
            sniffInterval: 60000,
            log: (process.env.NODE_ENV !== 'production')? 'trace': undefined
        });
        client.url = ELASTIC_URL;
        app.set('es', client)
        logger.log({
            level: 'info',
            source: source,
            message: `Elastic Search ativado com sucesso na url: ${ELASTIC_URL.join(',')}`
        });
        resolve(client);
    });
}

module.exports = connect;