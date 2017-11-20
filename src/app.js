/**
 * @file Servidor de api-rest.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
const async = require('async');
const logModule = require('./lib/log');
const server = require('./lib/express')(__dirname, logModule);
const loadModules = require('./lib/modules')(server, logModule);

async.auto({
	// Criar servidor
	createServer: (callback) => {
		server.create();
		callback();
	},
	// Registrar as rotas
	registerRoutes: ['createServer', (results, callback) => {
		server.registerRoutes();
		callback();
	}],
	// Adicionando modulos
	addModules: ['createServer', (results, callback) => {
		loadModules(callback);
	}]
}, () => {
	// Iniciar servidor
	server.start((port) => {
		console.log(`Servidor disponivel na url: http://localhost:${port}`);
		server.forEachRoute(route => {
			console.log(`Rota registrada: ${route.path} [${route.method}]`);
		});
	});
});
