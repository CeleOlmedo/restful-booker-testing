# Guión de presentación — Proyecto Restful Booker Testing

**Aplicación objetivo:** [Restful Booker Platform](https://automationintesting.online/) (demo pública)  
**Equipo (3) — orden de intervención sugerido:** **Noelia Mustaff** → **Celeste Olmedo** → **Martín Cabrera** (Academia C&S)  
**Stack resumido:** Playwright + Cucumber (BDD, UI), Axios (API), POM, reportes HTML de Cucumber.

**Sugerencia de duración:** 12–20 minutos + preguntas.

> **Cómo usar este documento:** cada integrante tiene su “partecita”. Las **Preguntas guía** sirven para profundicen o responan en el Q&A.

---

## Reparto de casos de prueba (explicación en vivo)

| Orden en vivo | Casos | Explica | Tema (HU) |
|--------------|--------|---------|-----------|
| 1 | **TC-01-xxx** (Booking / reserva) | **Noelia Mustaff** | HU-01 y flujo F-01 |
| 2 | **TC-03-xxx** (Contacto) | **Celeste Olmedo** | HU-03 y flujo F-03 |
| 3 | **TC-05-xxx** (Rooms / admin) | **Martín Cabrera** | HU-05 y flujo F-05 |

*Los TC-04, API, etc. pueden mencionarse al repasar la suite en general (Bloque B) o al mostrar Gherkin.*

---

# Parte A — Análisis, planificación y trazabilidad a la automatización

Resumen de lo del **día de análisis** como puente a **features y Gherkin** del día siguiente.

| Orden en vivo | Integrante     | Secciones que cubre |
|---------------|----------------|----------------------|
| A – 1         | **Noelia Mustaff**  | A.1 + A.2 + explicación **TC-01** (HU-01) |
| A – 2         | **Celeste Olmedo**  | A.6 + A.7 + A.8 + A.9 + explicación **TC-03** (HU-03) + DevOps / Azure (plan completo) |
| A – 3         | **Martín Cabrera**  | A.3 + A.4 + A.5 + explicación **TC-05** (HU-05) |

---

## Parte A — Noelia Mustaff (A.1, A.2 y TC-01 / HU-01) — *intervención 1*

### A.1 Entender la aplicación y definir una estrategia QA simple y efectiva

- Revisión del propósito del producto: reservas, disponibilidad, contacto, panel administrador (habitaciones, sesión).
- Criterio de “simple y efectivo”: pocos flujos bien elegidos, criterios observables, trazabilidad clara (historia → casos → Gherkin → ejecución).

### A.2 Exploración guiada de la app

- Recorrido acordado: home → listado de habitaciones → reserva y validaciones → contacto → login admin → gestión de habitaciones.
- Registro de comportamiento real (mensajes, límites, errores) sin asumir reglas no verificadas en la demo compartida.

### Explicación de **TC-01** (casos de prueba — módulo Booking, `docs/casos_de_prueba.md`)

*Defendés en voz alto los **casos TC-01-xxx** vinculados a **HU-01 | Reserva** y a la feature `booking.feature` (trazabilidad con `@TC-01-...`).*

**HU-01 (recordatorio RNF para la mesa de análisis)**

- **Como** huésped del hotel  
- **Quiero** reservar una habitación seleccionando fechas y completando mis datos  
- **Para** asegurar mi estadía y saber si la reserva fue aceptada o rechazada  

*Detalle de criterios: ver `docs/historias_de_usuario.md`.*

| ID | Título | Precondiciones (resumido) | Tipo / idea |
|----|--------|---------------------------|------------|
| TC-01-001 | Reserva exitosa | App OK; habitación disponible en el rango | Happy path — base del escenario Gherkin principal |
| TC-01-012 | Reserva con fechas pasadas | Mismo contexto, fechas en el pasado | Negative — valida mensaje “Ingrese fechas válidas” (o equivalente) |
| TC-01-013 | Reserva en fechas ya ocupadas | Existe reserva previa en el rango | Negative — conflicto de disponibilidad, mensaje acorde |

> En la charla, enlazá cada TC con un **escenario** o tag en `features/booking.feature` y, si aplica, con pruebas **API** sobre reservas.

### Preguntas guía — Noelia (A)

1. Qué módulo les sorprendió más al explorar y qué riesgo de negocio viste en **reservas**.
2. Diferencia entre lo que “suponían” y lo que la demo realmente hacía (fechas, validaciones).
3. Por qué con **pocos** flujos documentados; cómo aplica a TC-01.
4. Cómo evitaron duplicar el recorrido exploratorio entre ustedes **tres**.
5. Concretamente en **TC-01-013** (ocupado): qué cuidan con datos/entorno compartido.
6. Si **TC-01-012** o **-013** no se automatizaran todos, cómo explican igual la cobertura (manual, Azure, etc.).

---

## Parte A — Celeste Olmedo (A.6, A.7, A.8, A.9 y TC-03 / HU-03) — *intervención 2*

### A.6 Flujos críticos priorizados (6)

| ID | Flujo | Área | Prioridad |
|----|--------|------|------------|
| F-01 | Reserva de habitación | Público | Alta |
| F-02 | Verificación de disponibilidad | Público | Alta |
| F-03 | Envío de mensaje de contacto | Público | Alta |
| F-04 | Autenticación y sesión administrativa | Admin | Alta |
| F-05 | Gestión de habitaciones | Admin | Media–Alta |
| F-06 | Mensajes y contenido en home | Admin | Media (condicional) |

### A.7 Tipos de pruebas

- **Exploratorias**  
- **BDD (Gherkin)**  
- **Automatización UI** (POM)  
- **Automatización API**

### A.8 Historia de Usuario (ejemplo Contact — HU-03)

**HU-03 | Enviar mensaje de contacto**

- **Como** visitante del sitio  
- **Quiero** enviar un mensaje con mis datos y el detalle de la consulta  
- **Para** comunicarme con el establecimiento y saber si se envió o qué debo corregir  

*Criterios de aceptación completos: `docs/historias_de_usuario.md` (sección HU-03). En análisis era prosa; luego `contact.feature` con `@HU-03`, `@TC-03-…`.*

### A.9 Explicación de **TC-03** (tabla estilo Excel — semana 2)

*Explicás con propiedad los **TC-03-xxx**; base `docs/casos_de_prueba.md` y vínculo a `features/contact.feature`.*  
*Hay **más** filas de las que a veces se llevan a Gherkin: priorizar en vivo 2–3 y mencionar el resto como “inventario en Azure/Excel”.*

| ID | Título | Precondiciones | Pasos (resumidos) | Datos | Resultado esperado | Tipo |
|----|--------|----------------|-------------------|--------|--------------------|------|
| TC-03-001 | Envío exitoso con datos válidos | App accesible, formulario visible | Completar campos válidos; enviar | Nombre, email, teléfono, asunto 5–100, mensaje 20–2000 | Confirmación observable de envío | Happy path |
| TC-03-002 | Asunto con menos de 5 caracteres | Mismo | Asunto "Hola" (4); resto válido; enviar | Asunto corto | No envía; error en asunto | Negative |
| TC-03-003 | Asunto límite inferior (5) | Mismo | Asunto exactamente 5 caracteres | 5 chars | Según regla documentada | Edge |
| TC-03-004 | Asunto límite superior (100) | Mismo | Asunto 100 caracteres | 100 chars | Acepta o error según regla | Edge |
| TC-03-005 | Mensaje límite inferior (20) | Mismo | Mensaje 20 caracteres; resto válido | 20 chars | Comportamiento acordado | Edge |
| TC-03-006 | Email inválido | Mismo | Enviar con email sin formato | p. ej. `anaemail.com` | No envía; hint en email | Negative |
| TC-03-007 | Teléfono fuera de rango | Mismo | Largo < 11 o > 21 según regla | Largo inválido | No envía; error en teléfono | Negative |
| TC-03-008 | Teléfono con letras o símbolos | Mismo | Si longitud ok pero caracteres raros | p. ej. `abc12345678` | Definir bug o regla; evidencia en Azure | Edge |
| TC-03-012 | Todos los campos vacíos | Mismo | Enviar sin completar | Vacíos | No envía; campos requeridos señalados | Negative / smoke |
| … | (resto) | | | | | Módulos TC-01 / TC-05: hablan **Mustaff** y **Cabrera**; ver mismo doc |

**Carga en DevOps (Azure):** el equipo cargó casos en **Test Plans** y vinculó a Work Items: `docs/azure_test_plans.md` y `docs/Screenshots/`. En este turno (después de **TC-01** de Mustaff) conectá **TC-03** y el plan global; **Cabrera** en el bloque 3 remata con **TC-05** bajo el mismo test plan.

### Preguntas guía — Celeste (A)

1. “Backbone” de la tabla F-01–F-06: cómo explicar **F-03** en 30 s.
2. Por qué F-02 o F-06 tienen criterio distinto (análisis vs automatizar o no).
3. Exploración + BDD sin duplicar esfuerzo.
4. Valor de la **API** al lado de la **UI** en este producto.
5. De prosa a **ID TC-03-xxx**: trazabilidad a escenarios.
6. Por qué en Excel entran **más** filas que en Gherkin; criterio de corte.
7. Columnas mínimas de la tabla (semana 2) y por qué importan a Azure.
8. Si “resultado esperado” era ambiguo en la demo, cómo lo cerraron.

---

## Parte A — Martín Cabrera (A.3, A.4, A.5 y TC-05 / HU-05) — *intervención 3*

### A.3 Priorizar flujos críticos

- Prioridad por **impacto de negocio** y **riesgo** (reserva, contacto, autenticación, inventario admin), no “cubrir todo”.

### A.4 Objetivo del proyecto (fase de análisis)

Validar de forma estructurada el comportamiento en flujos acordados, con **documentación viva** (historias, casos, plan en Azure) y base para BDD y automatización reproducible.

### A.5 Alcance — qué sí / qué no

| Incluido | Excluido o limitado |
|----------|----------------------|
| Flujos públicos: reserva, verificación de disponibilidad (análisis), contacto | Performance, carga, pentesting |
| Flujos admin: login, habitaciones, mensajes/home (según fragilidad) | Cross-browser exhaustivo, flujos de pago |
| Casos en Azure Test Plans, trazabilidad a historias | Especificación infiriendo solo exploratoria sin consenso |
| Automatización UI + API donde aporte estabilidad | F-06 “condicional” a automatizar |

### Explicación de **TC-05** (casos de prueba — Rooms / administrador, `docs/casos_de_prueba.md`)

*Explicás los **TC-05-xxx** ligados a **HU-05 | Gestión de habitaciones** y a `features/rooms_admin.feature` (`@TC-05-...`).*

**HU-05 (recordatorio)**

- **Como** administrador  
- **Quiero** crear, listar y editar habitaciones en el módulo de Rooms  
- **Para** mantener el inventario publicado coherente  

| ID | Título | Tipo / foco al contar en vivo |
|----|--------|------------------------------|
| TC-05-001 | Crear habitación con datos válidos | Happy path; datos ejemplo (101, Double, precio, detalles) y verificación en listado admin |
| TC-05-004 | Número duplicado | Negative; mensaje esperado “Habitación duplicada…”; decisión de negocio si el sistema aún deja duplicar |
| TC-05-010 | Cambio de descripción admin → reflejo en pública | Edge: verificación cruzada **admin** ↔ **vista pública** |

> Enfocá la explicación en trazabilidad: tabla Excel → Gherkin → (opcional) riesgo de colisión de datos en demo compartida. **Orden en vivo:** en este punto ya expusieron **TC-01 (Mustaff)** y **TC-03 (Olmedo)**; acá cerrás con F-05 y alineás el cierre con el inventario en Azure.

### Preguntas guía — Martín (A)

1. Cómo definieron qué flujo es “más crítico” con solo el contexto del curso.
2. Qué dejaste **fuera** del alcance a propósito; quién “habla” por F-05 en la planificación.
3. Qué sería *scope creep* y cómo lo contuvieron.
4. Alineación entre alcance de **análisis** y **automatización** final (un ejemplo con TC-05).
5. Si tuvieran doble de tiempo, ¿más módulos o más profundidad en F-05?
6. En **TC-05-010:** qué pasa si la pública tarda o no refleja el admin (cómo lo contarías como riesgo).

---

# Parte B — Demo y cierre (guion principal) — 3 integrantes

| Orden en vivo | Integrante     | Secciones |
|---------------|----------------|------------|
| B – 1         | **Noelia Mustaff**  | B.1 Objetivo + B.2 Estrategia resumida |
| B – 2         | **Celeste Olmedo**  | B.3 Qué automatizaron + B.4 Qué quedó fuera |
| B – 3         | **Martín Cabrera**  | B.5 Demo + B.6 Lecciones + cierre |

---

## Parte B — Noelia Mustaff (B.1 y B.2) — *intervención 1*

### B.1 Objetivo del proyecto

Demostrar una **estrategia QA integral y profesional** en Restful Booker: de exploración y priorización, con historias y casos trazables en Azure, a **automatización** UI y API con reportes, BDD, POM, datos centralizados.

### B.2 Estrategia resumida

1. Fijar **comportamiento observado** (entorno compartido).  
2. Priorizar **F-01 a F-06** por negocio/riesgo.  
3. **HUs y casos** (tabla tipo Excel) antes o con Gherkin.  
4. Automatizar lo **estable**; F-02/F-06 manual o condicional si la UI frágil.  
5. **API** reforzando lógica de reservas sin depender solo de la UI.

*Más en `docs/estrategia.md`.*

### Preguntas guía — Noelia (B)

1. En una frase, qué “problema de QA” resuelve la entrega a quien mira.
2. Qué hace a la entrega “profesional” más allá de tests en verde.
3. De los 5 pasos, ¿el más costoso para ustedes tres y por qué?
4. Valor de negocio: respuesta de 20 s. para jurado/aula.
5. Cómo medir cierre de proyecto sin “solo Gherkin verde”.

---

## Parte B — Celeste Olmedo (B.3 y B.4) — *intervención 2*

### B.3 Qué automatizaron y por qué

| Qué | Por qué |
|-----|--------|
| `booking.feature` (TC-01) | Máximo valor; happy + fechas + conflicto. |
| `contact.feature` (TC-03) | Validaciones claras; buenos negativos. |
| `admin_login.feature` | Acceso; outline con combinaciones inválidas. |
| `rooms_admin.feature` (TC-05) | CRUD, duplicado, admin→público. |
| `api/api.feature` + steps | HTTP estable; negocio independiente de UI. |

*POM: `pages/`, `constants/`, lenguaje Gherkin compartido técnico / negocio.*

*Al hablar, podés citar: **Noelia (TC-01)**, **vos (TC-03)**, **Martín (TC-05)** como quienes explicaron cada prefijo en la Parte A.*

### B.4 Qué quedó fuera o con automatización limitada

- **F-02 (solo disponibilidad):** riesgo en **tarjetas** tras el paso; a veces análisis o manual; sin feature aislada solo a “disponibilidad” en el repo.  
- **F-06 (mensajes / home):** manual o selectivo.  
- No performance, no pentest, no pagos.  
- Más filas en Excel / Azure que escenarios: **subconjunto** deliberado, tags `@TC-…`.

### Preguntas guía — Celeste (B) — B.3 y B.4

1. Justificar **Cucumber** + Playwright en 1 min.  
2. Qué re-automatizar y qué dejar manual en un proyecto hermano.  
3. Dónde termina requisito de negocio y dónde POM en un `Given/When/Then`.  
4. Cómo presentan la **API** a no técnicos.  
5. Test UI inestable: datos, selectores, posponer con tag.  
6. “No lo automatizamos” con orgullo (F-02 / F-06 / Excel parcial).  
7. Diferencia entre “falto tiempo” y “no conviene automatizar”.

---

## Parte B — Martín Cabrera (B.5, B.6 y cierre) — *intervención 3*

### B.5 Demo paso a paso

**Preparación:** `npm install`, `npx playwright install` (decir al inicio en voz baja).

1. Mapa del repo: `README`, `features/`, `pages/`, `api/`, `constants/`, `docs/`.  
2. **Feature** sugerida para leer: `contact.feature` (explicó **Celeste**, TC-03), `booking.feature` (**Noelia**, TC-01) o `rooms_admin.feature` (vos, TC-05), según qué quieran remarcar.  
3. **Trazabilidad:** comentario `# HU-0x | Cubre TC-…` en el `.feature`.  
4. `npm run test:ui` o `npm run test:ui:report` → abrir `reports/cucumber-report.html`.  
5. `npm run test:api` o `test:api:report`.  
6. Opcional: un **Page Object** (p. ej. `ContactPage.js`, `BookingPage.js` o `RoomsAdminPage.js` según quieran rematar).  
7. Cierre con **Azure** (`docs/azure_test_plans.md`) y capturas: plan unificado (Noelia = TC-01, Celeste = TC-03, vos = TC-05).

*Transición:* *“Esto en Gherkin bajó de la planilla y de lo subido a DevOps.”*

### B.6 Lecciones aprendidas (elegir 5–6 para el oral; reparten turnos ustedes tres)

1. Explorar **antes** de automatizar.  
2. **Demo pública** → fechas y datos no colisionantes.  
3. Trazabilidad **HU → TC → Gherkin → Azure** abre boca en auditorías.  
4. **API + UI** se complementan.  
5. **POM** amortiza cambio de selectores.  
6. **Excel** como inventario; Gherkin es subconjunto.  
7. F-02: documentar riesgo de regresión, no forzar.  
8. BDD vive si acompaña aceptación; no como “sugar syntax” suelta.

### Cierre (30 segundos)

*“Cerramos el circuito **análisis → planilla y Azure → Gherkin → automatización → reporte** sobre reservas reales, con alcance honesto y lecciones reutilizables.”*

**Turno de cierre (tres, ~20 s c/u):** una lección **personal** por integrante; orden de micrófono sugerido: **Noelia → Celeste → Martín**.

### Preguntas guía — Martín (B) — B.5, B.6 y cierre

1. Plan B si se cae la live demo: 2 archivos o pantallas que muestren el mismo argumento.  
2. Cómo narran el **reporte** HTML a quien nunca vio BDD.  
3. Cierre: ¿BDD + POM otra vez?  
4. F-02 o F-06: qué harían en un **sprint 2** del curso.  
5. *Para las tres en conjunto en Q&A:* conflicto con repo / Azure / rama.

---

# Apéndice: asignación fija (3 integrantes)

**Orden de exposición (Parte A y Parte B):** 1) **Noelia Mustaff** → 2) **Celeste Olmedo** → 3) **Martín Cabrera**

| Parte A | Asignado |
|---------|----------|
| Bloque 1: A.1, A.2, **TC-01** (HU-01) | **Noelia Mustaff** |
| Bloque 2: A.6–A.9, **TC-03** (HU-03), cierre Azure (plan) | **Celeste Olmedo** |
| Bloque 3: A.3–A.5, **TC-05** (HU-05) | **Martín Cabrera** |
| **Parte B** |  |
| B.1, B.2 | **Noelia Mustaff** |
| B.3, B.4 | **Celeste Olmedo** |
| B.5, B.6, cierre | **Martín Cabrera** |

*Ajustar solo quien comparte pantalla; el reparto de **TC-01 / TC-03 / TC-05** se mantiene fijo (Mustaff / Olmedo / Cabrera).*
