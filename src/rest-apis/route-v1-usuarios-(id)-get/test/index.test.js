/**
 * @file Cobertura do index.js.
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const Context = require('../../../lib/context');
const index = require('../index');
let context;
let i = 0;

describe('# ./index.js', () => {

    beforeEach(() => {
        context = new Context(path.join(__dirname, '..'));
    });

    it(++i + ' - Verificação da rota', (done) => {
        let rota = index.route;
        assert.equal(rota.method, 'get', '1');
        assert.equal(rota.route, '/v1/usuarios/:id', '2');
        done();
    });

    it(++i + ' - Verificação da rota', (done) => {

        context.processor = (modulo) => {
            switch (modulo) {
                case 'processor':
                    return (arg1, arg2, callback) => {
                        callback({code: 500, mensagem: 'Erro'});
                    }
                default:
                    return null;
            }
        }

        let res = {
            send: (code, mensagem) => {
                assert.equal(code, 500, '1');
                assert.equal(mensagem.code, 500, '2');
                assert.equal(mensagem.mensagem, 'Erro', '3');        
                done();
            }
        }
        
        let req = {
            params: {
                id: 1
            }
        } ;

        index.controller(req, res, context);
    });

});
