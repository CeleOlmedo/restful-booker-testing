Feature: Gestión de habitaciones como administrador
  # HU-05 | Cubre TC-05-001, TC-05-004, TC-05-010

  Background:
    Given el administrador tiene sesión activa
    And  está en el módulo Rooms

  @HU05 @TC-05-001 @happy_path
  Scenario: Crear habitación con datos válidos
    When selecciona la opción de crear habitación
    And  completa el formulario con los siguientes datos:
      | Campo        | Valor              |
      | Número       | 101                |
      | Tipo         | Double             |
      | Accesible    | true               |
      | Precio       | 150                |
      | Room Details | Wifi, TV, Radio   |
    And  confirma la creación
    Then la habitación se crea sin errores
    And  aparece en el listado administrativo con los datos ingresados

  @HU05 @TC-05-004 @negative
  Scenario: Creación de habitación con número duplicado es rechazada
    Given existe una habitación con número "101" en el sistema
    When intenta crear una habitación con los siguientes datos:
      | Campo        | Valor              |
      | Número       | 101                |
      | Tipo         | Double             |
      | Accesible    | true               |
      | Precio       | 150                |
      | Room Details | Wifi, TV, Radio   |
    And  confirma la creación
    Then el sistema impide la creación
    And  muestra el mensaje "Habitación duplicada, cargue un nuevo número"

  @HU05 @TC-05-010 @edge_case
  Scenario: Cambio de descripción en admin se refleja en la vista pública
    Given existe una habitación en el listado administrativo
    When edita la descripción de la habitación con el valor "Hola Mundo"
    And  guarda los cambios
    And  navega a la vista pública de la habitación
    Then la descripción mostrada es "Hola Mundo"
    And  no hay inconsistencias entre el panel admin y el frontend