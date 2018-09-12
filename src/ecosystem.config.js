/**
 * @file ecosystem.config.js
 * @author @douglaspands
 * @since 2018-09-06
 * @description Arquivo de configurações do PM2 (Load Balance)
 */
const npm_config = require('./package.json');
const environment = (process.env.NODE_ENV === 'production')? 'production' : 'development';
const appName = `${npm_config.name}@${npm_config.version}-${(environment).substr(0, 1)}`;
const clusters = (environment === 'production')? 'max': 1;

module.exports = {
    apps: [{
        name: appName,
        script: './app.js',
        instances: clusters
    }]
}