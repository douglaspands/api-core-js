/**
 * @file Modulo de sincronia entre os bancos
 * @author @douglaspands
 * @since 2018-09-18
 * @version 1.0.20180917
 */
'use strict';

module.exports = ({ get }) => {

    const qs = get.module('querystring');
    const promisify = get.self.module('utils/module-promisify');
    const mongo = promisify(get.self.context.module('utils/mongo-crud'));
    const cache = get.server('cache');
    const config = require('./config');

    /**
     * Consultar no DB
     * @param {string} collection tabela
     * @param {object} key pesquisa
     * @param {number} seconds quantidades de segundos em cache
     * @return {Promise.<array>} retorna lista de recursos pesquisado
     */
    const scan = async (collection, key, seconds = config.cache.seconds) => {
        // chave do cache
        const cacheId = `${config.cache.prefix}:${collection}:${config.cache.search}:${qs.stringify(key)}`;
        const cacheReset = ((get.server('headers'))['x-cache-reset'] === 'true') ? true : false;
        let result = null;
        if (!cacheReset) {
            // consulta no cache
            result = await cache.get(cacheId);
        }
        // se não encontrar, busca no mongodb e adiciona no cache
        if (!result) {
            result = await mongo.scanAsync(collection, key);
            if (result) {
                try {
                    cache.set(cacheId, result, seconds);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return result;
    };

    /**
     * Consultar no DB (pelo ID)
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {number} seconds quantidades de segundos em cache
     * @return {Promise.<obejct>} retorna o recurso pesquisado
     */
    const find = async (collection, _id, seconds = config.cache.seconds) => {
        // chave do cache
        const cacheId = `${config.cache.prefix}:${collection}:${_id}`;
        const cacheReset = ((get.server('headers'))['x-cache-reset'] === 'true') ? true : false;
        let result = null;
        if (!cacheReset) {
            // consulta no cache
            result = await cache.get(cacheId);
        }
        // se não encontrar, busca no mongodb e adiciona no cache
        if (!result) {
            result = await mongo.findAsync(collection, _id);
            if (result) cache.set(cacheId, result, seconds);
        }
        return result;
    };

    /**
     * Remover no DB
     * @param {string} collection tabela
     * @param {string} _id id
     * @return {Promise.<string>} retorno o status
     */
    const remove = async (collection, _id) => {
        // remove conteudo
        const result = await mongo.removeAsync(collection, _id);
        // chave do cache
        const cacheId = `${config.cache.prefix}:${collection}:${_id}`;
        // remove do cache
        cache.del(cacheId);
        return result;
    };

    /**
     * Insert no DB
     * @param {string} collection tabela
     * @param {object} body documento/objeto que sera persistido.
     * @param {number} seconds quantidades de segundos em cache
     * @return {Promise.<object>} retorno o proprio documento/objeto com o ID.
     */
    const insert = async (collection, body, seconds = config.cache.seconds) => {
        // Remover id
        delete body._id;
        // inserir na base
        const result = (await mongo.insertAsync(collection, body)).ops[0];
        // chave do cache
        const cacheId = `${config.cache.prefix}:${collection}:${result._id}`;
        // incluir no cache
        cache.set(cacheId, result, seconds);
        return result;
    };

    /**
     * Atualizar no DB
     * @param {string} collection tabela
     * @param {string} _id id
     * @param {object} set objeto com os campo que serão atualizados
     * @return {Promise.<object>} retorna o documento/objeto atualizado
     */
    const update = async (collection, _id, set, seconds = config.cache.seconds) => {
        // Remover id
        delete body._id;
        // Atualizar na base
        await mongo.updateAsync(collection, _id, set);
        // Consultar base
        const result = await mongo.findAsync(collection, _id);
        // chave do cache
        const cacheId = `${config.cache.prefix}:${collection}:${result._id}`;
        // incluir no cache
        cache.set(cacheId, result, seconds);
        return result;
    };

    return {
        scan,
        find,
        remove,
        insert,
        update
    }

};