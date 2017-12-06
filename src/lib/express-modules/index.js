/**
 * @file Inclusão de Middlewares do Express.js
 * @author douglapands
 * @since 2017-11-25 
 */
'use strict';
const compression = require('compression');

module.exports = (app) => {

    // Inclusão de compressão de dados
    app.use(compression());

};
