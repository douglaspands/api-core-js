/**
 * @file Servidor de api-rest.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
	res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});
const dirRestApi = path.join(__dirname, 'rest_api');
(fs.readdirSync(dirRestApi)).forEach(route => {
	let controller = path.join(dirRestApi, route, 'index.js');
	if (fs.existsSync(controller)) require(controller)(app);
});
app.use((req, res, next) => {
	res.status(404).send('Rota não encontrada!');
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log('Servidor disponivel na url: http:/localhost/%s', server.address().port);
	(app._router.stack).forEach((r) => {
		if (r.route && r.route.path) {
			console.log('> Rota registrada:', r.route.path)
		}
	})
});