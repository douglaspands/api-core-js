/**
 * @file CRUD padrão no MongoDB.
 * @author douglaspands
 * @since 2018-09-18
 * @version 1.0.0
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
    const isValidID = id => ObjectID.isValid(id);

    /**
     * Consultar no MongoDB
     * @param {string} collection tabela
     * @param {object} key pesquisa
     * @param {function} callback
     * @return {void}
     */
    const scan = (collection, key, callback) => {

        const query = {};

        if (!db) {
            const message = 'Sem conexão com o MongoDB';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
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

        db.collection(collection)
            .find(query)
            .toArray()
            .then(data => callback(null, data))
            .catch(err => {
                logger.error({
                    source: source,
                    message: err
                });
                callback(err);
            });

    };

    /**
     * Consultar no MongoDB (pelo ID)
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {function} callback
     * @return {void}
     */
    const find = (collection, _id, callback) => {

        const query = {};

        if (!db) {
            const message = 'Sem conexão com o MongoDB';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        if (isValidID(_id)) {
            query['_id'] = ObjectID(_id);
        } else {
            const message = '[find] Campo _id invalido!';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        db.collection(collection)
            .find(query)
            .toArray()
            .then(data => callback(null, data[0]))
            .catch(err => {
                logger.error({
                    source: source,
                    message: `[find] ${err}`
                });
                callback(err);
            });

    };

    /**
     * Remover no MongoDB
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {function} callback
     * @return {void}
     */
    const remove = (collection, _id, callback) => {

        const query = {};

        if (!db) {
            const message = 'Sem conexão com o MongoDB';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        if (isValidID(_id)) {
            query['_id'] = ObjectID(_id);
        } else {
            const message = '[remove] Campo _id invalido!';
            logger.log({
                level: 'error',
                source: source,
                message: message
            });
            callback(message);
        }

        db.collection(collection)
            .deleteOne(query)
            //.then(data => callback(null, `Foi/Foram removido(s) ${data.deletedCount} registro(s)!`))
            .then(data => {
                if (data.deletedCount === 0) {
                    callback(`Não foi encontrado o registro solicitado!`);
                } else {
                    callback(null, `Registro removido com sucesso!`);
                }
            })
            .catch(err => {
                logger.log({
                    level: 'error',
                    source: source,
                    message: `[remove] ${err}`
                });
                callback(err);
            });
    };

    /**
     * Insert no MongoDB
     * @param {string} collection tabela
     * @param {object} body documento/objeto que sera persistido.
     * @param {function} callback
     * @return {void}
     */
    const insert = (collection, body, callback) => {

        if (!db) {
            const message = 'Sem conexão com o MongoDB';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        if (typeof body === 'object') {
            if (body._id) delete body._id;
        } else {
            const message = '[insert] Objeto de inclusão invalido!';

            logger.log({
                level: 'error',
                source: source,
                message: message
            });
            callback(message);
        }

        db.collection(collection)
            .insertOne(body)
            .then(data => callback(null, data))
            .catch(err => {
                logger.error({
                    source: source,
                    message: `[insert] ${err}`
                });
                callback(err);
            });

    };

    /**
     * Atualizar no MongoDB
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {object} set objeto com os campo que serão atualizados
     * @param {function} callback
     * @return {void}
     */
    const update = (collection, _id, set, callback) => {

        const query = {}, update = {};

        if (!db) {
            const message = 'Sem conexão com o MongoDB';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        if (isValidID(_id)) {
            query['_id'] = ObjectID(_id);
        } else {
            const message = '[update] Campo _id invalido!';
            logger.error({
                source: source,
                message: message
            });
            callback(message);
        }

        if (typeof set === 'object') {
            if (set._id) delete set._id;
            update['$set'] = set;
        } else {
            const message = '[update] Objeto de atualização invalido!';
            logger.error({
                source: source,
                message: '[update] Objeto de atualização invalido!'
            });
            callback(message);
        }

        db.collection(collection)
            .updateOne(query, update)
            //.then(data => callback(null, `Foi/Foram atualizado(s) ${data.matchedCount} registro(s)!`))
            .then(data => {
                if (data.matchedCount === 0) {
                    callback(`Não foi encontrado o registro solicitado!`);
                } else {
                    callback(null, `Registro atualizado com sucesso!`);
                }
            })
            .catch(err => {
                logger.error({
                    source: source,
                    message: `[update] ${err}`
                });
                callback(err);
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