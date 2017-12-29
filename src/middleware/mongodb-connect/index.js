/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');
const { source, uri, database } = require('./config');

/**
 * Obter conexão com o MongoDB
 * @param {function} app Servidor Express.
 * @return {Promise.<object>} Retorna a conexão do MongoDB. 
 */
const mongoConnect = async app => {
    const logger = app.get('logger');
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db(database);
        app.set('mongodb', db);
        logger.log({
            level: 'info',
            source: source,
            message: 'MongoDB ativado com sucesso!'
        });
        return db;
    } catch (error) {
        logger.log({
            level: 'error',
            source: source,
            message: error
        });
        return null;
    }
}

module.exports = mongoConnect;