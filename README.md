# Node.js Core REST/GraphQL API com NoSQL MongoDB e cache utilizando Redis

Motor de API REST/GraphQL com MongoDB e Redis em Node.js.

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

### API REST

-- Documentação em desenvolvimento   
-- Testes em desenvolvimento

### API GraphQL

-- Documentação em desenvolvimento   
-- Testes em desenvolvimento

## Configuração Inicial

### 1. Docker-Compose

Foi gerado 3 scripts yaml para rodar com o *docker-compose*
- **stack-db.yaml**: Esse script baixa e executa o MongoDB e o Redis configurado para uma melhor utilização no desenvolvimento do projeto.   Utilizando esse script, é necessario baixar as dependencias e executar o server em Node.js;
- **stack-dev.yaml**: Esse script baixa e executa o MongoDB e o Redis, baixa o Node.js e cria uma imagem e container com o server dentro. Utiliza as configurações para uma melhor utilização no desenvolvimento do projeto. Tambem é disponibilzado a interface GraphiQL, para querys e mutations de APIs GraphQL.;
- **stack-prd.yaml**: Esse script baixa e executa o MongoDB e o Redis, baixa o Node.js e cria uma imagem e container com o server dentro. Utiliza as configurações para execução em produção;

Eu criei esses scripts para ajudar em cada fase do desenvolvimento.

### 2. Inicializando a aplicação 

```console
$ docker-compose -f ./stack-prd.yaml up
```

### 3. Iniciando a aplicação sem o Docker-Compose (opcional)

Primeiro vamos iniciar a imagem e o container do MongoDB e do Redis, utilizando um script que esta na raiz do projeto chamado de **stack-db.yaml**.
```console
$ docker-compose -f ./compose-db.yaml up
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
