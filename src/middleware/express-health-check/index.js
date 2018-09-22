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
 * @param {object} app_health Framework express.js configurado (servidor health-check)
 * @param {object} server Configurações do servidor
 */
module.exports = (app, app_health, server) => {

    const pack = app.get('package');
    const rest = app.get('rest_list');
    const graphql = app.get('graphql_list');

    const client = app.get('client');
    const clientConfig = app.get('client-config');

    app_health.use((req, res) => {

        const flagJson = (req.headers['content-type'] === 'application/json') ? true : false;
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
                    mongo: {
                        status: (client.get('mongodb'))
                            ? 'enable'
                            : 'disable',
                        url: (client.get('mongodb'))
                            ? (clientConfig.get('mongodb')).url
                            : undefined
                    },
                    redis: {
                        status: (client.get('redis'))
                            ? 'enable'
                            : 'disable',
                        url: (client.get('redis'))
                            ? `redis://${(clientConfig.get('redis')).host}:${(clientConfig.get('redis')).port}`
                            : undefined
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

        const response = (flagJson) ? resultData : `<pre>\n${JSON.stringify(resultData, null, 4)}\n</pre>`;
        return res.status(200).send(response);

    });
};
