/**
 * @file Controller
 * @author douglaspands
 * @since 2017-11-22
 */
'use strict';
/**
 * @controller rest
 * @verb post
 * @uri /v1/funcionarios
 */
/**
 * Registro da rota
 * @return {object} metodo e uri da rota. 
 */
module.exports.route = () => {

    return {
        method: 'post',
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
module.exports.controller = async ({ body }, res, _, { getModule }) => {

    const modelFuncionario = getModule('models/funcionario', true);
    const validarEntrada = getModule('modules/form', true);

    const errors = validarEntrada(body);

    if (errors) return res.status(400).send(errors);

    try {
        const ret = await modelFuncionario.criarFuncionario(body);
        res.status(201).send({ data: ret });
    } catch (error) {
        res.status(500).send({});
    }

};