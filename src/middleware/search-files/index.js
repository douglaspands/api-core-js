/**
 * @file Procurar arquivos passado um diretorio.
 * @author @douglaspands
 * @since 2017-12-28
 */
'use strict';
const fs = require('fs');
const path = require('path');
/**
 * Listar todos os arquivos de um diretorio.
 * @param {string} folder diretorio com o caminho completo
 * @return {array} lista de arquivos.
 */
const searchFiles = folder => {
    let listFiles = [];
    /**
     * Concatena a lista de diretorios com o diretorio pesquisado.
     * @param {array} listDir lista de diretorios retornado da função fs.readDirSync()
     * @param {string} main diretorio submetido a função fs.readDirSync()
     * @return {array} Lista de diretorios
     */
    const fullPath = (listDir, main) => {
        return listDir.map(d => path.join(main, d));
    }
    /**
     * Faz a inclusao dos arquivos encontrados.
     * @param {array} list Lista de diretorios
     */
    const findFiles = list => {
        list.forEach(f => {
            if (fs.lstatSync(f).isDirectory()) {
                findFiles(fullPath(fs.readdirSync(f), f));
            } else {
                listFiles.push(f);
            }
        });
    }
    //--
    findFiles(fullPath(fs.readdirSync(folder), folder))
    //--
    return listFiles.sort((a, b) => {
        if (a === b) return 0;
        else if (a < b) return -1;
        else return +1;
    });
}

module.exports = searchFiles;
