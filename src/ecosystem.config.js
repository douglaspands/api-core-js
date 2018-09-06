/**
 * @file ecosystem.config.js
 * @author @douglaspands
 * @since 2018-09-06
 * @description Arquivo de configurações do PM2 (Load Balance)
 */
const npm_config = require('./package.json');
module.exports = {
    apps: [{
        name: `${npm_config.name}@${npm_config.version}-${(process.env.NODE_ENV || 'develop').substr(0, 1)}`,
        script: './app.js'
    }]
}