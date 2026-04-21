Feature: Inicio y cierre de sesión administrador
  # HU-04 | Cubre TC-04-001, TC-04-002, TC-04-003

  Scenario: Login exitoso con credenciales válidas
    Given la aplicación está accesible
    And  el administrador navega al panel admin
    When ingresa usuario "admin" y contraseña "password"
    And  confirma el inicio de sesión
    Then el sistema concede acceso al área administrativa
    And  el panel muestra las funciones disponibles

  Scenario: Logout exitoso desde sesión activa
    Given el administrador tiene una sesión activa en el panel
    When ejecuta el cierre de sesión
    Then el sistema cierra la sesión correctamente
    And  el acceso a los módulos administrativos queda bloqueado

  Scenario: Acceso directo a ruta admin sin sesión activa es bloqueado
    Given no hay sesión de administrador activa
    When intenta acceder directamente a una URL del panel admin
    Then el sistema bloquea el acceso
    And  redirige al login sin exponer contenido administrativo