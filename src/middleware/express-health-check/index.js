/**
 * @file health-check - Verificar status do servidor.
 * @author @douglaspands
 * @since 2017-12-29
 */
'use strict';
const os = require('os');
/**
 * Função que parametriza o Healh-Check no servidor
 * @param {object} app Framework express.js configurado (servidor principal) 
 * @param {array} rest Lista de rotas de REST API 
 * @param {array} graphql Lista de rotas de GraphQL API
 * @param {object} server Configurações do servidor
 * @param {object} app_health Framework express.js configurado (servidor health-check)
 */
module.exports = (app, rest, graphql, server, app_health) => {

    const db = app.get('mongodb');
    const pack = app.get('package');
    const logger = app.get('logger');

    app_health.use((req, res) => {

        const flagJson = (req.headers['content-type'] === 'application/json')? true: false;
        const resultData = {
            data: {
                server: {
                    name: pack.name,
                    version: pack.version,
                    host: (server.address().address === '::') ? 'localhost' : server.address().address,
                    port: server.address().port,
                    rest_routes: rest.map(route => { return { method: route.method, uri: route.uri }; }),
                    graphql_services: graphql.map(service => `${service}`)
                },
                database: {
                    mongodb: {
                        status: (db) ? 'enable' : 'disable',
                        url: (db) ? db.url : ''
                    }
                },
                machine: {
                    os: {
                        name: os.platform(),
                        arch: os.arch(),
                        release: os.release(),
                        type: os.type(),
                        uptime: os.uptime()
                    },
                    hardware: {
                        cpus: os.cpus(),
                        memory_total: os.totalmem(),
                        memory_free: os.freemem(),
                        loadavg: os.loadavg()
                    },
                    network: {
                        interfaces: os.networkInterfaces()
                    },
                    others: {
                        hostname: os.hostname(),
                        homedir: os.homedir(),
                        userInfo: os.userInfo(),
                        endianness: os.endianness()
                    }
                }
            }
        };

        const response = (flagJson)? resultData: `<pre>\n${JSON.stringify(resultData, null, 4)}\n</pre>`;
        return res.status(200).send(response);

    });
};
