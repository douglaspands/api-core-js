/**
 * @file Cobertura do index.js.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const Context = require('../../../lib/context');
const index = require('../index');
let context;
let i = 0;

describe('# ./index.js', () => {

    beforeEach(() => {
        context = new Context(path.join(__dirname, '..'));
    });

    it(++i + ' - Verificação da rota', (done) => {
        let rota = index.route;
        assert.equal(rota.method, 'get', '1');
        assert.equal(rota.route, '/v1/usuarios/:id', '2');
        done();
    });

    it(++i + ' - Executando com erro 500', (done) => {

        context.processor = (modulo) => {
            switch (modulo) {
                case 'processor':
                    return (arg1, arg2, callback) => {
                        callback({ status: 500, message: { code: 'erro', message: 'erro teste'} });
                    }
                default:
                    return null;
            }
        }

        let res = {
            send: (code, message) => {
                assert.equal(code, 500, '1');
                assert.equal(message.code, 'erro', '2');
                assert.equal(message.message, 'erro teste', '3');
                done();
            }
        }

        let req = {
            params: {
                id: 1
            }
        };

        index.controller(req, res, context);
    });

    it(++i + ' - Executando com sucesso - statusCode 204', (done) => {

        context.processor = (modulo) => {
            switch (modulo) {
                case 'processor':
                    return (arg1, arg2, callback) => {
                        callback(null, {});
                    }
                default:
                    return null;
            }
        }

        let res = {
            send: (code, message) => {
                assert.equal(code, 204, '1');
                assert.equal(_.isEmpty(message), true, '2');
                done();
            }
        }

        let req = {
            params: {
                id: 2
            }
        };

        index.controller(req, res, context);
    });

    it(++i + ' - Executando com sucesso - statusCode 200', (done) => {

        context.processor = (modulo) => {
            switch (modulo) {
                case 'processor':
                    return (arg1, arg2, callback) => {
                        callback(null, {
                            id: '00001',
                            nome: 'Joao Silva',
                            idade: 20
                        });
                    }
                default:
                    return null;
            }
        }

        let res = {
            send: (code, message) => {
                assert.equal(code, 200, '1');
                assert.equal(message.data.id, '00001', '2');
                assert.equal(message.data.nome, 'Joao Silva', '3');
                assert.equal(message.data.idade, 20, '4');
                done();
            }
        }

        let req = {
            params: {
                id: '001'
            }
        };

        index.controller(req, res, context);
    });

});
