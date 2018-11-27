/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async (req, res, next, context) => {

    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PUT, DELETE, OPTIONS');
    return res.status(200).send();

};