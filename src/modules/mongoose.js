/**
 * @file Modulo de utilização do Mongoose.
 * @author @douglaspands
 * @since 2017-11-18
 */
'use strict';
const mongoose = require('mongoose');
const config = require('../config/db');
/**
 * Modulo externo.
 * @param {object} server Objeto do servidor Express.js 
 * @param {object} logger Objeto do modulo Winston.js
 */
module.exports = (server, logger) => {

    const uri = [
        [
            config.MONGODB.uri,
            config.MONGODB.port
        ].join(':'),
        config.MONGODB.owner
    ].join('/');

    const options = {
        useMongoClient: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    };

    /**
     * Executa o modulo de conexão com o banco de dados.
     * @param {function} done Função de conclusão da execução.
     * @return {void}
     */
    function execute(done) {
        try {
            mongoose.connect(uri, options);
            mongoose.connection.on('connected', function () {
                logger.info(`Mongoose default connection connected to "${uri}"`);
            });
            mongoose.connection.on('error', function (err) {
                logger.error(`Mongoose default connection error: ${err}`);
            });
            mongoose.connection.on('disconnected', function () {
                logger.error('Mongoose default connection disconnected');
            });
            mongoose.connection.on('open', function () {
                logger.info('Mongoose default connection is open');
            });
            server.set('mongoose', mongoose);
            done(null, true);
        } catch (error) {
            logger.error(`ERROR: ${error}`);
            done(null, false);
        }
    }

    return execute;

}

