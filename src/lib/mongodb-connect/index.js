/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');

// URI do MongoDB
const URI = 'mongodb://localhost:27017/core-api-js';

/**
 * Obter conexão com o MongoDB
 * @param {function} logger Objeto de logger do Winston.
 * @return {function} Retorna a função de conexão. 
 */
module.exports = (logger) => {

    function mongoConnect(callback) {

        MongoClient.connect(URI, (err, db) => {

            if (err) {
                if (logger) logger.error(err);
                if (callback) callback(err);
            } else {
                if (logger) logger.info('MongoDB ativado com sucesso!');
                if (callback) callback(null, db);
            }

        });

    }

    return mongoConnect;

}
