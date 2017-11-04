/**
 * @file Cobertura de testes da controller.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const assert = require('assert');
const mock = require('mock-require');
const _ = require('lodash');
let i = 0;

mock('../../models/usuario', {
    find: (id, callback) => {
        console.log('#id:', id);
        if (id === '12345') {
            callback(null, { id: id, nome: 'João da Silva', idade: 23, sexo: 'masculino' });
        } else {
            callback({ code: 204 });
        }
    }
});

describe('# ./controllers/controller.js', () => {

    it(++i + ' - Validação com erro', (done) => {
        let req = {
            params: {
                id: 'AAAAA'
            }
        };
        let controller = require('../../controllers/controller');
        controller(req, (erro, resultado) => {
            assert.equal(erro.code, 400, '1');
            done();
        })
    });

    it(++i + ' - Execução com sucesso', (done) => {
        let req = {
            params: {
                id: '12345'
            }
        };
        let controller = require('../../controllers/controller');
        controller(req, (erro, resultado) => {
            assert.equal(resultado.data.id, '12345', '1');
            assert.equal(resultado.data.nome, 'João da Silva', '2');
            assert.equal(resultado.data.idade, 23, '3');
            assert.equal(resultado.data.sexo, 'masculino', '4');
            done();
        })
    });

    it(++i + ' - Execução com problema', (done) => {
        let req = {
            params: {
                id: '99999'
            }
        };
        let controller = require('../../controllers/controller');
        controller(req, (erro) => {
            assert.equal(erro.code, 204, '1');
            done();
        });
    });
});
