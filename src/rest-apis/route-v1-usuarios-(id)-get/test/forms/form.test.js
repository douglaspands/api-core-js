/**
 * @file Cobertura de testes do modulo de forms
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const assert = require('assert');
const _ = require('lodash');
const form = require('../../forms/form');

describe('> ./forms/form.js', function () {
    let i = 0;
    it(++i + ' - Validação sem erros', function (done) {
        let req = {
            params: {
                id: '12345'
            }
        };
        let errors = form(req);
        assert.equal(_.size(errors), 0, '1');
        done();
    });
    it(++i + ' - Validação com erros', function (done) {
        let req = {
            params: {
                id: '12345AHSGHJAGSJGAS'
            }
        };
        let errors = form(req);
        assert.equal(_.size(errors), 1, '1');
        done();
    });
});