/**
 * @file Servidor de api-rest.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
const server = require('./lib/express')(__dirname);

const app = server.create();
server.scanRoutes();

const port = process.env.PORT || 3000;
server.start(port, () => {
	console.log('Servidor disponivel na url: %s%s', 'http://localhost:', port);
	server.forEachRoute(route => {
		console.log('Rota registrada: %s [%s]', route.path, route.method);
	});
});
