/**
 * @file Cobertura de testes do /models/usuario.js
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../../lib/context-app-test');
const pathApp = path.join(__dirname, '../..');


describe('# ./models/usuario.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);

    });

    it(`${++i} - ObterUsuario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            find: () => new Promise((resolve) => {
                resolve({
                    nome: 'Joao',
                });
            })
        });

        const { obterUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterUsuario(req._id);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result.nome, 'Joao');


    });

    it(`${++i} - ObterUsuario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            find: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { obterUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterUsuario(req._id);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - incluirUsuario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            insert: () => new Promise((resolve) => {
                resolve({
                    ops: [{
                        _id: '123456789012345678901234',
                        nome: 'Joao',
                    }]
                });
            })
        });

        const { incluirUsuario } = require('../../models/usuario')(context);

        const req = {
            input: {
                nome: 'Joao',
            }
        };

        try {
            var result = await incluirUsuario(req.input);
        } catch (error) {
            console.error(error);
        }


        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');

    });

    it(`${++i} - incluirUsuario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            insert: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { incluirUsuario } = require('../../models/usuario')(context);

        const req = {
            input: {
                nome: 'Joao',
            }
        };

        try {
            var result = await incluirUsuario(req.input);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - pesquisarUsuarios() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            scan: () => new Promise((resolve) => {
                resolve([{
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                },
                {
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                }])
            })
        });

        const { pesquisarUsuarios } = require('../../models/usuario')(context);

        const req = {};

        try {
            var result = await pesquisarUsuarios(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '123456789012345678901234');
        assert.equal(result[0].nome, 'Joao');
        assert.equal(result[1]._id, '12345678901234567890abcd');
        assert.equal(result[1].nome, 'Fabio');

    });

    it(`${++i} - pesquisarUsuarios() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            scan: () => new Promise((_, reject) => {
                reject('ERRO')
            })
        });

        const { pesquisarUsuarios } = require('../../models/usuario')(context);

        const req = {};

        try {
            var result = await pesquisarUsuarios(req);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - removerUsuario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            remove: () => new Promise((resolve) => {
                resolve('Foi/Foram removido(s) 1 registro(s)!');
            })
        });

        const { removerUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerUsuario(req._id);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - removerUsuario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            remove: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { removerUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerUsuario(req._id);
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

    it(`${++i} - atualizarUsuario() - Execução com sucesso`, async () => {

        context.setMock('utils/mongodb-crud', {
            update: () => new Promise((resolve) => {
                resolve('Foi/Foram atualizado(s) 1 registro(s)!');
            })
        });

        const { atualizarUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234',
            sobrenome: 'Silva'
        };

        try {
            var result = await atualizarUsuario(req._id, { empresa: req.sobrenome });
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarUsuario() - Execução com erro`, async () => {

        context.setMock('utils/mongodb-crud', {
            update: () => new Promise((_, reject) => {
                reject('ERRO');
            })
        });

        const { atualizarUsuario } = require('../../models/usuario')(context);

        const req = {
            _id: '123456789012345678901234',
            sobrenome: 'Silva'
        };

        try {
            var result = await atualizarUsuario(req._id, { empresa: req.sobrenome });
        } catch (error) {
            var result = error;
        }

        assert.equal(result, 'ERRO');

    });

});
