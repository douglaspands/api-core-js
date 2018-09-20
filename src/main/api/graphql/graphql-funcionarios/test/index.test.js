/**
 * @file Cobertura de testes do index.js
 * @author douglaspands
 * @since 2017-11-24
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

        context = new Context(pathApp);;

    });

    it(`${++i} - ObterFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionarios-service', {
            obterFuncionario: () => {
                return {
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { obterFuncionario } = require('../index').root(context).Query;

        const input = {
            _id: '123456789012345678901234'
        };

        let result = await obterFuncionario(null, input, null, null);

        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');


    });

    it(`${++i} - criarFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionarios-service', {
            incluirFuncionario: () => {
                return {
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    sobrenome: 'Silva',
                    empresa: 'CPMGFHJKL',
                    telefone: '1188888888',
                    email: 'joao.silva@lala.com',
                    cidade: 'sao paulo',
                    estado: 'sp'
                }
            }
        });

        const { criarFuncionario } = require('../index').root(context).Mutation;

        const input = {
                nome: 'Joao',
                sobrenome: 'Silva',
                empresa: 'CPMGFHJKL',
                telefone: '1188888888',
                email: 'joao.silva@lala.com',
                cidade: 'sao paulo',
                estado: 'sp'
        };

        let result = await criarFuncionario(null, input, null, null);

        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - removerFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionarios-service', {
            removerFuncionario: () => {
                return 'Foi/Foram removido(s) 1 registro(s)!';
            }
        });

        const { removerFuncionario } = require('../index').root(context).Mutation;

        const input = {
            _id: '123456789012345678901234'
        };

        let result = await removerFuncionario(null, input, null, null);

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionarios-service', {
            atualizarFuncionario: () => {
                return 'Foi/Foram atualizado(s) 1 registro(s)!';
            }
        });

        const { atualizarFuncionario } = require('../index').root(context).Mutation;

        const input = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        let result = await atualizarFuncionario(null, input, null, null);

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionarios-service', {
            pesquisarFuncionarios: () => {
                return [{
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }];
            }
        });

        const { pesquisarFuncionarios } = require('../index').root(context).Query;

        const input = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await pesquisarFuncionarios(null, input, null, null);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '12345678901234567890abcd');
        assert.equal(result[0].nome, 'Fabio');
        assert.equal(result[0].empresa, 'JHGFRT');

    });

});
