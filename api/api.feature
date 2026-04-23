Feature: CRUD de bookings en Restful Booker

  Background:
    Given que tengo credenciales válidas de Restful Booker

  Scenario: Listar booking ids (GET)
    When consulto los booking ids
    Then la API responde con código 200 en el listado
    And obtengo una lista de booking ids

  Scenario: Crear booking (POST)
    When creo un nuevo booking válido
    Then obtengo un bookingid numérico
    And el booking creado contiene los mismos datos que envié

  Scenario: Actualizar booking (PUT)
    Given que ya existe un booking creado en la API
    And me autentico contra la API de Restful Booker
    When actualizo los datos del booking con información válida
    Then la API responde con código 200 en la actualización
    And el booking actualizado refleja los nuevos datos

  Scenario: Eliminar booking (DELETE)
    Given que ya existe un booking creado en la API
    And me autentico contra la API de Restful Booker
    When elimino el booking por su id
    Then la API responde indicando que el borrado fue exitoso
    And si intento consultar el booking eliminado
    Then obtengo la respuesta esperada para un booking inexistente