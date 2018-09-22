/**
 * @file Classe para armazenar objetos que se corrompem no Express.js
 * @author @douglaspands
 * @since 2018-09-22
 * @version 1.0.20180922
 */
'use strict';
/**
 * Classe para armazenar modulos
 * @constructor
 */
module.exports = function Container() {
    // É obrigatorio instanciar
    if (!(this instanceof Container)) {
        return new Container();
    }
    // Objeto de armazenamento 
    let _container = {};
    /**
     * Obter modulo 
     * @param {string} moduleName nome do modulo
     * @returns {*} retorna modulo encapsulado
     */
    this.get = moduleName => (typeof moduleName === 'string' && moduleName.length > 0) ? _container[moduleName] : null;
    /**
     * Armazenar modulo
     * @param {string} moduleName nome do modulo 
     * @param {*} moduleData modulo
     * @return {*} this 
     */
    this.set = (moduleName, moduleData) => {
        if (typeof moduleName === 'string' && moduleName.length > 0 && moduleData) {
            _container[moduleName] = moduleData;
        }
        return this;
    }
}
