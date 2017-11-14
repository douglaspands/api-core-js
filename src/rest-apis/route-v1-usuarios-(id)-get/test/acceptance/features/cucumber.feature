Feature: A rota GET /v1/usuarios/:id tem como consultar um usuario através do id

  Background:
    Given 
    And today is 2015-11-18

  Scenario: Consultar um usuario com a sintax do id invalida.
    Given Jeff has bought a microwave for $100
    And he has a receipt
    When he returns the microwave
    Then Jeff should be refunded $100