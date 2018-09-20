/**
 * @file Modulo de execução antes da API
 * @author douglaspands
 * @since 2018-09-19
 */
'use strict';

/**
 * Função pre execucao da api
 * @param {object} app express().
 * @return {void}
 */
module.exports = app => {

    // Armazenando headers
    app.use((req, res, next) => {
        app.set('headers', req.headers);
        next();
    });

}