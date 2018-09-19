/**
 * @file Cobertura de testes do /services/funcionario-service.js
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../middleware/express-context-test');
const pathApp = path.join(__dirname);


describe('# ./services/funcionario-service.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);

    });

    it(`${++i} - ObterFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('utils/db-crud', {
            find: () => new Promise((resolve) => {
                resolve({
                    _id: 123,
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                });
            })
        });

        const { obterFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterFuncionario(req._id);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');


    });

    it(`${++i} - ObterFuncionario() - Execução com erro`, async () => {

        context.set.mock.module('utils/db-crud', {
            find: () => new Promise((resolve, reject) => {
                reject('ERRO');
            })
        });

        const { obterFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        let result = null;
        try {
            result = await obterFuncionario(req._id);
        } catch (error) {
            result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - incluirFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('utils/db-crud', {
            insert: () => new Promise((resolve) => {
                resolve({
                    ops: [{
                        _id: '123456789012345678901234',
                        nome: 'Joao',
                        empresa: 'CPMGFHJKL'
                    }]
                });
            })
        });

        const { incluirFuncionario } = require('../index')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        let result = {};
        try {
            result = await incluirFuncionario(req.input);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - incluirFuncionario() - Execução com erro`, async () => {

        context.set.mock.module('utils/db-crud', {
            insert: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { incluirFuncionario } = require('../index')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        let result = {};
        try {
            result = await incluirFuncionario(req.input);
        } catch (error) {
            result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com sucesso`, async () => {

        context.set.mock.module('utils/db-crud', {
            scan: () => new Promise((resolve) => {
                resolve([{
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                },
                {
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }])
            })
        });

        const { pesquisarFuncionarios } = require('../index')(context);

        const req = {};

        let result = await pesquisarFuncionarios(req);

        assert.equal(result[0]._id, '123456789012345678901234');
        assert.equal(result[0].nome, 'Joao');
        assert.equal(result[0].empresa, 'CPMGFHJKL');
        assert.equal(result[1]._id, '12345678901234567890abcd');
        assert.equal(result[1].nome, 'Fabio');
        assert.equal(result[1].empresa, 'JHGFRT');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com erro`, async () => {

        context.set.mock.module('utils/db-crud', {
            scan: () => new Promise((_, reject) => {
                reject('ERRO')
            })
        });

        const { pesquisarFuncionarios } = require('../index')(context);

        const req = {};

        let result = {};
        try {
            result = await pesquisarFuncionarios(req);
        } catch (error) {
            result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - removerFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('utils/db-crud', {
            remove: () => new Promise((resolve) => {
                resolve('Foi/Foram removido(s) 1 registro(s)!');
            })
        });

        const { removerFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        let result = await removerFuncionario(req._id);

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - removerFuncionario() - Execução com erro`, async () => {

        context.set.mock.module('utils/db-crud', {
            remove: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { removerFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        let result = {};
        try {
            result = await removerFuncionario(req._id);
        } catch (error) {
            result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - atualizarFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('utils/db-crud', {
            update: () => new Promise((resolve) => {
                resolve('Foi/Foram atualizado(s) 1 registro(s)!');
            }),
            find: () => new Promise((resolve) => {
                resolve({
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'JHGFRT'
                });
            })
        });

        const { atualizarFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        let result = await atualizarFuncionario(req._id, { empresa: req.empresa });

        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'JHGFRT');

    });

    it(`${++i} - atualizarFuncionario() - Execução com erro`, async () => {

        context.set.mock.module('utils/db-crud', {
            update: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { atualizarFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        let result = {};
        try {
            result = await atualizarFuncionario(req._id, { empresa: req.empresa });
        } catch (error) {
            result = error;
        }

        assert.equal(result, 'ERRO');

    });

});
