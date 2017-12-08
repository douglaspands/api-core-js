/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');

// Node do modulo
const nomeModulo = 'mongodb-connect';

// URI do MongoDB
const URI = 'mongodb://localhost:27017';
const db = 'core-api-js';

/**
 * Obter conexão com o MongoDB
 * @param {function} app Servidor Express.
 * @return {Promise} Retorna uma promessa resolve. 
 */
module.exports = (app) => {

    const logger = app.get('logger');

    return new Promise(resolve => {

        MongoClient.connect(URI, (err, client) => {
            if (err) {
                logger.log({
                    level: 'error',
                    source: nomeModulo,
                    message: err
                });
            } else {
                app.set('mongodb', client.db(db));
                logger.log({
                    level: 'info',
                    source: nomeModulo,
                    message: 'MongoDB ativado com sucesso!'
                });
            }
            return resolve();
        });

    });
};
