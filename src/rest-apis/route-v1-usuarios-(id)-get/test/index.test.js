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

describe('# ./index.js', () => {

    describe('> route() - Configuração da rota', () => {

        let i = 0;

        it(++i + ' - Verificação da rota', (done) => {
            let rota = index.route();
            assert.equal(rota.method, 'get', '1');
            assert.equal(rota.uri, '/v1/usuarios/:id', '2');
            done();
        });

    });

    describe('> validator() - Validação dos parametros de entrada', () => {

        beforeEach(() => {
            context = new Context(path.join(__dirname, '..'));
        });

        let i = 0;

        it(++i + ' - Validação sem erros', (done) => {

            let req = {
                params: {
                    id: '2'
                }
            };

            let res = {
                send: (mensagem) => {
                    done(JSON.stringify(mensagem, null, 4));
                }
            }

            let listaErros = index.validator(req, res, context);
            if (_.isEmpty(listaErros)) {
                done();
            };

        });

        it(++i + ' - Validação com erros', (done) => {

            let req = {
                params: {
                    id: 'A'
                }
            };

            let res = {
                send: (mensagem) => {
                    assert.equal(mensagem.status, 400, '1');
                    assert.equal(mensagem.body.code, 'validation error', '2');
                    assert.equal(_.size(mensagem.body.message), 1, '3');
                    done();
                }
            }

            let listaErros = index.validator(req, res, context);
            if (_.isEmpty(listaErros)) {
                done('Não houve erros previstos.');
            };

        });

    });

    describe('> controller() - Controller da rota', () => {

        let i = 0;

        beforeEach(() => {
            context = new Context(path.join(__dirname, '..'));
        });

        it(++i + ' - Executando com erro 500', (done) => {

            context.processor = (modulo) => {
                switch (modulo) {
                    case 'processor':
                        return (arg1, arg2, callback) => {
                            callback({ status: 500, body: { code: 'erro', message: 'erro teste' } });
                        }
                    default:
                        return null;
                }
            }

            let res = {
                send: (mensagem) => {
                    assert.equal(mensagem.status, 500, '1');
                    assert.equal(mensagem.body.code, 'erro', '2');
                    assert.equal(mensagem.body.message, 'erro teste', '3');
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
                send: (mensagem) => {
                    assert.equal(mensagem.status, 204, '1');
                    assert.equal(_.isEmpty(mensagem.body), true, '2');
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
                send: (mensagem) => {
                    assert.equal(mensagem.status, 200, '1');
                    assert.equal(mensagem.body.data.id, '00001', '2');
                    assert.equal(mensagem.body.data.nome, 'Joao Silva', '3');
                    assert.equal(mensagem.body.data.idade, 20, '4');
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
});
