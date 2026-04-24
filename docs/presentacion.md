# Guión de presentación — Proyecto Restful Booker Testing

**Aplicación objetivo:** [Restful Booker Platform](https://automationintesting.online/)
**Equipo:** Noelia Mustaff · Celeste Olmedo · Martín Cabrera (Academia C&S)
**Stack:** Playwright + Cucumber (BDD, UI) · Axios (API) · POM · Reportes HTML de Cucumber

---

## Reparto general

| Parte | Integrante | Temas |
|-------|------------|-------|
| A – 1 | **Noelia Mustaff** | Introducción · Análisis de la aplicación · Estrategia · TC-01 |
| A – 2 | **Celeste Olmedo** | Historias de Usuario · Casos de prueba · Tipos de prueba · TC-03 |
| A – 3 | **Martín Cabrera** | Azure DevOps · Repositorio · TC-05 |
| B – 1 | **Noelia Mustaff** | POM · Selectores · Pages |
| B – 2 | **Celeste Olmedo** | Cucumber · Features · Steps |
| B – 3 | **Martín Cabrera** | API · Reportes · Cierre |

---

# Parte A — Análisis, planificación y trazabilidad

---

## Noelia Mustaff — Introducción, análisis de la aplicación, estrategia y TC-01

### Introducción al proyecto

El proyecto consiste en validar de forma estructurada los flujos principales de **Restful Booker Platform**, una aplicación de reservas hoteleras con panel de administración. El objetivo es demostrar una estrategia QA integral que cubre desde el análisis y la planificación hasta la automatización UI y API, con trazabilidad completa en cada etapa.

### Análisis de la aplicación

Durante la exploración inicial se relevaron los módulos principales:

- **Pública:** home con listado de habitaciones, flujo de reserva, formulario de contacto.
- **Administración:** login/logout, gestión de habitaciones (crear, editar, listar), mensajes recibidos.

Se registró el comportamiento real de la app: mensajes de validación, límites de campos, respuestas ante datos incorrectos y restricciones de fechas. Este relevamiento fue la base para priorizar flujos y definir los criterios de aceptación.

### Estrategia QA

| Flujo | Área | Prioridad |
|-------|------|-----------|
| F-01 · Reserva de habitación | Público | Alta |
| F-02 · Verificación de disponibilidad | Público | Alta |
| F-03 · Envío de mensaje de contacto | Público | Alta |
| F-04 · Autenticación y sesión administrativa | Admin | Alta |
| F-05 · Gestión de habitaciones | Admin | Media–Alta |
| F-06 · Mensajes y contenido en home | Admin | Media |

**Tipos de prueba aplicados:** exploratoria · BDD/Gherkin · automatización UI con POM · automatización API con axios.

**Criterio de éxito:** flujos críticos documentados con trazabilidad historia → caso → Gherkin → ejecución, reporte HTML generado y evidencia cargada en Azure DevOps.

### Casos de prueba — TC-01 (módulo Booking / HU-01)

**HU-01 | Reserva de habitación**
- **Como** huésped del hotel
- **Quiero** reservar una habitación seleccionando fechas y completando mis datos
- **Para** asegurar mi estadía y recibir confirmación o rechazo de la reserva

| ID | Título | Tipo |
|----|--------|------|
| TC-01-001 | Reserva exitosa con datos válidos | Happy path |
| TC-01-011 | Reserva rechazada por conflicto de disponibilidad | Negative |
| TC-01-012 | Reserva rechazada por fechas pasadas | Negative |

Estos casos están trazados a los escenarios de `features/booking.feature` mediante los tags `@TC-01-001`, `@TC-01-011` y `@TC-01-012`.

---

## Celeste Olmedo — Historias de Usuario, Casos de prueba, Tipos de prueba y TC-03

### Historias de Usuario

Las historias de usuario se documentaron en `docs/historias_de_usuario.md` siguiendo el formato **Como / Quiero / Para** con criterios de aceptación observables. Se definieron historias para los módulos de reserva (HU-01), contacto (HU-03) y administración de habitaciones (HU-05), entre otras.

### Casos de prueba

Los casos se documentaron en una tabla estilo Excel (`docs/casos_de_prueba.md`) con las columnas: ID, título, precondiciones, pasos, datos de entrada, resultado esperado y tipo. Se priorizaron happy paths, negativos y edge cases para cada historia. El inventario total en la tabla es mayor que los escenarios llevados a Gherkin; los casos no automatizados están cargados en Azure DevOps para su seguimiento manual.

### Tipos de prueba

| Tipo | Aplicación en el proyecto |
|------|--------------------------|
| Exploratoria | Relevamiento inicial de la app; base para HUs y TCs |
| BDD / Gherkin | Features en `features/` con lenguaje de negocio |
| Automatización UI | Cucumber + Playwright + POM |
| Automatización API | Cucumber + axios sobre `https://restful-booker.herokuapp.com` |

### Casos de prueba — TC-03 (módulo Contacto / HU-03)

**HU-03 | Enviar mensaje de contacto**
- **Como** visitante del sitio
- **Quiero** enviar un mensaje con mis datos y el detalle de la consulta
- **Para** comunicarme con el establecimiento y recibir confirmación o indicación de error

| ID | Título | Tipo |
|----|--------|------|
| TC-03-001 | Envío exitoso con datos válidos | Happy path |
| TC-03-006 | Envío con email de formato inválido | Negative |
| TC-03-012 | Envío con todos los campos vacíos | Negative / smoke |

Estos casos están trazados a los escenarios de `features/contact.feature` mediante los tags `@TC-03-001`, `@TC-03-006` y `@TC-03-012`.

---

## Martín Cabrera — Azure DevOps y TC-05

### Azure DevOps — Test Plans

En Azure DevOps se configuró un Test Plan con Test Suites por módulo (Booking, Contact, Rooms Admin). Se cargaron los casos de prueba principales con sus pasos y resultados esperados, y se vincularon a las User Stories correspondientes como Work Items. La evidencia (capturas del plan, suites, casos y vínculos) está disponible en `docs/azure_test_plans.md` y `docs/Screenshots/`.

### Casos de prueba — TC-05 (módulo Rooms Admin / HU-05)

**HU-05 | Gestión de habitaciones**
- **Como** administrador
- **Quiero** crear, listar y editar habitaciones en el módulo de Rooms
- **Para** mantener el inventario publicado coherente y actualizado

| ID | Título | Tipo |
|----|--------|------|
| TC-05-001 | Crear habitación con datos válidos | Happy path |
| TC-05-004 | Crear habitación con número duplicado | Negative |
| TC-05-010 | Cambio de descripción en admin se refleja en vista pública | Edge |

Estos casos están trazados a los escenarios de `features/rooms_admin.feature` mediante los tags `@TC-05-001`, `@TC-05-004` y `@TC-05-010`.

---

# Parte B — Demo técnica

---

## Noelia Mustaff — POM, selectores y pages

### Page Object Model

El proyecto implementa el patrón POM centralizando los locators y las acciones de cada módulo en clases dedicadas bajo `pages/`. Los steps de Cucumber no contienen lógica de UI: solo orquestan llamadas a los métodos de las pages.

**Pages implementadas:**

| Archivo | Módulo |
|---------|--------|
| `BasePage.js` | Métodos comunes (navegación, esperas) |
| `HomePage.js` | Home y acceso a habitaciones |
| `BookingPage.js` | Flujo completo de reserva |
| `ContactPage.js` | Formulario de contacto |
| `AdminPage.js` | Login y sesión administrativa |
| `RoomsAdminPage.js` | CRUD de habitaciones |

### Selectores y constantes

Los selectores y los valores constantes (URLs, mensajes esperados) están centralizados en `constants/`. Esto permite actualizar un locator en un solo lugar sin modificar steps ni tests. Los datos variables (usuarios, credenciales) se gestionan desde `data/users.json`.

### Ejemplo de interacción POM

Un step como `When el usuario completa el formulario de contacto` llama a `contactPage.fillForm(data)`, que internamente localiza cada campo, ingresa el valor y maneja las esperas. El step no conoce selectores: esa responsabilidad es exclusiva del Page Object.

---

## Celeste Olmedo — Cucumber, features y steps

### Cucumber y BDD

Cucumber actúa como puente entre la documentación de negocio y el código de automatización. Cada escenario en los archivos `.feature` describe un comportamiento observable en lenguaje natural, y los steps en `features/step_definitions/` lo implementan usando los métodos del POM.

### Features

| Feature | Escenarios | Tags de trazabilidad |
|---------|------------|----------------------|
| `booking.feature` | 3 | `@TC-01-001`, `@TC-01-011`, `@TC-01-012` |
| `contact.feature` | 3 | `@TC-03-001`, `@TC-03-006`, `@TC-03-012` |
| `admin_login.feature` | 7 (incluye Scenario Outline × 5) | `@TC-04-xxx` |
| `rooms_admin.feature` | 3 | `@TC-05-001`, `@TC-05-004`, `@TC-05-010` |

Todas las features usan lenguaje de negocio: sin selectores, sin IDs técnicos, con resultados verificables en los `Then`.

### Steps

Los step definitions conectan el lenguaje Gherkin con el POM. Cada step es corto: instancia o reutiliza el page object del World y delega la acción. Los hooks en `features/support/hooks.js` capturan screenshot y log HTTP ante cualquier fallo, adjuntándolos al reporte HTML automáticamente.

---

## Martín Cabrera — API, reportes y cierre

### Tests de API

Los tests de API están en `api/api.feature` y `api/api.steps.js`. El cliente HTTP es **axios** y los escenarios cubren el ciclo CRUD completo sobre `https://restful-booker.herokuapp.com`:

| Escenario | Endpoint | Validación principal |
|-----------|----------|----------------------|
| Listar reservas | `GET /booking` | Status 200 · array de objetos con `bookingid` numérico |
| Crear reserva | `POST /booking` | Status 200 · `bookingid` presente · campos coinciden con el payload enviado |
| Actualizar reserva | `PUT /booking/:id` | Status 200 · cuerpo refleja los nuevos valores (requiere token de `/auth`) |
| Eliminar y verificar | `DELETE /booking/:id` + `GET /booking/:id` | DELETE 201 · GET posterior 404 |

**Resultado de la última ejecución:** 4 escenarios · 4 passed · 0 failed.

### Reportes y evidencia

- **Reporte HTML:** `reports/cucumber-report.html` — archivo único con estado de cada escenario y paso.
- **Screenshots de fallo:** adjuntos al reporte HTML vía hook (`features/support/hooks.js`).
- **Logs HTTP:** trazas REQ/RES adjuntas en escenarios fallidos (`DEBUG=pw:api`).
- **Reportes separados:** `reports/cucumber-report-ui.html` (UI) y `reports/cucumber-report-api.html` (API).

### Cierre

El proyecto recorre el circuito completo de QA:

**Análisis → Historias y casos → Azure DevOps → Gherkin → Automatización UI + API → Reporte**

**Lecciones aprendidas:**

1. Explorar la app antes de automatizar evita asumir comportamientos que el sistema no garantiza.
2. La trazabilidad HU → TC → Gherkin → Azure permite justificar cada decisión de cobertura.
3. Los tests de API complementan la UI: detectaron el bug HTTP 400 en `PUT /room/:id` de forma directa.
4. El POM centraliza los cambios de selectores y mantiene los steps estables.
5. Documentar lo que se decidió no automatizar es tan importante como lo que sí se automatizó.

---

*Entrega Semana 8 — Proyecto Integrador Final · Academia C&S*
