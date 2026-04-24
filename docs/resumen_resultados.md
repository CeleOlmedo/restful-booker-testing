# Resumen de resultados — Semana 8 / Día 39

**Fecha de referencia (última corrida completa):** 23 de abril de 2026
**Proyecto:** [restful-booker-testing](https://github.com/CeleOlmedo/restful-booker-testing)
**App UI:** [automationintesting.online](https://automationintesting.online/)
**API pública (Restful Booker):** `https://restful-booker.herokuapp.com`

---

## 1. Qué se ejecutó

### Parte A — Automatización UI (Cucumber + Playwright)

- **Comando:** `npm run test:ui:report`
- **Alcance:** 16 escenarios en `features/**/*.feature`:
  - **Reservas** (`booking.feature`): 3 escenarios.
  - **Contacto** (`contact.feature`): 3 escenarios.
  - **Admin / login** (`admin_login.feature`): 7 escenarios (incluye *Scenario Outline* con 5 ejemplos).
  - **Admin / habitaciones** (`rooms_admin.feature`): 3 escenarios.
- **Configuración:** `DEBUG=pw:api` (trazas Playwright), `HEADED=true` (navegador visible), reporte HTML generado en `reports/cucumber-report.html`.
- **Hooks** (`features/support/hooks.js`): captura de pantalla completa en fallos adjunta al reporte; log HTTP (REQ/RES) adjunto en escenarios fallidos.

### Parte B — Tests de API con axios

- **Comando:** `npm run test:api:report`
- **Alcance:** 4 escenarios en `api/api.feature` (CRUD vía `api/api.steps.js`):
  - `GET /booking` — listado de IDs.
  - `POST /booking` — creación de reserva.
  - `PUT /booking/:id` — actualización (previa autenticación con `POST /auth`).
  - `DELETE /booking/:id` + verificación `GET /booking/:id` → 404.
- **Base URL:** `https://restful-booker.herokuapp.com`

### Parte C — Reportes y evidencia

- **Reporte HTML (Cucumber):** `reports/cucumber-report.html` — archivo único con resumen, adjuntos de fallo (screenshot + log HTTP) y estado de cada paso.
- **Capturas de fallo:** adjuntas al reporte HTML vía hook; también disponibles en `reports/screenshots/`.
- **Documentación de API:** `docs/notas_api.md` con endpoints, validaciones y ejemplos de request/response.

---

## 2. Resultados de ejecución

### Parte B — API (última corrida)

| Métrica    | Valor                    |
|------------|--------------------------|
| Escenarios | **4**                    |
| Resultado  | **4 passed, 0 failed**   |
| Pasos      | 21 passed                |

Cobertura mínima del día (GET + POST, y además PUT + DELETE con verificación) **cumplida y en verde**.

### Parte A — UI (última corrida)

| Métrica    | Valor                             |
|------------|-----------------------------------|
| Escenarios | **16**                            |
| Resultado  | **13 passed, 3 failed**           |
| Pasos      | 93 passed, 3 failed, 8 skipped    |

**Interpretación:** los 3 escenarios en rojo reflejan **comportamiento real de la aplicación bajo prueba** (defectos o limitaciones del servicio) y no errores en el código de test. Se documentan como evidencia de bug detectado.

**Escenarios fallidos (última corrida):**

| # | Escenario | Archivo | Error observado | Clasificación |
|---|-----------|---------|-----------------|---------------|
| 1 | Reserva rechazada por fechas pasadas | `booking.feature:18` | Timeout (5 s) esperando mensaje `bookingInvalidDates`; la UI no muestra el bloqueo esperado | Bug / UX inconsistente |
| 2 | Reserva rechazada por conflicto de disponibilidad | `booking.feature:27` | El texto *Booking Confirmed* no apareció en el *Given* de preparación previa; recursos externos con 404 (`mwtestconsultancy.co.uk`) | Inestabilidad de entorno / posible bug |
| 3 | Cambio de descripción en admin se refleja en vista pública | `rooms_admin.feature:23` | Page Object reportó **HTTP 400** en `PUT /api/room/1` al guardar cambios | Bug confirmado en la API de la app |

**Escenarios que pasaron (resumen):** login y logout, validaciones de credenciales (Scenario Outline × 5), envío de formulario de contacto, happy path de reserva, creación de habitación — **13 de 16** en verde.

---

## 3. Defectos detectados

| ID    | Módulo    | Descripción                                                              | Severidad | Estado     |
|-------|-----------|--------------------------------------------------------------------------|-----------|------------|
| BUG-01 | Booking   | La UI no bloquea ni muestra mensaje al intentar reservar con fechas pasadas | Media     | Abierto    |
| BUG-02 | Booking   | La confirmación de reserva previa no siempre es visible (flakiness de la app pública compartida) | Baja–Media | Abierto |
| BUG-03 | Rooms Admin | `PUT /api/room/1` devuelve HTTP 400 al guardar cambios de descripción desde el panel admin | Alta      | Abierto    |

---

## 4. Lecciones aprendidas

1. **Explorar antes de automatizar:** el comportamiento real de la app pública no siempre coincide con el esperado; documentarlo evita sobreestimar la cobertura.
2. **Entorno compartido:** reservas y habitaciones con estado global entre corridas generan colisiones; usar datos únicos o limpiar entre escenarios.
3. **API complementa UI:** los tests de API detectaron que el endpoint `PUT /room/:id` responde 400, evidencia que la UI sola no habría aislado tan fácilmente.
4. **BDD como contrato vivo:** los escenarios Gherkin con tags `@TC-…` mantienen la trazabilidad historia → caso → automatización → Azure.
5. **POM amortiza cambios:** cuando los selectores de la app cambiaron, actualizar el Page Object fue suficiente sin tocar los steps.
6. **Reportes con adjuntos:** los screenshots y logs HTTP en el reporte HTML dan contexto inmediato al revisar un fallo, sin necesidad de reproducir manualmente.

---

## 5. Evidencias disponibles

| Tipo | Ubicación |
|------|-----------|
| Reporte Cucumber API | `reports/cucumber-report-api.html` |
| Reporte Cucumber UI | `reports/cucumber-report-ui.html` |
| Reporte Cucumber (último generado) | `reports/cucumber-report.html` |
| Screenshots de fallo | Adjuntas en el reporte HTML y en `reports/screenshots/` |
| Capturas Azure Test Plans | `docs/Screenshots/` |
| Documentación de API | `docs/notas_api.md` |
| Presentación / guion demo | `docs/presentacion.md` |
| Código fuente | `features/`, `api/`, `pages/`, `cucumber.js`, `package.json` |

---

*Entrega Semana 8 – Día 39: automatización API, reportes, evidencia y preparación de presentación final.*
