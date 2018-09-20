/**
 * @file Cobertura de testes do index.js
 * @author douglaspands
 * @since 2017-11-27
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../../../middleware/express-context-test');
const pathApp = path.join(__dirname);


describe('# ./index.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);

    });

    it(`${++i} - route() - Execução com sucesso`, (done) => {

        const { route } = require('../index');
        const res = route();
        assert.equal(res.method, 'post');
        assert.equal(res.uri, '/v1/funcionarios');
        done();

    });

    it(`${++i} - controller() - Execução com sucesso (statusCode: 201)`, (done) => {

        context.set.mock.module('services/funcionarios-service', {
            incluirFuncionario: () => {
                return new Promise((resolved) => {
                    resolved({
                        _id: '123456789012345678901234',
                        nome: 'Joao',
                        sobrenome: 'Silva',
                        empresa: 'CPMGFHJKL',
                        telefone: '1188888888',
                        email: 'joao.silva@lala.com',
                        cidade: 'sao paulo',
                        estado: 'sp'
                    });
                });
            }
        });

        const req = {
            body: {
                nome: 'Joao',
                sobrenome: 'Silva',
                empresa: 'CPMGFHJKL',
                telefone: '1188888888',
                email: 'joao.silva@lala.com',
                cidade: 'sao paulo',
                estado: 'sp'
            }
        };

        const res = new (function Response() {
            let statusCode;
            this.status = (arg) => {
                statusCode = arg;
                return this;
            }
            this.send = (result) => {
                assert.equal(statusCode, 201);
                assert.equal(result.data._id, '123456789012345678901234');
                assert.equal(result.data.nome, 'Joao');
                assert.equal(result.data.empresa, 'CPMGFHJKL');
                done();
            }
        })();

        const { controller } = require('../index');

        controller(req, res, null, context)
            .then().catch(erro => done(erro));


    });

    it(`${++i} - controller() - Execução com erro (statusCode: 500)`, (done) => {

        context.set.mock.module('services/funcionarios-service', {
            incluirFuncionario: () => {
                return new Promise((resolve, reject) => {
                    reject({});
                });
            }
        });

        const req = {
            body: {
                nome: 'Joao',
                sobrenome: 'Silva',
                empresa: 'CPMGFHJKL',
                telefone: '1188888888',
                email: 'joao.silva@lala.com',
                cidade: 'sao paulo',
                estado: 'sp'
            }
        };

        const res = new (function Response() {
            let statusCode;
            this.status = (arg) => {
                statusCode = arg;
                return this;
            }
            this.send = (result) => {
                assert.equal(statusCode, 500);
                done();
            }
        })();

        const { controller } = require('../index');

        controller(req, res, null, context)
            .then().catch(erro => done(erro));


    });

    it(`${++i} - controller() - Execução com erro (statusCode: 400)`, (done) => {

        context.set.mock.module('services/funcionarios-service', {
            incluirFuncionario: () => {
                return new Promise((_, reject) => {
                    reject({});
                });
            }
        });

        const req = {
            body: {
                nome: 1234567,
                empresa: 1234567
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

        controller(req, res, null, context)
            .then().catch(erro => done(erro));

    });

});
