# Node.js Core REST/GraphQL API com NoSQL MongoDB

Motor de API REST/GraphQL com MongoDB em Node.js.

## Objetivo  

O objetivo desse projeto é facilitar e acelerar o desenvolvimento de APIs REST ou GraphQL de pequeno e medio porte.
Onde funcionalidades comuns que desprendem de tempo são abreviados, para aumentar o foco na atividade fim e menos na atividade meio (tecnico).

## Futuro

Esse projeto tambem é uma forma de apresentar meu conhecimento. Sendo assim, estarei sempre aplicando novas abordagens, atualizando meus conhecimentos nele e aplicando novas tecnologias (utilizando a plataforma Node.js que gosto tanto). Sempre vou manter exemplos funcionais, para que possam usufruir e testar.

## Premissas

Para iniciar a utilização desse motor de APIs, é necessario 3 coisas:
1. Ter o NoSQL [MongoDB](https://mongodb.github.io/node-mongodb-native/) na versão >= 4 instalado (se não tiver, as APIs vão funcionar parcialmente).   
*Caso tenha o Docker instalado, não é necessario a instalação do MongoDB;
2. Ter o [Node.js](https://nodejs.org/en/) na versão >= 8.10 instalado;

## APIs REST/GraphQL de exemplo

No diretorio *src/main/api* existem 2 pastas: *rest* e *graphql* (as APIs estão nelas respectivamente).  
No diretorio de cada API, contem a pasta de *test*, onde contem os testes utilizando os frameworks *mocha* para validação e o *nyc* para mostrar a cobertura teste numa forma visual.

## Configuração Inicial

Faz um tempo que eu estava planejando usar a tecnologia de containers do Docker para empacotar a aplicação e usar tambem uma imagem do MongoDB para evitar instalação do mesmo.   
Então fiz o seguinte, vou manter a configuração manual (que já estava) e adicionar uma configuração automatizada com containers do Docker.

### 1. Configuração Automatizada (Docker)

Para esse topico, eu criei duas automatizações utilizando o Docker:
1. Obter as imagens do Node.js e do MongoDB, encapsular esse projeto em um container e executar tudo integrado e orquestrado pelo docker-compose;
2. Obter apenas a imagem do MongoDB, e usar o Node.js instalado. Dessa forma é mais confortavel para desenvolver e customizar o codigo;

#### 1.1 Container da aplicação e orquestração via Docker-Compose

Foi gerado script **compose-stack-prd.yaml** (**compose-stack-dev.yaml** disponibiliza o GraphiQL) com todo o processo de download da imagem do Node.js e criação de um container com codigo fonte da aplicação. Nas sequencia ele vai baixar a imagem do MongoDB e criar um container com ele.
Após a criação dos containers, ele vai montar uma rede dentro do Docker e subir os containers na seguinte sequencia: mongo e depois o core-api-js.
```console
$ docker-compose -f ./compose-stack-prd.yaml up
```

#### 1.2 Executar apenas a imagem do MongoDB

Primeiro vamos iniciar a imagem e o container do MongoDB utilizando um script que esta na raiz do projeto chamado de **compose-mongo.yaml**.
```console
$ docker-compose -f ./compose-mongo.yaml up
```
Feito isso ele vai subir uma instancia do MongoDB, e vai armazenar o volume do banco de dados na pasta: "**./data**". Assim, sempre que precisar criar uma nova instancia do MongoDB, ele sempre vai utilizar a mesma estrutura e dados criado.   

Como todo projeto em Node.js, é necessario instalar as dependencias antes:
```console
$ cd ./src
$ npm i
```
E na sequencia, para iniciar o motor é necessario executar:
```console
$ npm start
```

### 2. Configuração Manual

Se tiver o MongoDB instalado, recomendo criar repositorio do banco de dados dentro do projeto com os seguintes comandos:
```console
$ mkdir ./data
$ mongod --dbpath ./data
```
Como todo projeto em Node.js, é necessario instalar as dependencias antes:
```console
$ cd ./src
$ npm i
```
E na sequencia, para iniciar o motor é necessario executar:
```console
$ npm start
```

## Log de Inicialização

Ao executar, vai aparecer no console conforme a demonstração abaixo:
```console
[info] 2018-08-31 19.25.42.772 mongodb-connect - MongoDB ativado com sucesso na url: mongodb://mongodb:27017
[info] 2018-08-31 19.25.42.928 server - Executando "core-api-js@2.2.5" em http://localhost:3000 (production)
[info] 2018-08-31 19.25.42.929 server - REST registrado....: /v1/funcionarios [get]
[info] 2018-08-31 19.25.42.930 server - REST registrado....: /v1/funcionarios/:id [delete]
[info] 2018-08-31 19.25.42.930 server - REST registrado....: /v1/funcionarios/:id [get]
[info] 2018-08-31 19.25.42.931 server - REST registrado....: /v1/funcionarios/:id [put]
[info] 2018-08-31 19.25.42.931 server - REST registrado....: /v1/funcionarios [post]
[info] 2018-08-31 19.25.42.931 server - GraphQL registrado.: obterFuncionario
[info] 2018-08-31 19.25.42.932 server - GraphQL registrado.: criarFuncionario
[info] 2018-08-31 19.25.42.932 server - GraphQL registrado.: listarFuncionarios
[info] 2018-08-31 19.25.42.933 server - GraphQL registrado.: atualizarFuncionario
[info] 2018-08-31 19.25.42.933 server - GraphQL registrado.: removerFuncionario
[info] 2018-08-31 19.25.42.933 server - GraphQL registrado.: pesquisarFuncionarios
[info] 2018-08-31 19.25.42.934 health-check - Health-Check registrado: http://localhost:3001
```
## Exemplos de request utilizando API GraphQL
Os exemplos abaixo são executados no GraphiQL (interface grafica, disponivel apenas em desenvolvimento).
GraphiQL disponivel na rota: http://localhost:3000/graphql
```graphql
# Inclusao de funcionario
mutation example1 {
  criarFuncionario(input:{
    nome: "Douglas"
    sobrenome: "Silva"
    cidade: "São Paulo"
    estado: "SP"
    telefone: "1170707070"
    email: "dougla.silva@enterprise.com"
  }) {
    _id
    nome
    sobrenome
  }
}
# Listar funcionarios
query example2 {
  listarFuncionarios {
    _id
    nome
    cidade 
  }
}
# Pesquisar funcionarios
query example3 {
  pesquisarFuncionarios (
    estado: "SP"
  ){
    _id
    nome
    cidade 
  }
}
# Consultar funcionarios pelo ID
query example4 {
  obterFuncionario (_id: ?) {
    nome
    cidade 
  }
}
# Atualizar funcionario
mutation example5 {
  atualizarFuncionario(
    _id: ?
    cidade: "Maceio"
    estado: "Alagoas"
  }) {
    nome
    cidade
  }
}
# Excluir funcionario
mutation example6 {
  excluirFuncionario(
    _id: ?
  })
}
```
## Exemplos de request utilizando API REST
Os exemplos abaixos são executados via POSTMAN:
```yaml
# Inclusão de funcionario
- rota: [POST] http://localhost:3000/v1/funcionarios
  payload:
    {
        "nome": "Douglas",
        "sobrenome": "Silva",
        "cidade": "São Paulo",
        "estado": "SP",
        "telefone": "1170707070",
        "email": "dougla.silva@enterprise.com"
    }
# Listar funcionarios
- rota: [GET] http://localhost:3000/v1/funcionarios
# Obter funcionario especifico
- rota: [GET] http://localhost:3000/v1/funcionarios/:_id
# Atualizar funcionario especifico
- rota: [PUT] http://localhost:3000/v1/funcionarios/:_id
  payload:
    {
        "nome": "Douglas",
        "sobrenome": "Silva",
        "cidade": "Maceio",
        "estado": "AL",
        "telefone": "1170707070",
        "email": "dougla.silva@enterprise.com"
    }
# Excluir funcionario especifico
- rota: [DELETE] http://localhost:3000/v1/funcionarios/:_id
```
