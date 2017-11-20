# Motor de REST-API com SPA em Node.js (Em Desenvolvimento)
Motor de API RESTful com MongoDb e Single-Page-Application em Node.js.  
Utilizando praticas de TDD (usando Mocha) e BDD (usando Cucumber).

## Status
- [x] Motor de REST-APIs disponivel
- [x] Servidor de arquivos estaticos
- [x] Geração de LOG
- [x] API RESTful exemplo (parcial - Não incluido a consulta ao banco de dados)
- [x] Cobertura de testes (Mocha e NYC)
- [ ] Testes integrados (Cucumber)
- [x] Acesso ao banco de dados
- [ ] Documentação (Open API Especification)
- [ ] Single Page Application executando

## Requisitos
* Node.js versão >= 8.9 (LTS).

## Orientações
Na pasta "src" do projeto, existe uma pasta chamada "routes", onde ficam todas as apis disponiveis.  
As pastas que o nome se iniciam com "route-" são as apis.
Utilizar a "route-api-v1-usuarios-id-get" como exemplo para criação das demais.

## Instruções
Executar apenas na primeira vez a instalação dos pacotes necessarios:
1. Acessar a pasta "src";
2. Executar o comando: "npm install".  

Após instalação dos pacotes, executar os comandos abaixo:
1. Acessar a pasta "src";
2. Executar o comando: "npm start".
