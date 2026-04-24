# restful-booker-testing

Test automation suite for the Restful Booker Platform — UI & API testing

> Proyecto integrador final — Curso de Testing  
> App objetivo: [automationintesting.online](https://automationintesting.online/)

---

## Tecnologías utilizadas

- [Playwright](https://playwright.dev/) — automatización UI
- [Cucumber](https://cucumber.io/) — BDD y documentación Gherkin; reporte en HTML
- [Axios](https://axios-http.com/) — pruebas de API (Restful Booker)
- JavaScript (Node.js)

---

## Prerrequisitos

- [Node.js](https://nodejs.org/) **v18 o superior** (recomendado LTS)
- [Git](https://git-scm.com/)
- Conexión a internet (las pruebas usan la app pública y, en API, `https://restful-booker.herokuapp.com`)

Comprobar versiones:

```bash
node --version
git --version
```

En **Windows**, los scripts de reporte usan **PowerShell** para limpiar el HTML previo si existe.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/CeleOlmedo/restful-booker-testing
cd restful-booker-testing

# 2. Instalar dependencias
npm install

# 3. Navegadores de Playwright (necesario para la suite UI)
npx playwright install
```

---

## Cómo ejecutar

### UI

Los escenarios viven en `features/**/*.feature` y se ejecutan con Playwright vía Cucumber. El script por defecto levanta el navegador en modo **headed** (`HEADED=true`) y activa trazas `DEBUG=pw:api`.

```bash
npm run test:ui:report    # Suite UI con reporte HTML
npm run test:api:report   # Suite API con reporte HTML
```

Variables útiles (opcional, ver `features/support/hooks.js`):

- `HEADED` — el navegador es **headed** solo si su valor es exactamente `true`. El script `npm run test:ui` aplica `HEADED=true` con `cross-env`; para **headless**, ejecutá Cucumber sin fijar `HEADED` (o sin usar ese `npm` script), por ejemplo: `npx cross-env DEBUG=pw:api cucumber-js --config cucumber.js`.
- `SLOWMO` — milisegundos de retardo entre acciones de Playwright (depuración).
- `HTTP_LOGS` — `failed` (por defecto) o `always`: adjunta al reporte el log de red capturado.

En escenarios **fallidos**, el hook hace **screenshot** de página completa y lo adjunta al reporte de Cucumber.

**Ejemplo** (headless, logs HTTP en todos los escenarios, mismas trazas `DEBUG` que el script de UI):

```powershell
$env:HTTP_LOGS = "always"
npx cross-env DEBUG=pw:api cucumber-js --config cucumber.js
```

### API

Existe una suite de API con **axios** bajo `api/`, alineada con [Restful Booker](https://restful-booker.herokuapp.com). Detalle de endpoints y aserciones: [`docs/notas_api.md`](docs/notas_api.md).

```bash
npm run test:api
```

### Reportes (HTML de Cucumber)

| Comando | Descripción |
|--------|-------------|
| `npm run test:ui:report` | Ejecuta la **suite UI** y genera `reports/cucumber-report.html` (el script `pretest:ui:report` elimina un reporte previo en Windows). |
| `npm run test:api:report` | Igual para la **suite API** (`api/**/*.feature`). |

Abrí `reports/cucumber-report.html` en el navegador. En fallos de UI, el hook adjunta al reporte la captura de pantalla completa (y, según `HTTP_LOGS`, el log de red); podés inspeccionarla desde el informe HTML.

> El `cucumber.js` del repo ya define salida HTML; los scripts `test:ui:report` y `test:api:report` añaden un paso previo en Windows que borra un `cucumber-report.html` existente para evitar confusiones.

---

## Estructura del proyecto (POM + BDD)

```
restful-booker-testing/
├── api/                # API: features + steps (axios) — Restful Booker
├── constants/          # URLs y mensajes
├── data/               # Datos de prueba
├── docs/               # Documentación (p. ej. notas de API)
├── features/           # Escenarios Gherkin UI
│   ├── step_definitions/
│   └── support/
├── pages/              # Page Object Models
├── reports/            # Reportes y, en su caso, screenshots
├── cucumber.js
└── package.json
```

---

## Flujos cubiertos

| ID | Flujo | Tipo |
|----|-------|------|
| F-01 | Reserva de habitación | UI + API |
| F-02 | Verificación de disponibilidad | UI |
| F-03 | Envío de mensaje de contacto | UI |
| F-04 | Autenticación y sesión administrativa | UI |
| F-05 | Gestión de habitaciones | UI |
| F-06 | Gestión de mensajes y contenido en home | UI |

---

## Equipo

| Integrante | Área |
|------------|------|
| Celeste Olmedo | Academia C&S |
| Noelia Mustaff | Academia C&S |
| Martin Cabrera | Academia C&S |

---
