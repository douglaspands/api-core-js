/**
 * @file Rota com a pagina principal (single page application).
 * @author @douglaspands
 * @since 2017-10-29
 */
'use strict';
module.exports.route = {
    method: 'get',
    route: '/'
}
module.exports.controller = (req, res, context) => {
        const path = context.require('path');
        let index = path.join(__dirname, '../../public/index.html');
        res.sendFile(200, index);
};