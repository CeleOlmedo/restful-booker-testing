Feature: Reserva de habitación
  # HU-01 | Cubre TC-01-001, TC-01-011, TC-01-013

  Background:
    Given la aplicación está accesible
    And  el usuario está en la página principal

  Scenario: Reserva exitosa con datos válidos
    When selecciona una habitación disponible
    And  selecciona fecha de check-in futura
    And  selecciona fecha de check-out dos días después del check-in
    And  completa el formulario con los siguientes datos:
      | Campo    | Valor              |
      | Nombre   | Juan               |
      | Apellido | Garcia             |
      | Email    | juan@email.com     |
      | Teléfono | 12345678901        |
    And  confirma la reserva
    Then el sistema muestra confirmación observable de reserva exitosa

  Scenario: Reserva rechazada cuando la fecha de salida es anterior a la de entrada
    Given hay una habitación disponible seleccionada
    When ingresa una fecha de check-out anterior a la fecha de check-in
    And  completa el formulario con datos válidos
    And  intenta confirmar la reserva
    Then el sistema impide la creación de la reserva
    And  muestra el mensaje "Ingrese fechas válidas"

  Scenario: Reserva rechazada por conflicto de disponibilidad en fechas ocupadas
    Given existe una reserva previa en el rango de fechas a utilizar
    When selecciona la misma habitación con las mismas fechas ya ocupadas
    And  completa el formulario con datos válidos
    And  intenta confirmar la reserva
    Then el sistema impide la creación de la reserva
    And  muestra el mensaje "Fechas ocupadas, seleccione fechas disponibles"