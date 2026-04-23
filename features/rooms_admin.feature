Feature: Gestión de habitaciones como administrador
  # HU-05 | Cubre TC-05-001, TC-05-004, TC-05-010

  Background:
    Given el administrador tiene sesión activa
    And está en el módulo Rooms

  @HU05 @TC-05-001 @happy_path
  Scenario: Crear habitación con datos válidos
    When selecciona la opción de crear habitación
    And  completa el formulario con datos de habitación "roomValid101"
    And  confirma la creación
    Then la habitación se crea sin errores y aparece en el listado administrativo con los datos ingresados

  @HU05 @TC-05-004 @negative
  Scenario: Creación de habitación con número duplicado es rechazada
    Given existe una habitación con número "roomDuplicate101" en el sistema
    When intenta crear una habitación con datos de habitación "roomDuplicate101"
    And  confirma la creación
    Then el sistema impide la creación y muestra el mensaje "roomDuplicate"

  @HU05 @TC-05-010 @happy_path
  Scenario: Cambio de descripción en admin se refleja en la vista pública
    Given existe una habitación en el listado administrativo
    When selecciona la habitación
    And  edita la descripción de la habitación con datos de usuario "roomDescriptionHolaMundo"
    And  guarda los cambios
    And  navega a la vista pública de la habitación
    Then la descripción mostrada coincide con "roomDescriptionHolaMundo"