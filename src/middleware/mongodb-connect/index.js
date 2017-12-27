/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');
const { nome_modulo, uri, database } = require('./config');

/**
 * Obter conexão com o MongoDB
 * @param {function} app Servidor Express.
 * @return {Promise} Retorna uma promessa resolve. 
 */
module.exports = async (app) => {
    const logger = app.get('logger');
    try {
        const client = await MongoClient.connect(URI);
        const db = client.db(database);
        app.set('mongodb', db);
        logger.log({
            level: 'info',
            source: nome_modulo,
            message: 'MongoDB ativado com sucesso!'
        });
        return db;
    } catch (error) {
        logger.log({
            level: 'error',
            source: nome_modulo,
            message: error
        });
        return null;
    }
};
