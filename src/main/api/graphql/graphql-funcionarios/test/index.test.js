/**
 * @file Cobertura de testes do index.js
 * @author douglaspands
 * @since 2017-11-24
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

    it(`${++i} - ObterFuncionario() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            obterFuncionario: () => {
                return {
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { obterFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterFuncionario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');


    });

    it(`${++i} - criarFuncionario() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            incluirFuncionario: () => {
                return {
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { criarFuncionario } = require('../index')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        try {
            var result = await criarFuncionario(req);
        } catch (error) {
            console.error(error);
        }


        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - listarFuncionarios() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            pesquisarFuncionarios: () => {
                return [{
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                },
                {
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }];
            }
        });

        const { listarFuncionarios } = require('../index')(context);

        const req = {};

        try {
            var result = await listarFuncionarios(req);
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

    it(`${++i} - removerFuncionario() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            removerFuncionario: () => {
                return 'Foi/Foram removido(s) 1 registro(s)!';
            }
        });

        const { removerFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerFuncionario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarFuncionario() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            atualizarFuncionario: () => {
                return 'Foi/Foram atualizado(s) 1 registro(s)!';
            }
        });

        const { atualizarFuncionario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await atualizarFuncionario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com sucesso`, async () => {

        context.setMock('models/funcionario', {
            pesquisarFuncionarios: () => {
                return [{
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }];
            }
        });

        const { pesquisarFuncionarios } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await pesquisarFuncionarios(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '12345678901234567890abcd');
        assert.equal(result[0].nome, 'Fabio');
        assert.equal(result[0].empresa, 'JHGFRT');

    });

});
