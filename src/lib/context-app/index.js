/**
 * @file Modulo de apoio
 * @author douglaspands
 * @since 2017-11-23
 */
'use strict';
const fs = require('fs');
const path = require('path');

function Context(pathApp, server) {

    const _pathApp = pathApp;
    const _db = server.get('mongodb');
    const _logger = server.get('logger');

    /**
     * Obter conexão com o MongoDB
     */
    this.db = _db;

    /**
     * Modulo de log (winston)
     */
    this.logger = _logger;

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

}

module.exports = Context;

