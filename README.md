# API REST/GraphQL CORE JS

Motor de API REST/GraphQL em Node.js com MongoDB e Redis.   
Foi incluido o Elastic-Search e o Kibana para consulta de log (opcional).

## Objetivo  

O objetivo desse projeto é facilitar e acelerar o desenvolvimento de APIs REST ou GraphQL de pequeno e medio porte.
Onde funcionalidades comuns que desprendem de tempo são abreviados, para aumentar o foco na atividade fim e menos na atividade meio (tecnico).

## Futuro

Esse projeto tambem é uma forma de apresentar meu conhecimento. Sendo assim, estarei sempre aplicando novas abordagens, atualizando meus conhecimentos nele e aplicando novas tecnologias (utilizando a plataforma Node.js que gosto tanto). Sempre vou manter exemplos funcionais, para que possam usufruir e testar.

## Premissas

Para iniciar a utilização desse motor de APIs, é necessario 2 coisas:
1. Ter o [Node.js](https://nodejs.org/en/) na versão >= 8.10 instalado;
2. Ter o [Docker](https://www.docker.com/) instalado e atualizado; 

## APIs REST/GraphQL de exemplo

No diretorio **src/main/api** existem 2 pastas: **rest** e **graphql** (as APIs estão nelas respectivamente).  
No diretorio de cada API, contem a pasta de *test*, onde contem os testes utilizando os frameworks *mocha* para validação e o *nyc* para mostrar a cobertura teste numa forma visual.

### Objeto de contexto

Praticamente todos os modulos utilizam o objeto "Context", ele contem as seguintes funções:
```yaml
## Objeto de apoio
Context:
  ## "get" é o nó principal 
  get:
    ## nó que informa que o modulo é local.
    self: 
      ## nó que informa que o modulo local precisa do Context.
      context: 
        ## funcao onde é passado a pasta e o nome do modulo e executa a funcao primaria passando o Context. Ex service/funcionario
        module: 
      ## funcao onde é passado a pasta e o nome do modulo
      module:
    ## funcao onde é passado o nome da variavel que quer obter do servidor 
    server: 
    ## funcao igual o comando "require" nativo
    module: 
```
Exemplo de camadas:
```javascript
//// conector do mongo
const mongo = context.get.server('mongo');
//// conector do redis 
const redis = context.get.server('redis');
//// logger 
const logger = context.get.server('logger');
//// obtendo framework do node_modules
const _ = context.get.module('lodash');
//// chamando um modulo simples
// /service/funcionario.js
module.exports.consultar = function(id) {
  return 123;
}
// /controller.js
const service = context.get.self.module('/service/funcionario');
service.consultar(123);
//// chamando um modulo que precisa do context
// /service/funcionario.js
module.exports = (context) => {
  const consultar = function(id) {
    const logger = context.get.server('logger');
    logger.info('executando a consulta');
    return 123;
  }
  return { consultar };
}
// /controller.js
const service = context.get.self.context.module('/service/funcionario');
service.consultar(123);
```

## Configuração Inicial

### 1. Docker-Compose

Foi gerado 3 scripts yaml para rodar com o *docker-compose*
- **stack-db.yaml**: Esse script baixa e executa o MongoDB e o Redis configurado para uma melhor utilização no desenvolvimento do projeto.   Utilizando esse script, é necessario baixar as dependencias e executar o server em Node.js;
- **docker-compose.yaml** **(script principal)**: Esse script baixa baixa o Node.js e cria uma imagem e container com o server dentro;
- **stack-full.yaml**: Esse script baixa e executa o MongoDB, Redis, baixa o Node.js e cria uma imagem e container com o server dentro. Utiliza as configurações para execução em produção;

Eu criei esses scripts para ajudar em cada fase do desenvolvimento.

### 2. Inicializando a aplicação 

```console
$ docker-compose -f ./stack-full.yaml up
```

### 3. Iniciando a aplicação sem o Docker-Compose (opcional)

Primeiro vamos iniciar a imagem e o container do MongoDB e do Redis, utilizando um script que esta na raiz do projeto chamado de **stack-db.yaml**.
```console
$ docker-compose -f ./stack-db.yaml up
```
Feito isso ele vai subir uma instancia do MongoDB, e vai armazenar no volume do Docker. Assim, a proxima vez que for subir o script do docker-compose, os dados estarão persistidos.   
Para excluir os dados do volume do Docker:
```console
$ docker-compose -f ./stack-db.yaml down -v
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
```bash
[info] 2018-09-12 20.34.15.299 express-cache - Redis (cache) ativado com sucesso na url: redis://localhost:6379
[info] 2018-09-12 20.34.15.316 express-mongodb - MongoDB ativado com sucesso na url: mongodb://localhost:27017
[debug] 2018-09-12 20.34.16.488 graphql-funcionarios - Foi solicitado o modulo "services/funcionario-service".
[debug] 2018-09-12 20.34.16.489 graphql-funcionarios - Foi solicitado o modulo "utils/mongodb-crud".
[debug] 2018-09-12 20.34.16.490 graphql-funcionarios - Foi solicitado a variavel "mongodb" do servidor.
[debug] 2018-09-12 20.34.16.490 graphql-funcionarios - Foi solicitado o modulo "modules/validador-opcional".
[debug] 2018-09-12 20.34.16.491 graphql-funcionarios - Foi solicitado o modulo "utils/validator".
[debug] 2018-09-12 20.34.16.491 graphql-funcionarios - Foi solicitado o modulo "modules/validador-insert".
[debug] 2018-09-12 20.34.16.492 graphql-funcionarios - Foi solicitado o modulo "utils/validator".
[debug] 2018-09-12 20.34.16.492 graphql-funcionarios - Foi solicitado o modulo "modules/validador-update".
[debug] 2018-09-12 20.34.16.493 graphql-funcionarios - Foi solicitado o modulo "utils/validator".
[debug] 2018-09-12 20.34.16.493 graphql-funcionarios - Foi solicitado o modulo "utils/cache-crud".
[debug] 2018-09-12 20.34.16.494 graphql-funcionarios - Foi solicitado a variavel "cache" do servidor.
[info] 2018-09-12 20.34.16.518 server - Executando "api-core-js@2.7.1" em http://localhost:3000 (develop) (pid:32632) 
[debug] 2018-09-12 20.34.16.519 server - GraphQL IDE disponivel em http://localhost:3000/graphql
[debug] 2018-09-12 20.34.16.519 server - REST registrado....: /v1/funcionarios [get]
[debug] 2018-09-12 20.34.16.519 server - REST registrado....: /v1/funcionarios/:_id [delete]
[debug] 2018-09-12 20.34.16.520 server - REST registrado....: /v1/funcionarios/:_id [get]
[debug] 2018-09-12 20.34.16.520 server - REST registrado....: /v1/funcionarios/:id [put]
[debug] 2018-09-12 20.34.16.521 server - REST registrado....: /v1/funcionarios [post]
[debug] 2018-09-12 20.34.16.521 server - GraphQL registrado.: obterFuncionario
[debug] 2018-09-12 20.34.16.522 server - GraphQL registrado.: criarFuncionario
[debug] 2018-09-12 20.34.16.522 server - GraphQL registrado.: atualizarFuncionario
[debug] 2018-09-12 20.34.16.523 server - GraphQL registrado.: removerFuncionario
[debug] 2018-09-12 20.34.16.523 server - GraphQL registrado.: pesquisarFuncionarios
[info] 2018-09-12 20.34.16.525 health-check - Rota registrada: http://localhost:3001 (pid:32632)

```

## Exemplos de request utilizando API GraphQL
Os exemplos abaixo são executados no GraphiQL (interface grafica, disponivel apenas em desenvolvimento).
GraphiQL disponivel na rota: http://localhost:3000/graphiql
```graphql
# Inclusao de funcionario
mutation example1 {
  criarFuncionario(funcionario:{
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
