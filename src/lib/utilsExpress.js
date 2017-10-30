/**
 * @file Utilitarios para o framework express.js.
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
module.exports = (express) => {
    /**
     * Executa iteração para cada rota.
     * @param {function} callback Funcao que sera executada a cada rota encontrada.
     * @return {array} Lista de rotas registradas.
     */
    function forEachRoute(callback) {
        return (express._router.stack || []).reduce((routes, o) => {
            if (o.route && o.route.path) {
                let route = {
                    path: o.route.path,
                    method: (Object.keys(o.route.methods)[0]).toUpperCase()
                };
                if (typeof callback === 'function') callback(route);
                routes.push(route);
            }
            return routes;
        }, []);
    }
    /**
     * Procura arquivo index.js no segundo nivel de diretorios.
     * @param {string} folder Diretorio que será pesquisado no segundo nivel o arquivo index.js
     * @param {function} callback Funcao que sera executada a cada rota encontrada.
     * @return {void}
     */
    function scanRoutes(folder, callback) {
        const fs = require('fs');
        const path = require('path');
        return (fs.readdirSync(folder)).forEach(route => {
            if ((/^(route-)(.)+$/g).test(route)) {
                let controller = path.join(folder, route, 'index.js');
                if (fs.existsSync(controller)) {
                    if (typeof callback === 'function') callback(controller);
                    else require(controller)(express);
                }
            }
        });
    }
    return {
        forEachRoute: forEachRoute,
        scanRoutes: scanRoutes
    }
}
