'use strict';
const cucumber = require('cucumber')
const defineSupportCode = cucumber.defineSupportCode;

defineSupportCode((fn) => {

    fn.Given(/^Dado a URL do servidor (.+)$/, (server) => {
        this.server = server;
    });

    fn.And(/^E o metodo (.+) e a rota (.+)$/, (metodo, uri) => {
        this.metodo = metodo;
        this.uri = uri;
    });

    fn.When(/^Dado a URL do servidor (.+)$/, (server) => {
        this.server = server;
    });

    fn.And(/^E o metodo (.+) e a rota (.+)$/, (metodo, uri) => {
        this.metodo = metodo;
        this.uri = uri;
    });


});