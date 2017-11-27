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

    it(`${++i} - ObterUsuario() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            obterUsuario: () => {
                return {
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { obterUsuario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await obterUsuario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');


    });

    it(`${++i} - criarUsuario() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            incluirUsuario: () => {
                return {
                    _id: '123456789012345678901234',
                    nome: 'Joao',
                    empresa: 'CPMGFHJKL'
                };
            }
        });

        const { criarUsuario } = require('../index')(context);

        const req = {
            input: {
                nome: 'Joao',
                empresa: 'CPMGFHJKL'
            }
        };

        try {
            var result = await criarUsuario(req);
        } catch (error) {
            console.error(error);
        }


        assert.equal(result._id, '123456789012345678901234');
        assert.equal(result.nome, 'Joao');
        assert.equal(result.empresa, 'CPMGFHJKL');

    });

    it(`${++i} - listarUsuarios() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            pesquisarUsuarios: () => {
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

        const { listarUsuarios } = require('../index')(context);

        const req = {};

        try {
            var result = await listarUsuarios(req);
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

    it(`${++i} - removerUsuario() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            removerUsuario: () => {
                return 'Foi/Foram removido(s) 1 registro(s)!';
            }
        });

        const { removerUsuario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234'
        };

        try {
            var result = await removerUsuario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram removido(s) 1 registro(s)!');

    });

    it(`${++i} - atualizarUsuario() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            atualizarUsuario: () => {
                return 'Foi/Foram atualizado(s) 1 registro(s)!';
            }
        });

        const { atualizarUsuario } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await atualizarUsuario(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result, 'Foi/Foram atualizado(s) 1 registro(s)!');

    });

    it(`${++i} - pesquisarUsuarios() - Execução com sucesso`, async () => {

        context.setMock('models/usuario', {
            pesquisarUsuarios: () => {
                return [{
                    _id: '12345678901234567890abcd',
                    nome: 'Fabio',
                    empresa: 'JHGFRT'
                }];
            }
        });

        const { pesquisarUsuarios } = require('../index')(context);

        const req = {
            _id: '123456789012345678901234',
            empresa: 'JHGFRT'
        };

        try {
            var result = await pesquisarUsuarios(req);
        } catch (error) {
            console.error(error);
        }

        assert.equal(result[0]._id, '12345678901234567890abcd');
        assert.equal(result[0].nome, 'Fabio');
        assert.equal(result[0].empresa, 'JHGFRT');

    });

});
