# Node.js Core REST/GraphQL API

Motor de API REST/GraphQL com MongoDB em Node.js.

## Objetivo  

O objetivo desse projeto é facilitar e acelerar o desenvolvimento de APIs REST ou GraphQL de pequeno e medio porte.
Onde funcionalidades comuns que desprendem de tempo são abreviados, para aumentar o foco na atividade fim e menos na atividade meio (tecnico).

## Futuro

Esse projeto tambem é uma forma de apresentar meu conhecimento. Sendo assim, estarei sempre aplicando novas abordagens, atualizando meus conhecimentos nele e aplicando novas tecnologias (utilizando a plataforma Node.js que gosto tanto). Sempre vou manter exemplos funcionais, para que possam usufruir e testar.

## Premissas

Para iniciar a utilização desse motor de APIs, é necessario 3 coisas:   
1. Ter o banco MongoDB instalado na maquina (se não tiver, as APIs vão funcionar parcialmente);
2. Ter o Node.js instalado;

## APIs REST/GraphQL de exemplo

No diretorio *src/main/api* existem 2 pastas: *rest* e *graphql* (as APIs estão nelas respectivamente).  
No diretorio de cada API, contem a pasta de *test*, onde contem os testes utilizando os frameworks *mocha* para validação e o *nyc* para mostrar a cobertura teste numa forma visual.

## Configuração Inicial

Como todo projeto em Node.js, é necessario instalar as dependencias antes:
```console
$ cd core-api-js/src/
$ npm i
```
Se tiver o MongoDB instalado, recomendo criar repositorio do banco de dados dentro do projeto com os seguintes comandos:
```console
$ cd core-api-js
$ mkdir data
$ mongod --dbpath ./data
```

## Iniciando o motor

Para iniciar o motor, é necessario executar:
```console
$ cd core-api-js/src/
$ npm start
```
Ao executar, vai aparecer no console conforme a demonstração abaixo:
```console
[info] 2018-03-20 23.31.33.138 mongodb-connect - MongoDB ativado com sucesso!
[debug] 2018-03-20 23.31.33.276 graphql-funcionarios - Foi solicitado o modulo "services/funcionario-crud".
[debug] 2018-03-20 23.31.33.277 graphql-funcionarios - Foi solicitado o modulo "utils/mongodb-crud".
[debug] 2018-03-20 23.31.33.278 graphql-funcionarios - Foi solicitado a variavel "mongodb" do servidor.
[debug] 2018-03-20 23.31.33.278 graphql-funcionarios - Foi solicitado a variavel "logger" do servidor.
[debug] 2018-03-20 23.31.33.278 graphql-funcionarios - Foi solicitado o modulo "modules/form".
[debug] 2018-03-20 23.31.33.279 graphql-funcionarios - Foi solicitado o modulo "utils/validator".
[info] 2018-03-20 23.31.33.302 server - Executando "core-api-js@2.1.2" em http://localhost:3000 (develop)
[info] 2018-03-20 23.31.33.303 server - GraphQL IDE disponivel em http://localhost:3000/graphql
[info] 2018-03-20 23.31.33.303 server - REST registrado....: /v1/funcionarios [get]
[info] 2018-03-20 23.31.33.303 server - REST registrado....: /v1/funcionarios/:id [delete]
[info] 2018-03-20 23.31.33.303 server - REST registrado....: /v1/funcionarios/:id [get]
[info] 2018-03-20 23.31.33.304 server - REST registrado....: /v1/funcionarios/:id [put]
[info] 2018-03-20 23.31.33.304 server - REST registrado....: /v1/funcionarios [post]
[info] 2018-03-20 23.31.33.304 server - GraphQL registrado.: obterFuncionario
[info] 2018-03-20 23.31.33.304 server - GraphQL registrado.: criarFuncionario
[info] 2018-03-20 23.31.33.304 server - GraphQL registrado.: listarFuncionarios
[info] 2018-03-20 23.31.33.305 server - GraphQL registrado.: atualizarFuncionario
[info] 2018-03-20 23.31.33.305 server - GraphQL registrado.: removerFuncionario
[info] 2018-03-20 23.31.33.305 server - GraphQL registrado.: pesquisarFuncionarios
[info] 2018-03-20 23.31.33.307 server - Rota Health-Check..: /check [*]
```
