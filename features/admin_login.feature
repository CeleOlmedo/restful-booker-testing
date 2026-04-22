@feature_admin_login @modulo_admin
Feature: Inicio y cierre de sesión administrador
  # HU-04 | Cubre TC-04-001, TC-04-002, TC-04-004, TC-04-005, TC-04-006, TC-04-007, TC-04-008

  Background:
    Given la aplicación está accesible
    And el administrador navega al panel admin

  @HU-04 @TC-04-001 @happy_path
  Scenario: Login exitoso con credenciales válidas
    When completa el formulario de login con:
      | Campo      | Valor    |
      | Usuario    | admin    |
      | Contraseña | password |
    And confirma el inicio de sesión
    Then el sistema concede acceso al área administrativa
    And el panel muestra las funciones disponibles

  @HU-04 @TC-04-002 @happy_path
  Scenario: Logout exitoso desde sesión activa
    Given el administrador tiene una sesión activa en el panel
    When ejecuta el cierre de sesión
    Then el sistema cierra la sesión correctamente
    And el acceso a los módulos administrativos queda bloqueado

  @HU-04 @negative @TC-04-004 @TC-04-005 @TC-04-006 @TC-04-007 @TC-04-008
  Scenario Outline: Validaciones de login inválido
    When completa el formulario de login con:
      | Campo      | Valor        |
      | Usuario    | <usuario>    |
      | Contraseña | <contraseña> |
    And confirma el inicio de sesión
    Then el sistema muestra el mensaje "<mensaje_error>"
    And el sistema no concede acceso al área administrativa

    Examples: Combinaciones inválidas de usuario y contraseña
      | usuario            | contraseña | mensaje_error                |
      | admin              | wrongpass  | Credenciales inválidas       |
      | usuarioinexistente | password   | Credenciales inválidas       |
      |                    |            | Ingrese usuario y contraseña |
      |                    | password   | Ingrese usuario y contraseña |
      | admin              |            | Ingrese usuario y contraseña |