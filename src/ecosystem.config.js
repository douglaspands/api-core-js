/**
 * @file ecosystem.config.js
 * @author @douglaspands
 * @since 2018-09-06
 * @description Arquivo de configurações do PM2 (Load Balance)
 */
module.exports = {
    apps: [{
        name: "app",
        script: "./app.js",
    }]
}