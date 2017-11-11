/**
 * @file Model Usuario.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
/**
 * @typedef Callback Callback de execução.
 * @property {object} erro JSON com o erro da execução.
 * @property {object} resultado JSON com o resultado da execução.
 */
const _ = require('lodash');
const Usuario = require('../domains/usuario');
const error = require('../utils/error');
/**
 * Criar usuario.
 * @param {object} usuario
 * @param {Callback} done Callback de conclusão da execução.
 * @return {void} 
 */
function create(usuario, done) {
    if (_.isObject(usuario)) {
        done(null, new Usuario('', usuario.nome, usuario.idade, usuario.sexo));
    } else {
        done(error.create(500, 'Usuario invalido!'));
    }
}
/**
 * Atualizar o usuario.
 * @param {string} id Id do usuario
 * @param {Usuario} usuario Objeto do usuario.
 * @param {Callback} done Callback de conclusão da execução.
 * @return {void} 
 */
function update(id, usuario, done) {
    if (_.isString(id) && _.size(id) > 0 && _.isObject(usuario)) {
        done(null, new Usuario(id, usuario.nome, usuario.idade, usuario.sexo));
    } else {
        done(error.create(500, 'Problema na atualização do usuario!'));
    }
};
/**
 * Remover usuario.
 * @param {string} id Id do usuario
 * @param {Callback} done Callback de conclusão da execução. 
 * @return {void}
 */
function remove(id) {
    if (_.isString(id) && _.size(id) > 0) {
        done(null, {});
    } else {
        reject(error.create(500, 'Problema na exclusão do usuario!'));
    }
}
/**
 * Consultar usuario.
 * @param {string} id Id do usuario
 * @param {Callback} done Callback de conclusão da execução. 
 * @return {void}
 */
function find(id, done) {
    if ((/^[0-9]+$/g).test(id) && parseInt(id, 10) > 99999) {
        done(error.create(422, { code: 'erro semantico', message: 'ID contem mais de 5 digitos.' }));
    } else if ((/^[0-9]+$/g).test(id) && parseInt(id, 10) === 1) {
        done(null, new Usuario(_.padStart(parseInt(id, 10), 5, '0'), 'João da Silva', 23, 'masculino'));
    } else {
        done(error.create(204));
    }
}
module.exports = {
    create,
    remove,
    update,
    find
};
