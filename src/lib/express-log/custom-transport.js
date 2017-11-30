/**
 * @file Customização do modulo de transports do Winston
 * @author douglaspands
 * @since 2017-11-29
 */
'use strict';

const Transport = require('winston-transport');
const util = require('util');

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = (db) => {

    const _db = db ? db : null;

    class YourCustomTransport extends Transport {
        constructor(opts) {
            super(opts);
            //
            // Consume any custom options here. e.g.:
            // - Connection information for databases
            // - Authentication information for APIs (e.g. loggly, papertrail, 
            //   logentries, etc.).
            //
        }

        log(info, callback) {
            setImmediate(function () {
                this.emit('logged', info);
            });

            // Perform the writing to the remote service
            callback();
        }
    };

    return YourCustomTransport;

} 
