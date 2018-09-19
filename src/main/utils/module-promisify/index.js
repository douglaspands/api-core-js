/**
 * @file Transforma todas as funções em Promise.
 * @author @douglaspands
 * @since 2018-09-17
 * @version 1.0.0
 */
'use strict';
/**
 * Transforma todas as 
 * @param {object} module 
 * @returns {object} Transforma todos os callbacks em promises retornando elas com o final Async
 */
function promisify(module) {
    return (Object.keys((module || {}))).reduce((final, it) => {
        final[`${it}Async`] = function Async() {
            const args = [].slice.call(arguments);
            if (!(this instanceof Async)) {
                return new Async(...args);
            }
            return new Promise((resolve, reject) => {
                args.push((error, result) => {
                    if (error) return reject(error);
                    else return resolve(result);
                });
                module[it].apply(this, args);
            });
        };
        final[it] = module[it];
        return final;
    }, {});
}
module.exports = promisify;