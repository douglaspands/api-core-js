/**
 * @file Inclusão de Middlewares do Express.js
 * @author douglapands
 * @since 2017-11-25 
 */
'use strict';
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

module.exports = (app) => {

    // Inclusão de compressão de dados
    app.use(compression());
    // Permite requisições de origens diferentes
    app.use(cors());
    // Servidor de arquivos estaticos
    //app.use(express.static(path.join(__dirname, '../..', 'public')));
    // Configurações de payload
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

};
