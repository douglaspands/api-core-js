/**
 * @file Cobertura de testes do modulo de forms.s
 * @author @douglaspands
 * @since 2017-11-01
 */
'use strict';
const path = require('path');
const assert = require('assert');
const _ = require('lodash');
const Context = require('../../../../lib/context');
let context, form;
let i = 0;

describe('# ./modules/form.js', function () {

    before(() => {
        context = new Context(path.join(__dirname, '../..'));
        form = context.module('form');
    });

    it(++i + ' - Validação sem erros', function (done) {
        let req = {
            params: {
                id: '12345'
            }
        };
        let errors = form(req, context);
        assert.equal(_.isEmpty(errors), true, '1');
        done();
    });
    it(++i + ' - Validação com erros', function (done) {
        let req = {
            params: {
                id: '12345AHSGHJAGSJGAS'
            }
        };
        let errors = form(req, context);
        assert.equal(_.size(errors), 1, '1');
        done();
    });
});