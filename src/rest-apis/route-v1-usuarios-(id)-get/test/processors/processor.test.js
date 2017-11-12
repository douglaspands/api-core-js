/**
 * @file Cobertura de testes da processor.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const Context = require('../../../../lib/context');
let context;
let i = 0;

describe('# ./processors/processor.js', () => {

    beforeEach(() => {
        context = new Context(path.join(__dirname, '../..'));
    });

    it(++i + ' - Execução com sucesso', (done) => {
        let req = {
            params: {
                id: '00001'
            }
        };
        context.model = (nome) => {
            switch (nome) {
                case 'usuario':
                    return () => {
                        return {
                            find: (arg, callback) => {
                                callback(null, {
                                    id: '00001',
                                    nome: 'João da Silva',
                                    idade: 23,
                                    sexo: 'masculino'
                                });
                            }
                        };
                    }
                default:
                    return null;
            }
        }
        let controller = context.processor('processor');
        controller(req, context, (erro, resultado) => {
            assert.equal(erro, null, '1');
            assert.equal(resultado.id, '00001', '2');
            assert.equal(resultado.nome, 'João da Silva', '3');
            assert.equal(resultado.idade, 23, '4');
            assert.equal(resultado.sexo, 'masculino', '5');
            done();
        })
    });

    it(++i + ' - Execução com problema', (done) => {
        let req = {
            params: {
                id: '99999'
            }
        };
        context.model = (nome) => {
            switch (nome) {
                case 'usuario':
                    return () => {
                        return {
                            find: (arg, callback) => {
                                callback({
                                    code: 204
                                });
                            }
                        };
                    }
                default:
                    return null;
            }
        }
        let controller = context.processor('processor');
        controller(req, context, (erro) => {
            assert.equal(erro.code, 204, '1');
            done();
        });
    });
});
