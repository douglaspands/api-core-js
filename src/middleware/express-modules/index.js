/**
 * @file Inclusão de Middlewares do Express.js
 * @author douglapands
 * @since 2017-11-25 
 */
'use strict';
//const compression = require('compression'); //--> problema na geração da log
const bodyParser = require('body-parser')

module.exports = app => {

    // Inclusão de compressão de dados
    //app.use(compression()); //--> problema na geração da log

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    return {};

};
