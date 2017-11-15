Feature: A rota GET /v1/usuarios/:id tem como consultar um usuario através do id

  Background:
    Given Dado a URL do servidor http://localhost:3000
    And E o metodo GET e a rota v1/usuarios/:id

  Scenario: Consultar um usuario com o id invalida
    When Quando o pathParameter id for A
    Then Então o statusCode será 400
    And Então o campo code da mensagem de erro será validator error
    And Então o campo message da mensagem de erro será x

  Scenario: Consultar um usuario com o id não valido pela a model
    When Quando o pathParameter id for 123456
    Then Então o statusCode será 422
    And E o campo code[0] da mensagem de erro será semantic error
    And E o campo message[0] da mensagem de erro será x

  Scenario: Consultar um usuario com o id valido porem inexistente 
    When Quando o pathParameter id for 2
    Then Então o statusCode será 204

  @sucesso
  Scenario: Consultar um usuario com o id valido 
    When Quando o pathParameter id for 1
    Then Então o statusCode será 200
    And E o campo id será 00001
    And E o campo nome será João da Silva
    And E o campo idade será 23
    And E o campo sexo será masculino

