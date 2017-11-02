/**
 * @file Model Usuario.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const _ = require('lodash');
const Usuario = require('../domains/usuario');
/**
 * Criar usuario.
 * @param {object} usuario
 * @return {Promise.<Usuario>} retornar o objeto Usuario. 
 */
function create(usuario) {
    return new Promise((resolve, reject) => {
        if (_.isObject(usuario)) {
            resolve(new Usuario('', usuario.nome, usuario.idade, usuario.sexo));
        } else {
            reject({
                code: 500,
                message: 'Usuario invalido!'
            });
        }    
    });
}
/**
 * Atualizar o usuario.
 * @param {string} id Id do usuario
 * @param {Usuario} usuario Objeto do usuario.
 * @return {Promise.<Usuario>} retornar o objeto Usuario. 
 */
function update(id, usuario) {
    return new Promise((resolve, reject) => {
        if (_.isString(id) && _.size(id) > 0 && _.isObject(usuario)) {
            resolve(new Usuario(id, usuario.nome, usuario.idade, usuario.sexo));
        } else {
            reject({
                code: 500,
                message: 'Problema na atualização do usuario!'
            });
        } 
    });
}
/**
 * Remover usuario.
 * @param {string} id Id do usuario
 * @return {Promise.<void>} 
 */
function remove(id) {
    return new Promise((resolve, reject) => {
        if (_.isString(id) && _.size(id) > 0) {
            resolve({});
        } else {
            reject({
                code: 500,
                message: 'Problema na exclusão do usuario!'
            });
        }            
    });
}
/**
 * Consultar usuario.
 * @param {string} id Id do usuario
 * @return {Promise.<Usuario>} 
 */
function find(id) {
    return new Promise((resolve, reject) => {
        if (_.isString(id) && _.size(id) > 0) {
            resolve(new Usuario(id, 'João da Silva', 23, 'masculino'));
        } else {
            reject({
                code: 204,
                message: 'Não foi encontrado o usuario!'
            });
        }            
    });
}
module.exports = {
    update,
    remove,
    update,
    find
}