/**
 * @file Cobertura de testes do /models/funcionario.js
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../../lib/context-app-test');
const pathApp = path.join(__dirname, '../..');


describe('# ./models/funcionario.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);

    });

    it(`${++i} - ObterFuncionario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            find: () => new Promise((resolve) => {
                resolve({
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                });
            })
        });

        const { obterFuncionario } = require('../../models/funcionario')(context);

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

        context.setMock('utils/mongodb-crud', {
            find: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { obterFuncionario } = require('../../models/funcionario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterFuncionario(req._id);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - incluirFuncionario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
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

        const { incluirFuncionario } = require('../../models/funcionario')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        try {
            var result = await incluirFuncionario(req.input);
        } catch (error) {
            console.error(error);
        }


        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - incluirFuncionario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            insert: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { incluirFuncionario } = require('../../models/funcionario')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        try {
            var result = await incluirFuncionario(req.input);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
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

        const { pesquisarFuncionarios } = require('../../models/funcionario')(context);

        const req = {};

        try {
            var result = await pesquisarFuncionarios(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '123456789012345678901234');
        assert.equal(result[0].nome, 'Joao');
        assert.equal(result[0].empresa, 'CPMGFHJKL');
        assert.equal(result[1]._id, '12345678901234567890abcd');
        assert.equal(result[1].nome, 'Fabio');
        assert.equal(result[1].empresa, 'JHGFRT');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            scan: () => new Promise((_, reject) => {
                reject('ERRO')
            })
        });

        const { pesquisarFuncionarios } = require('../../models/funcionario')(context);

        const req = {};

        try {
            var result = await pesquisarFuncionarios(req);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - removerFuncionario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            remove: () => new Promise((resolve) => {
                resolve('Foi/Foram removido(s) 1 registro(s)!');
            })
        });

        const { removerFuncionario } = require('../../models/funcionario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerFuncionario(req._id);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - removerFuncionario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            remove: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { removerFuncionario } = require('../../models/funcionario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerFuncionario(req._id);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - atualizarFuncionario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            update: () => new Promise((resolve) => {
                resolve('Foi/Foram atualizado(s) 1 registro(s)!');
            })
        });

        const { atualizarFuncionario } = require('../../models/funcionario')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await atualizarFuncionario(req._id, { empresa: req.empresa });
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarFuncionario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            update: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { atualizarFuncionario } = require('../../models/funcionario')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await atualizarFuncionario(req._id, { empresa: req.empresa });
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

});
