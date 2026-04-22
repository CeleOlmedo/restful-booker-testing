@feature_contact
Feature: Enviar mensaje de contacto
  # HU-03 | Cubre TC-03-001, TC-03-006, TC-03-012

  Background:
    Given el usuario navega a la página de contacto
    And la aplicación está accesible
    And el formulario de contacto está visible

  @HU-03 @TC-03-001 @happy_path
  Scenario: Envío exitoso con datos válidos
    When completa el formulario con datos de usuario "contactValid"
    And envia el formulario de contacto
    Then el sistema muestra confirmación observable de envío exitoso

  @HU-03 @TC-03-006 @negative
  Scenario: Envío con email inválido
    When completa el formulario con datos de usuario "contactInvalidEmail"
    And envia el formulario de contacto
    Then el sistema impide el envío
    And muestra el error con clave "invalidEmailHint" en el campo "Email"

  @HU-03 @TC-03-012 @smoke
  Scenario: Envío con todos los campos vacíos
    When completa el formulario con datos de usuario "contactEmpty"
    And envia el formulario de contacto
    Then el sistema impide el envío
    And los campos requeridos vacíos se muestran resaltados en rojo