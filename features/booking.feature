@feature_booking
Feature: Reserva de habitación
  # HU-01 | Cubre TC-01-001, TC-01-011, TC-01-013

  Background:
    Given la aplicación está accesible
    And el usuario está en la página principal

  @HU-01 @TC-01-001 @happy_path
  Scenario: Reserva exitosa con datos válidos
    When selecciona una habitación disponible
    And selecciona un rango de fechas de estadía válidas
    And completa el formulario con datos de usuario "bookingGuestValid"
    And confirma la reserva
    Then el sistema muestra confirmación "bookingConfirmed"

  @HU-01 @TC-01-011 @negative
  Scenario: Reserva rechazada por fechas pasadas
    Given hay una habitación disponible seleccionada
    When ingresa un rango de fechas pasadas a la actual
    And completa el formulario con datos de usuario "bookingGuestValid"
    And intenta confirmar la reserva
    Then el sistema impide la creación de la reserva
    And muestra el mensaje "bookingInvalidDates"

  @HU-01 @TC-01-013 @negative
  Scenario: Reserva rechazada por conflicto de disponibilidad en fechas ocupadas
    Given existe una reserva previa en el rango de fechas a utilizar
    When selecciona la misma habitación con las mismas fechas ya ocupadas
    And completa el formulario con datos de usuario "bookingGuestValid"
    And intenta confirmar la reserva
    Then el sistema impide la creación de la reserva
    And muestra el mensaje "bookingOccupiedDates"