# Día 38 Proyecto Final - Análisis y Planificación - Mustaff, Cabrera, Quintana y Olmedo

**Objetivo**
Validar el correcto funcionamiento del sistema de reservas de la plataforma Restful Booker Platform, cubriendo los flujos críticos de usuario y administrador mediante pruebas manuales exploratorias, documentación BDD en Gherkin y automatización UI y API. El proyecto busca demostrar una estrategia QA integral, reproducible y profesional, aplicando las prácticas aprendidas durante el curso.

**Alcance:**

Dentro del alcance:
- Flujos públicos: reserva de habitación, verificación de disponibilidad, envío de mensaje de contacto
- Flujos administrativos: autenticación, gestión de habitaciones, gestión de mensajes y contenido de home
- Automatización UI con Playwright + Cucumber (Gherkin)
- Automatización de API con Axios sobre los endpoints de la Restful Booker Platform API
- Documentación de casos de prueba en Azure DevOps
- Reportes de ejecución con Allure

**Fuera del alcance:**
- Testing de performance o carga
- Testing de seguridad avanzado (penetration testing)
- Compatibilidad cross-browser exhaustiva
- Flujos de pago

**Flujos Críticos Priorizados:**

| ID   | Flujo                                   | Área    | Prioridad   |
|------|-----------------------------------------|---------|-------------|
| F-01 | Reserva de habitación                   | Público | Alta        |
| F-02 | Verificación de disponibilidad          | Público | Alta        |
| F-03 | Envío de mensaje de contacto            | Público | Alta        |
| F-04 | Autenticación y sesión administrativa   | Admin   | Alta        |
| F-05 | Gestión de habitaciones                 | Admin   | Media-Alta  |
| F-06 | Gestión de mensajes y contenido en home | Admin   | Media       |

**Detalle por flujo:**

F-01 — Reserva de habitación: Flujo extremo a extremo de mayor impacto en negocio (ocupación, ingresos, experiencia del huésped). Incluye selección de fechas, completado de datos del huésped y verificación del resultado (confirmación o error). Riesgos identificados: posibilidad de reservar fechas pasadas, conflicto al reservar fechas ya ocupadas, y validaciones de campos (nombre, apellido, email, teléfono).

F-02 — Verificación de disponibilidad: Condiciona directamente la decisión de reserva. Se identificó un defecto/regresión: pérdida de imagen y descripción en las tarjetas de habitación tras verificar disponibilidad, con impacto directo en la estabilidad de los tests UI y en la experiencia de usuario.

F-03 — Envío de mensaje de contacto: Flujo de comunicación con el establecimiento con reglas de entrada claras (nombre, email, teléfono, asunto, mensaje). Módulo ideal para tablas de decisión, casos negativos y Scenario Outline con múltiples combinaciones de datos.

F-04 — Autenticación y sesión administrativa: Control de acceso a todos los módulos sensibles del sistema. Cubre login válido e inválido, persistencia de sesión esperada durante la demo y cierre de sesión correcto.

F-05 — Gestión de habitaciones: Riesgo operativo por creación, edición y listado de habitaciones. Caso negativo y/o defecto a contemplar: duplicación de habitación con mismo número o nombre, según regla de negocio definida por el equipo.

F-06 — Gestión de mensajes y contenido en home: (alcance condicional) Impacto en marketing y comunicación del establecimiento. Se automatizará de forma selectiva si no introduce fragilidad en los tests. En caso contrario, se cubre con exploración manual y documentación en Azure DevOps.

**Tipos de Pruebas:**

- Exploración manual — Es el punto de partida de la estrategia. Permite recorrer la aplicación libremente, sin casos predefinidos, para detectar comportamientos inesperados, inconsistencias visuales y defectos que difícilmente surgen en pruebas estructuradas. Su principal ventaja es la velocidad para identificar riesgos antes de invertir tiempo en automatización.
- Documentación BDD — Gherkin — Los flujos críticos se documentan como features y escenarios en lenguaje Gherkin. Se eligió este enfoque porque permite que tanto el equipo técnico como perfiles no técnicos entiendan qué se está probando y por qué, funcionando como documentación viva del sistema. Además, sirve como base directa para la automatización con Cucumber, evitando duplicar esfuerzo.
- Automatización UI — Implementada con Playwright + Cucumber en JavaScript, siguiendo el patrón Page Object Model. Se eligió Playwright por su velocidad, su soporte nativo para aplicaciones modernas y su capacidad de ejecutar tests en paralelo. Esta capa permite detectar regresiones de forma rápida y repetible ante cualquier cambio en la aplicación, con reportes visuales generados por Allure.
- Automatización API — Implementada con Axios sobre los endpoints de la Postman Collection de Restful Booker Platform. Se eligió cubrir la API porque permite validar la lógica de negocio de forma independiente a la interfaz, es más estable ante cambios visuales y permite detectar errores en la capa de datos antes de que impacten en el usuario final.


**Criterio de Éxito:**

El proyecto se considera terminado para la demo cuando se cumplan las siguientes condiciones:

- Los flujos F-01 a F-06 tienen al menos un escenario Gherkin automatizado y ejecutable
- Los tests de UI pasan en una ejecución limpia sin errores de infraestructura
- Los tests de API cubren los endpoints principales de booking (CRUD + auth)
- Los casos de prueba están cargados en Azure DevOps con resultado de ejecución registrado
- El reporte de Allure muestra resultados legibles y diferenciados por flujo
- El repositorio tiene README completo, estructura ordenada y el equipo puede ejecutar los tests siguiendo las instrucciones documentadas
