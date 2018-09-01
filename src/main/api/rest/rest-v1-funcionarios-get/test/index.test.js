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
        assert.equal(res.method, 'get');
        assert.equal(res.uri, '/v1/funcionarios');
        done();

    });

    it(`${++i} - controller() - Execução com sucesso (statusCode: 200)`, (done) => {

        context.setMock('services/funcionario-service', {
            pesquisarFuncionarios: () => {
                return new Promise((resolved) => {
                    resolved([{
                        _id: '123456789012345678901234',
                        nome: 'Joao',
                        empresa: 'CPMGFHJKL'
                    },
                    {
                        _id: '12345678901234567890abcd',
                        nome: 'Fabio',
                        empresa: 'JHGFRT'
                    }]);
                });
            }
        });

        const req = {};

        const res = new (function Response() {
            let statusCode;
            this.status = (arg) => {
                statusCode = arg;
                return this;
            }
            this.send = (result) => {
                assert.equal(statusCode, 200);
                assert.equal(result.data[0]._id, '123456789012345678901234');
                assert.equal(result.data[0].nome, 'Joao');
                assert.equal(result.data[0].empresa, 'CPMGFHJKL');
                assert.equal(result.data[1]._id, '12345678901234567890abcd');
                assert.equal(result.data[1].nome, 'Fabio');
                assert.equal(result.data[1].empresa, 'JHGFRT');
                done();
            }
        })();

        const { controller } = require('../index');

        controller(req, res, null, context);

    });

    it(`${++i} - controller() - Execução com sucesso (statusCode: 204)`, (done) => {

        context.setMock('services/funcionario-service', {
            pesquisarFuncionarios: () => {
                return new Promise((_, reject) => {
                    reject({});
                });
            }
        });

        const req = {};

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

});
