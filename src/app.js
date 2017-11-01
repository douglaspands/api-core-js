/**
 * @file Servidor de api-rest.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

const app = express();
const utilsExpress = require('./lib/utils-express')(app);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

utilsExpress.scanRoutes(path.join(__dirname, 'rest-apis'));
app.use((req, res, next) => {
	res.status(404).send('Rota não encontrada!');
});
let port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log('Servidor disponivel na url: %s%s', 'http://localhost:', server.address().port);
	utilsExpress.forEachRoute(route => {
		console.log('Rota registrada: %s [%s]', route.path, route.method);
	});
});
