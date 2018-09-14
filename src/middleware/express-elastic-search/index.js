/**
 * @file Conexão com o Elastic
 * @author douglaspands
 * @since 2018-09-12
 */
'use strict';
const elasticsearch = require('elasticsearch');
const source = (__dirname).split('/').pop();
const { uri } = require('./config');
const ELASTIC_URL = (process.env.ELASTIC_URL || uri);

/**
 * Obter conexão com o Elastic
 * @param {function} app Servidor Express.
 * @return {Promise.<object>} Retorna a conexão do Elastic. 
 */
const connect = app => {
    const logger = app.get('logger');
    return new Promise((resolve, reject) => {
        const client = new elasticsearch.Client({
            host: ELASTIC_URL
        });
        client.url = ELASTIC_URL;
        client.ping({
            // ping usually has a 3000ms timeout
            requestTimeout: 1000
        }, (error) => {
            if (error) {
                logger.log({
                    level: 'warn',
                    source: source,
                    message: error
                });
                resolve(null);
            } else {
                app.set('es', client)
                logger.log({
                    level: 'info',
                    source: source,
                    message: `Elastic Search ativado com sucesso na url: ${ELASTIC_URL}`
                });
                resolve(client);
            }
        });
    });
}

module.exports = connect;