/**
 * @file Modulo de apoio para testes.
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function Context(pathApp) {

    const _pathApp = pathApp;

    const listMocks = [];

    /**
     * Obter conexão com o MongoDB
     */
    this.db = undefined;

    /**
     * Obter modulos locais.
     * @param {string} name Nome do modulo
     * @param {boolean} self "true" - Executa a primeira função passando o "this".
     * @return {object} Conexão com o MongoDB
     */
    this.getModule = (name, self) => {

        if (typeof name !== 'string') {
            return undefined;
        }

        const _self = (typeof self === 'boolean') ? self : false;
        const _name = name;

        // Verificando mocks
        let mock = _.find(listMocks, (o) => {
            return o.name === _name;
        });
        if (mock) return mock.mod;
        //--

        try {
            const _mod = require(path.join(_pathApp, _name));
            return (_self && _mod) ? _mod(this) : _mod;
        } catch (errA) {
            try {
                const _mod = require(path.join(_pathApp, '..', _name));
                return (_self && _mod) ? _mod(this) : _mod;
            } catch (errB) {
                console.log(errA, '\n', errB);
                return undefined;
            }
        }

        return _mod;

    }

    /**
     * Inclusão de modulos mockados
     * @param {string} name Nome do modulo
     * @param {function} mod Modulo que será executado
     */
    this.setMock = (name, mod) => {

        if (_.isString(name) && !_.isEmpty(name) && _.includes(['object', 'function'], typeof mod)) {
            listMocks.push({
                name: name,
                mod: mod
            })
        }

    }

}

module.exports = Context;

