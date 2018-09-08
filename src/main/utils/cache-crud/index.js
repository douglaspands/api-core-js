/**
 * @file Arquivo de alternancia de cache
 * @author @douglaspands
 * @since 2018-09-08
 */
'use strict'
module.exports = ({ getServer }) => {
    const cache = getServer('cache');
    /**
     * Enviar erro
     * @param {string} mensagem com erro
     * @returns {void}
     */
    const enviarErro = (mensagem) => {
        const erro = new Error(`Cache Error: Falta informar "${mensagem}"!`);
        throw erro;
    }
    /**
     * Consultar cache.
     * @param {string} chave do cache
     * @returns {function} 
     * - casoContrarioIncluirValor
     * - casoContrarioIncluirResultadoDoMetodo 
     */
    const obter = (chave = enviarErro('chave do cache')) => {
        let _chave = chave;
        let _valor = null;
        let _metodo = null;
        let _args = null;
        /**
         * Armazenar em cache e retorna valor.
         * @param {number} segundos para expirar. Caso não preenchido, o valor default é 600 segundos (15 min) 
         * @returns {Promise<object>} Retorna objeto do banco de dados
         */
        const expirarEm = async (segundos = enviarErro('os segundos para expirar')) => {
            if (!_valor) {
                _valor = await cache.get(_chave);
                if (_valor) _valor = JSON.parse(_valor);
                else {
                    _valor = await ((Arrays.isArray(_args))? _metodo(..._args) : _metodo(_args));
                }
            }
            return (_valor) ? cache.set(_chave, _valor, segundos) : null;
        }
        /**
         * Incluir o valor
         * @param {any} valor armazenado em cache
         * @returns {function} expirarEm
         */
        const casoContrarioIncluirValor = (valor = enviarErro('os segundos para expirar')) => {
            _valor = valor;
            return {
                expirarEm
            }
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} metodo para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expirarEm 
         */
        const casoContrarioIncluirResultadoDoMetodo = (metodo = enviarErro('metodo a ser executado'), args = enviarErro('os argumentos do metodo informado')) => {
            if (typeof metodo !== 'function') enviarErro('metodo como função');
            _metodo = metodo;
            _args = args;
            return {
                expirarEm
            }
        }
        return {
            casoContrarioIncluirValor,
            casoContrarioIncluirResultadoDoMetodo
        }
    }
    /**
     * Incluir cache.
     * @param {string} chave do cache
     * @returns {function} 
     * - incluirValor
     * - incluirResultadoDoMetodo
     */
    const incluir = (chave = enviarErro('chave do cache')) => {
        let _chave = chave;
        let _valor = null;
        let _metodo = null;
        let _args = null;
        const EXTRAIR_KEY = new RegExp('(?<=\{\{)(.+)(?=\}\})', 'g');
        const SUBSTITUIR_KEY = new RegExp('(\{\{)(.+)(\}\})', 'g');
        /**
         * Armazenar em cache e retorna valor.
         * @param {number} segundos para expirar. Caso não preenchido, o valor default é 600 segundos (15 min) 
         * @returns {Promise<object>} Retorna objeto do banco de dados
         */
        const expirarEm = async (segundos = enviarErro('os segundos para expirar')) => {
            if (!_valor) _valor = await _metodo(_args);
            const [ key ] = _chave.match(EXTRAIR_KEY);
            return (_valor) ? cache.set(_chave, _chave.replace(SUBSTITUIR_KEY, _valor[key]), segundos) : null;
        }
        /**
         * Incluir o valor
         * @param {any} valor armazenado em cache
         * @returns {function} expirarEm
         */
        const comValor = async (valor = enviarErro('os segundos para expirar')) => {
            _valor = valor;
            return {
                expirarEm
            }
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} metodo para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expirarEm 
         */
        const comResultadoDoMetodo = (metodo = enviarErro('metodo a ser executado'), args = enviarErro('os argumentos do metodo informado')) => {
            if (typeof metodo !== 'function') enviarErro('metodo como função');
            _metodo = metodo;
            _args = args;
            return {
                expirarEm
            }
        }
        return {
            comValor,
            comResultadoDoMetodo
        }
    }
    /**
     * Excluir cache.
     * @param {string} chave do cache
     * @returns {function} 
     * - executar
     * - executarAposMetodo
     */
    const excluir = (chave = enviarErro('chave do cache')) => {
        let _chave = chave;
        let _metodo = null;
        let _args = null;
        let _valor = null;
        /**
         * Remove do cache
         * @returns {Promise<any>}
         */
        const agora = async () => {
            if (_metodo) _valor = await _metodo(_args)
            cache.del(_chave);
            return (_valor)? _valor : true;
        }
        /**
         * Armazenar no cache o resultado da consulta do banco de dados
         * @param {string} metodo para consultar o banco de dados 
         * @param {object} args para execução do metodo
         * @returns {function} expirarCacheEm 
         */
        const aposMetodo = async (metodo = enviarErro('metodo a ser executado'), args = enviarErro('os argumentos do metodo informado')) => {
            if (typeof metodo !== 'function') enviarErro('metodo como função');
            _metodo = metodo;
            _args = args;
            return await agora();
        }
        return {
            agora,
            aposMetodo
        }
    }

    return {
        obter,
        incluir,
        excluir
    }
}