/**
 * @file health-check - Verificar status do servidor.
 * @author @douglaspands
 * @since 2017-12-29
 */
'use strict';
const os = require('os');


function healthCheck(app, rest, graphql, server) {

    app.use('/health', (req, res) => {

        const db = app.get('mongodb');
        const pack = app.get('package');

        return res.status(200).send({
            data: {
                server: {
                    name: pack.name,
                    version: pack.version,
                    host: (server.address().address === '::') ? 'localhost' : server.address().address,
                    port: server.address().port,
                    rest_routes: rest.map(route => { return { method: route.verb, uri: route.uri }; }),
                    graphql_services: graphql.map(service => `${service}`)
                },
                database: {
                    mongodb: {
                        status: (db) ? 'active' : 'disable'
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
                        interfaces: os.networkInterfaces().ens33
                    },
                    others: {
                        hostname: os.hostname(),
                        homedir: os.homedir(),
                        userInfo: os.userInfo(),
                        endianness: os.endianness()
                    }
                }
            }
        });
    });

}

module.exports = healthCheck;