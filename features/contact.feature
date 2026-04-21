Feature: Enviar mensaje de contacto
  # HU-03 | Cubre TC-03-001, TC-03-006, TC-03-012

  Background:
    Given la aplicación está accesible
    And  el formulario de contacto está visible

  Scenario: Envío exitoso con todos los datos válidos
    When completa el formulario con los siguientes datos:
      | Campo    | Valor              |
      | Nombre   | Ana Torres         |
      | Email    | ana@email.com      |
      | Teléfono | 12345678901        |
      | Asunto   | Consulta de reserva|
      | Mensaje  | Me gustaría saber si tienen disponibilidad para estas fechas. |
    And  envía el formulario
    Then el sistema muestra confirmación observable de envío exitoso

  Scenario: Envío rechazado por email sin formato válido
    When completa el formulario con email "anaemail.com"
    And  completa el resto de los campos con datos válidos
    And  intenta enviar el formulario
    Then el sistema impide el envío
    And  muestra el mensaje "Ingrese un email válido" en el campo email

  Scenario: Envío rechazado con todos los campos vacíos
    When no completa ningún campo del formulario
    And  intenta enviar el formulario
    Then el sistema impide el envío
    And  los campos requeridos vacíos se muestran resaltados en rojo