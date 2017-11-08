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
        let index = path.join(__dirname, '../../public/index.html');
        context.res.status(200).sendFile(index);
};