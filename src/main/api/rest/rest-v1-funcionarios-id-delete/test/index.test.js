/**
 * @file Cobertura de testes do index.js
 * @author douglaspands
 * @since 2017-11-27
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../lib/context-app-test');
const pathApp = path.join(__dirname, '..');


describe('# ./index.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);

    });

    it(`${++i} - route() - Execução com sucesso`, (done) => {

        const { route } = require('../index');
        const res = route();
        assert.equal(res.method, 'delete');
        assert.equal(res.uri, '/v1/funcionarios/:id');
        done();

    });

    it(`${++i} - controller() - Execução com sucesso (statusCode: 200)`, (done) => {

        context.setMock('services/funcionario-service', {
            removerFuncionario: () => {
                return new Promise((resolved) => {
                    resolved('Foi/Foram removido(s) 1 registro(s)!');
                });
            }
        });

        const req = {
            params: {
                id: '123456789012345678901234'
            }
        };

        const res = new (function Response() {
            let statusCode;
            this.status = (arg) => {
                statusCode = arg;
                return this;
            }
            this.send = (result) => {
                assert.equal(statusCode, 200);
                assert.equal(result.data, 'Foi/Foram removido(s) 1 registro(s)!');
                done();
            }
        })();

        const { controller } = require('../index');

        controller(req, res, null, context);

    });

    it(`${++i} - controller() - Execução com sucesso (statusCode: 204)`, (done) => {

        context.setMock('services/funcionario-service', {
            removerFuncionario: () => {
                return new Promise((_, reject) => {
                    reject('Foi/Foram removido(s) 0 registro(s)!');
                });
            }
        });

        const req = {
            params: {
                id: '123456789012345678901234'
            }
        };

        const res = new (function Response() {
            let statusCode;
            this.status = (arg) => {
                statusCode = arg;
                return this;
            }
            this.send = (result) => {
                assert.equal(statusCode, 204);
                assert.equal(_.isEmpty(result), true);
                done();
            }
        })();

        const { controller } = require('../index');

        controller(req, res, null, context);

    });

    it(`${++i} - controller() - Execução com erro (statusCode: 400)`, (done) => {
        
                context.setMock('services/funcionario-service', {
                    removerFuncionario: () => {
                        return new Promise((_, reject) => {
                            reject({});
                        });
                    }
                });
        
                const req = {
                    params: {
                        id: 'ZZZZZZZZZZZZZZZZZZ'
                    }
                };
        
                const res = new (function Response() {
                    let statusCode;
                    this.status = (arg) => {
                        statusCode = arg;
                        return this;
                    }
                    this.send = (result) => {
                        assert.equal(statusCode, 400);
                        assert.equal(!_.isEmpty(result), true);
                        done();
                    }
                })();
        
                const { controller } = require('../index');
        
                controller(req, res, null, context);
        
            });        

});
