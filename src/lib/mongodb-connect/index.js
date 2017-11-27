/**
 * @file Conexão com o MongoDB
 * @author douglaspands
 * @since 2017-11-21
 */
'use strict';
const { MongoClient } = require('mongodb');

// URI do MongoDB
const URI = 'mongodb://localhost:27017/core-graphql-js';

/**
 * Obter conexão com o MongoDB
 * @param {function} callback Callback de retorno.
 * @return {void} 
 */
module.exports = (callback) => {

    MongoClient.connect(URI, (err, db) => {

        if (err) {
            console.log(`${err}`);
            callback(err);
        } else {
            callback(null, db);
        }

    });

}