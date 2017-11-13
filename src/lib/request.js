/**
 * @file Objeto de formatação da request da api.
 * @author @douglaspands
 * @since 2017-11-12
 */
'use strict';
const _ = require('lodash');
/**
 * Class de Request.
 * @param {object} req Objeto de request da api. 
 * @param {Object} log Objeto de log.
 */
function Request(req, log) {

    this.headers = _.get(req, 'headers', {});
    this.params = _.get(req, 'params', {});
    this.query = _.get(req, 'query', {});
    this.body = _.get(req, 'body', {});

    if (log) {
        log.push('request', {
            method: _.get(req, 'method', ''),
            uri: _.get(req, 'url', ''),
            routeDirectory: _.get(req, 'routeDirectory', ''),
            headers: this.headers,
            params: this.params,
            query: this.query,
            body: this.body
        });
    }

}

module.exports = Request;