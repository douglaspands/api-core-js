/**
 * @file Rota com a pagina principal (single page application).
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
module.exports = (server) => {
    let method = 'get';
    let route = '/';
    server[method](route, (req, res, next) => {
        let index = path.join(__dirname, '../../public/index.html');
        res.status(200).sendFile(index);
    });
};