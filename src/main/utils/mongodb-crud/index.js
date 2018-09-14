/**
 * @file CRUD padrão no MongoDB.
 * @author douglaspands
 * @since 2017-11-21
 * @version 1.3.0
 */
'use strict';
const { ObjectID } = require('mongodb');
const source = (__dirname).split('/').pop();

module.exports = ({ get, logger }) => {

    const db = get.server('mongodb');

    /**
     * Vaidar ID.
     * @param {string} id
     * @return {boolean} 'true' o ID é valido. 
     */
    function isValidID(id) {
        return ObjectID.isValid(id);
    }

    /**
     * Consultar no MongoDB
     * @param {string} collection tabela
     * @param {object} key pesquisa
     * @return {Promise.<array>} retorna lista de recursos pesquisado
     */
    function scan(collection, key) {

        //const query = ((key && typeof key === 'object') ? key : {});
        const query = {};

        return new Promise((resolve, reject) => {

            if (!db) {
                const message = 'Sem conexão com o MongoDB';
                logger.error({
                    source: source,
                    message: message
                });
                reject(message);
            }

            (Object.keys(((key && typeof key === 'object') ? key : {}))).forEach(prop => {
                if (prop === '_id') {
                    if (isValidID(key['_id'])) {
                        query['_id'] = ObjectID(key['_id']);
                    }
                } else {
                    query[prop] = new RegExp(key[prop], 'gi');
                }
            });
        
            try {
                db.collection(collection)
                    .find(query)
                    .toArray()
                    .then(data => resolve(data))
                    .catch(err => {
                        logger.error({
                            source: source,
                            message: err
                        });
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }

        });

    };

    /**
     * Consultar no MongoDB (pelo ID)
     * @param {string} collection tabela
     * @param {string} _id id
     * @return {Promise.<array>} retorna lista de recursos pesquisado
     */
    function find(collection, _id) {

        const query = {};

        return new Promise((resolve, reject) => {

            if (!db) {
                const message = 'Sem conexão com o MongoDB';
                logger.error({
                    source: source,
                    message: message
                });
                reject(message);
            }

            if (isValidID(_id)) {
                query['_id'] = ObjectID(_id);
            } else {
                logger.error({
                    source: source,
                    message: '[find] Campo _id invalido!'
                });
                reject({});
            }

            try {
                db.collection(collection)
                    .find(query)
                    .toArray()
                    .then(data => resolve(data[0]))
                    .catch(err => {
                        logger.error({
                            source: source,
                            message: `[find] ${err}`
                        });
                        reject(err);
                    });

            } catch (error) {
                reject(error);
            }
        });

    };

    /**
     * Remover no MongoDB
     * @param {string} collection tabela
     * @param {string} _id id
     * @return {Promise.<string>} retorno o status
     */
    function remove(collection, _id) {

        const query = {};

        return new Promise((resolve, reject) => {

            if (!db) {
                const message = 'Sem conexão com o MongoDB';
                logger.error({
                    source: source,
                    message: message
                });
                reject(message);
            }

            if (isValidID(_id)) {
                query['_id'] = ObjectID(_id);
            } else {
                logger.log({
                    level: 'error',
                    source: source,
                    message: '[remove] Campo _id invalido!'
                });
                reject({});
            }

            try {
                db.collection(collection)
                    .deleteOne(query)
                    .then(data => resolve(`Foi/Foram removido(s) ${data.deletedCount} registro(s)!`))
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            source: source,
                            message: `[remove] ${err}`
                        });
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }

        });

    };

    /**
     * Insert no MongoDB
     * @param {string} collection tabela
     * @param {object} body documento/objeto que sera persistido.
     * @return {Promise.<object>} retorno o proprio documento/objeto com o ID.
     */
    function insert(collection, body) {

        return new Promise((resolve, reject) => {

            if (!db) {
                const message = 'Sem conexão com o MongoDB';
                logger.error({
                    source: source,
                    message: message
                });
                reject(message);
            }

            if (typeof body === 'object') {
                if (body._id) delete body._id;
            } else {
                logger.log({
                    level: 'error',
                    source: source,
                    message: '[insert] Objeto de inclusão invalido!'
                });
                reject({});
            }

            try {
                db.collection(collection)
                    .insertOne(body)
                    .then(data => resolve(data))
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            source: source,
                            message: `[insert] ${err}`
                        });
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }

        });

    };

    /**
     * Atualizar no MongoDB
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {object} set objeto com os campo que serão atualizados
     * @return {Promise.<object>} retorna o documento/objeto atualizado
     */
    function update(collection, _id, set) {

        const query = {}, update = {};

        return new Promise((resolve, reject) => {

            if (!db) {
                const message = 'Sem conexão com o MongoDB';
                logger.error({
                    source: source,
                    message: message
                });
                reject(message);
            }

            if (isValidID(_id)) {
                query['_id'] = ObjectID(_id);
            } else {
                logger.log({
                    level: 'error',
                    source: source,
                    message: '[update] Campo _id invalido!'
                });
                reject({});
            }

            if (typeof set === 'object') {
                if (set._id) delete set._id;
                update['$set'] = set;
            } else {
                logger.log({
                    level: 'error',
                    source: source,
                    message: '[update] Objeto de atualização invalido!'
                });
                reject({});
            }

            try {
                db.collection(collection)
                    .updateOne(query, update)
                    .then(data => resolve(`Foi/Foram atualizado(s) ${data.matchedCount} registro(s)!`))
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            source: source,
                            message: `[update] ${err}`
                        });
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }

        });

    };

    return {
        scan,
        find,
        remove,
        insert,
        update
    }
}