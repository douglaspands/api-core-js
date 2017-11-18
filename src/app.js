/**
 * @file Servidor de api-rest.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
const logModule = require('./lib/log');
const server = require('./lib/express')(__dirname, logModule);

server.create();
server.registerRoutes();
server.start((port) => {
	console.log('Servidor disponivel na url: %s%s', 'http://localhost:', port);
	server.forEachRoute(route => {
		console.log('Rota registrada: %s [%s]', route.path, route.method);
	});
});
