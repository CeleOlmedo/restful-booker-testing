# Resumen de resultados — Semana 8 / Día 39 (entrega CORE)

**Fecha de referencia (última corrida completa):** 23 de abril de 2026  
**Proyecto:** [restful-booker-testing](https://github.com/CeleOlmedo/restful-booker-testing)  
**App UI:** [automationintesting.online](https://automationintesting.online/)  
**API pública (Restful Booker):** `https://restful-booker.herokuapp.com`

---

## 1. Qué se ejecutó

### Parte A — Automatización UI (Cucumber + Playwright)

- **Comando:** `npm run test:ui:report` (equivalente a `test:ui` con reporte HTML).
- **Alcance:** 16 escenarios en `features/**/*.feature`:
  - **Reservas** (`booking.feature`): 3 escenarios.
  - **Contacto** (`contact.feature`): 3 escenarios.
  - **Admin / login** (`admin_login.feature`): 7 escenarios (incluye *Scenario Outline* con 5 ejemplos).
  - **Admin / habitaciones** (`rooms_admin.feature`): 3 escenarios.
- **Comportamiento de apoyo:** `DEBUG=pw:api` (trazas Playwright en consola), `HEADED=true` (navegador visible), generación de `reports/cucumber-report.html` y formato *progress* en consola.
- **Hooks** (`features/support/hooks.js`): en fallos, captura de pantalla completa y adjunto al reporte; traza HTTP (REQ/RES) adjunta en fallos (variable `HTTP_LOGS`, por defecto en escenarios fallidos).

### Parte B — Tests de API con axios

- **Comando:** `npm run test:api:report` (Cucumber sobre `api/**/*.feature`).
- **Alcance:** 4 escenarios en `api/api.feature` (CRUD vía `api/api.steps.js`):
  - `GET /booking` — listado de IDs.
  - `POST /booking` — creación.
  - `PUT /booking/:id` — actualización (tras `POST /auth`).
  - `DELETE /booking/:id` + comprobación `GET` 404.
- **Base URL:** `https://restful-booker.herokuapp.com` (heroku; no es la misma instancia que la app UI).

### Parte C — Reportes y entregables

- **Reporte HTML (Cucumber):** se genera en `reports/cucumber-report.html` (un solo archivo HTML con el resumen y adjuntos de la corrida vinculada).
- **Carpeta de screenshots del repo:** `reports/screenshots/` (reservada; las capturas de fallo del hook se adjuntan al HTML de Cucumber).
- **Documentación API:** existe `docs/notas_api.md` (estado: plantilla; conviene completar con endpoints, validaciones y ejemplos de request/response — ver *Riesgos remanentes*).

---

## 2. Qué pasó / qué falló

### API (última ejecución en este repositorio)

| Métrica   | Valor   |
|----------|--------|
| Escenarios | **4** |
| Resultado  | **4 passed, 0 failed** |
| Pasos      | 21 passed |

Cobertura mínima del día (GET + POST y más) **cumplida y en verde**.

### UI (última ejecución en este repositorio)

| Métrica   | Valor   |
|----------|--------|
| Escenarios | **16** |
| Resultado  | **13 passed, 3 failed** |
| Pasos      | 93 passed, 3 failed, 8 skipped |

**Interpretación:** En parte, los rojos en UI reflejan **comportamiento real de la aplicación bajo prueba** (reglas de negocio o flujos que no se cumplen como el escenario exige) y no solo fallas del código de test. En la app pública se observan limitaciones: por ejemplo, no se impedía con claridad el envío con fechas pasadas (falta el mensaje esperado), o el guardado vía `PUT` a habitación respondió **HTTP 400**. Los fallos que siguen se documentan como **evidencia de defecto en la página/servicio**, y no se consideran “ruido” a ocultar en la demo si el criterio del equipo es mostrar *prueba en rojo = bug detectado*.

**Escenarios en fallo (última corrida):**

1. **Reserva rechazada por fechas pasadas** (`booking.feature:18`) — *Then el sistema impide la creación de la reserva*: *timeout* (5 s) esperando el estado/elemento; no se pudo comprobar el bloqueo ni el mensaje `bookingInvalidDates` (posible **bug o UX inconsistente** al validar fechas en la UI).
2. **Reserva rechazada por conflicto de disponibilidad** (`booking.feature:27`) — en el *Given* (preparar reserva previa), la confirmación *Booking Confirmed* no apareció: `getByText(/Booking Confirmed/i)` no visible. En la red, la creación pudo ser **201** aunque el test esperaba otra señal (recursos de imagen externos **404** también observados: `mwtestconsultancy.co.uk`).
3. **Cambio de descripción en admin se refleja en la vista pública** (`rooms_admin.feature:23`) — *And guarda los cambios* falló con mensaje explícito del page object: **Guardar habitación falló: HTTP 400** (`PUT` a `https://automationintesting.online/api/room/1`).

**Escenarios que en esta corrida pasaron** (resumen): login y logout, validaciones de login, contacto, otras reservas (p. ej. *happy path* y creación de habitación donde aplica), **13 de 16** en verde.

> **Nota:** En otra máquina o fecha, `reports/ui-run.log` y capturas de fallos distintas (p. ej. admin/login o booking) pueden no coincidir con esta corrida; el criterio de entrega es conservar el **último** `cucumber-report.html` o export nominado con fecha/rama.

---

## 3. Riesgos remanentes

- **Mismo nombre de reporte para UI y API:** `pretest:api:report` y `pretest:ui:report` eliminan el mismo `reports/cucumber-report.html`. En la **última** sesión se dejó además `reports/cucumber-report-api.html` (copia tras la corrida API) y `reports/cucumber-report-ui.html` (copia tras la corrida UI) para no perder evidencia al pisar el archivo.
- **Flake / lentitud de la app web:** dependencia de `automationintesting.online` (red, build Next.js, CDN, datos compartidos). Efecto típico: *timeouts* de 5 s en acciones que el manual podría tolerar; habitaciones y reservas con **estado compartido** (IDs, números duplicados) entre quien ejecuta o entre corridas.
- **API pública en Heroku:** el servicio puede ralentizarse o dejar de responder; los tests no aíslan datos (bookings creados son reales en el entorno de demostración).
- **Documentación de API** (`docs/notas_api.md`): aún con texto guía, no reemplaza una ficha con endpoints, aserciones y cuerpos de ejemplo; conviene alinear con lo implementado en `api/steps` y con lo que pida el docente.
- **Playwright/Allure en README:** el README cita Allure, pero el flujo operativo del repo se basa en **HTML de Cucumber**; alinear descripción o añadir generación real de Allure si exigen ese formato.

---

## 4. Evidencias disponibles

| Tipo | Ubicación / descripción |
|------|-------------------------|
| Reporte Cucumber API (última corrida API) | `reports/cucumber-report-api.html` (copia conservada; suite API en **verde** en esa corrida). |
| Reporte Cucumber UI (última corrida UI) | `reports/cucumber-report-ui.html` (copia conservada). |
| Reporte Cucumber (último generado) | `reports/cucumber-report.html` — coincide con la **última** suite ejecutada (en la sesión documentada: **UI**); adjuntos de fallo: **screenshot** + **log HTTP**. |
| Log de consola (ejemplo histórico) | `reports/ui-run.log` (salida de otra sesión; útil como referencia, no como única prueba de la última ejecución). |
| Trazas Playwright API | Se habilita con `DEBUG=pw:api` en `test:ui` y `test:ui:report`. |
| Capturas para planes de prueba (Azure) | `docs/Screenshots/` (imágenes de prueba, planes, etc.). |
| Presentación | `docs/presentacion.md` (preparación de demo/feria). |
| Código fuente de pruebas | `features/`, `api/`, `pages/`, `cucumber.js`, `package.json`. |

**Cómo reproducir la misma lógica de entrega (orden sugerido):**  
`npm run test:api:report` → copiar/renombrar el HTML → `npm run test:ui:report` → copiar/renombrar el HTML → adjuntar o comprimir en un zip “single file” o carpeta con ambos nombres claros.

---

*Generado para la entrega Semana 8 – Día 39: tests API, reportes, evidencia y apoyo a la presentación final.*
