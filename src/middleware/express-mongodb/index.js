/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2018-09-21
 * @version 1.2.20180921
 */
'use strict';
const { MongoClient } = require('mongodb');
const source = (__dirname).split('/').pop();
const utils = require('../utils');
const { uri, database } = utils.getYaml('config.yaml');
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
        app.set('mongodb-config', { url: URL_MONGO });
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