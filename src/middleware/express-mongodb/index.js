/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');
const source = (__dirname).split('/').pop();
const { uri, database } = require('./config');
const URL_MONGO = `mongodb://${(process.env.MONGO_URL || uri)}`;

/**
 * Obter conexão com o MongoDB
 * @param {function} app Servidor Express.
 * @return {Promise.<object>} Retorna a conexão do MongoDB. 
 */
const mongoConnect = async app => {
    const logger = app.get('logger');
    let db = null;
    try {
        const client = await MongoClient.connect(URL_MONGO, { useNewUrlParser: true });
        db = client.db(database);
        db.url = URL_MONGO;
        app.set('mongodb', db);
        logger.log({
            level: 'info',
            source: source,
            message: `MongoDB ativado com sucesso na url: ${URL_MONGO}`
        });
    } catch (error) {
        logger.log({
            level: 'error',
            source: source,
            message: error
        });
    }
    return db;
}

module.exports = mongoConnect;