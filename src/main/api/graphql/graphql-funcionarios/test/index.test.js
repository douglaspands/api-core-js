/**
 * @file Cobertura de testes do index.js
 * @author douglaspands
 * @since 2017-11-24
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const Context = require('../../../../../lib/api-context-test');
const pathApp = path.join(__dirname);

const reqExpress = {
    headers: {}
}


describe('# ./index.js', () => {

    let i = 0, context;

    beforeEach(() => {

        context = new Context(pathApp);
        context.set.mock.server('cache', {
            get: () => new Promise(resolve => resolve(null)),
            set: () => {},
            del: () => {} 
        });

    });

    it(`${++i} - ObterFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionario-service', {
            obterFuncionario: () => {
                return {
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { obterFuncionario } = require('../index').root(context);

        const req = {
            _id: '123456789012345678901234'
        };

        let result = await obterFuncionario(req, reqExpress);

        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');


    });

    it(`${++i} - criarFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionario-service', {
            incluirFuncionario: () => {
                return {
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { criarFuncionario } = require('../index').root(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        try {
            var result = await criarFuncionario(req, reqExpress);
        } catch (error) {
            console.error(error);
        }


        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - listarFuncionarios() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionario-service', {
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

        const { listarFuncionarios } = require('../index').root(context);

        const req = {};

        try {
            var result = await listarFuncionarios(req, reqExpress);
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

        context.set.mock.module('services/funcionario-service', {
            removerFuncionario: () => {
                return 'Foi/Foram removido(s) 1 registro(s)!';
            }
        });

        const { removerFuncionario } = require('../index').root(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerFuncionario(req, reqExpress);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarFuncionario() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionario-service', {
            atualizarFuncionario: () => {
                return 'Foi/Foram atualizado(s) 1 registro(s)!';
            }
        });

        const { atualizarFuncionario } = require('../index').root(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await atualizarFuncionario(req, reqExpress);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - pesquisarFuncionarios() - Execução com sucesso`, async () => {

        context.set.mock.module('services/funcionario-service', {
            pesquisarFuncionarios: () => {
                return [{
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }];
            }
        });

        const { pesquisarFuncionarios } = require('../index').root(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await pesquisarFuncionarios(req, reqExpress);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '12345678901234567890abcd');
        assert.equal(result[0].nome, 'Fabio');
        assert.equal(result[0].empresa, 'JHGFRT');

    });

});
