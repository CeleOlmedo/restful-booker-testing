Feature: Gestión de habitaciones como administrador
  # HU-05 | Cubre TC-05-001, TC-05-004, TC-05-010

  Background:
    Given el administrador tiene sesión activa
    And  está en el módulo Rooms

  @HU05 @TC-05-001 @happy_path
  Scenario: Crear habitación con datos válidos
    When selecciona la opción de crear habitación
    And  completa el formulario con datos de usuario "roomValid101"
    And  confirma la creación
    Then la habitación se crea sin errores
    And  aparece en el listado administrativo con los datos ingresados

  @HU05 @TC-05-004 @negative
  Scenario: Creación de habitación con número duplicado es rechazada
    Given existe una habitación con número del dataset "roomDuplicate101" en el sistema
    When intenta crear una habitación con datos de usuario "roomDuplicate101"
    And  confirma la creación
    Then el sistema impide la creación
    And  muestra el mensaje de rooms con clave "roomDuplicate"

  @HU05 @TC-05-010 @edge_case
  Scenario: Cambio de descripción en admin se refleja en la vista pública
    Given existe una habitación en el listado administrativo
    When edita la descripción de la habitación con datos de usuario "roomDescriptionHolaMundo"
    And  guarda los cambios
    And  navega a la vista pública de la habitación
    Then la descripción mostrada coincide con el dataset "roomDescriptionHolaMundo"
    And  no hay inconsistencias entre el panel admin y el frontend