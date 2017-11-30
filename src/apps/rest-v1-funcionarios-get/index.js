/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/**
 * Registro da rota
 * @return {object} metodo e uri da rota. 
 */
module.exports.route = () => {

    return {
        method: 'get',
        uri: '/v1/funcionarios'
    };

};
/**
 * Controller
 * @param {object} req Request da API
 * @param {object} res Response da API
 * @param {object} context Objeto de contexto da API
 * @return {void} 
 */
module.exports.controller = async ({ query }, res, next, { getModule }) => {

    const _ = require('lodash');
    const modelFuncionario = getModule('models/funcionario', true);

    try {
        const ret = await modelFuncionario.pesquisarFuncionarios(query);
        if (_.isEmpty(ret)) {
            res.status(204).send();
        } else {
            res.status(200).send({ data: ret });
        }
    } catch (error) {
        res.status(500).send(error);
    }

};