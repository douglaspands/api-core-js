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
    return new Promise((resolve) => {
        const configClient = {
            hosts: ELASTIC_URL,
            keepAlive: false,
            sniffOnStart: true,
            sniffInterval: 60000,
            log: (process.env.ELASTICSEARCH_DEBUG === 'true') ? 'trace' : undefined
        }
        const client = new elasticsearch.Client(configClient);
        client.ping({ requestTimeout: 3000 }, error => {
            if (error) {
                logger.log({
                    level: 'warn',
                    source: source,
                    message: `Elastic Search não esta ativo na(s) url(s): ${ELASTIC_URL.join(', ')}`
                });
                resolve(null);
            } else {
                client.url = ELASTIC_URL;
                app.set('es', client);
                app.set('es-config', configClient);
                logger.log({
                    level: 'info',
                    source: source,
                    message: `Elastic Search ativado com sucesso na url: ${ELASTIC_URL.join(',')}`
                });
                resolve(client);
            }
        });
    });
}

module.exports = connect;