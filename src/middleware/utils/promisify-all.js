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
module.exports = (module) => {
    const listFn = (Object.keys(module)).concat(Object.keys(Object.getPrototypeOf(module)));
    return (listFn).reduce((final, it) => {
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
                module[it].apply(module, args);
            });
        };
        final[it] = module[it];
        return final;
    }, {});
}
