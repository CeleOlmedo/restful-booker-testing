# restful-booker-testing

Test automation suite for the Restful Booker Platform — UI & API testing

> Proyecto integrador final — Curso de Testing  
> App objetivo: [automationintesting.online](https://automationintesting.online/)

---

## 🛠️ Tecnologías utilizadas

- [Playwright](https://playwright.dev/) — automatización UI
- [Cucumber](https://cucumber.io/) — BDD y documentación Gherkin
- [Axios](https://axios-http.com/) — testing de API
- [Allure](https://allurereport.org/) — reportes de ejecución
- JavaScript (Node.js)

---

## 📋 Requisitos previos

Antes de clonar el proyecto, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)

Podés verificar las versiones con:

```bash
node --version
git --version
```

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/CeleOlmedo/restful-booker-testing
cd restful-booker-testing

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install
```

---

## ▶️ Cómo ejecutar los tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests de UI
npm run test:ui

# Ejecutar solo tests de API
npm run test:api

# Ejecutar con reporte Allure
npm run test:report
```

> ⚠️ Los scripts de ejecución se irán completando a medida que avance el proyecto.

---

## 📁 Estructura del proyecto

```
restful-booker-testing/
├── constants/          # Constantes globales (URLs, timeouts, etc.)
├── data/               # Datos de prueba
├── pages/              # Page Object Models
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── BookingPage.js
│   └── ContactPage.js
├── features/           # Escenarios Gherkin y step definitions
│   ├── login.feature
│   ├── booking.feature
│   ├── contact.feature
│   ├── step_definitions/
│   │   ├── login.steps.js
│   │   ├── booking.steps.js
│   │   └── contact.steps.js
│   └── support/
│       ├── world.js
│       └── hooks.js
├── api/                # Tests de API con Axios
│   └── booking.api.test.js
├── reports/            # Reportes generados por Allure
│   └── screenshots/
├── playwright.config.js
└── package.json
```

---

## 🔀 Flujos cubiertos

| ID | Flujo | Tipo |
|----|-------|------|
| F-01 | Reserva de habitación | UI + API |
| F-02 | Verificación de disponibilidad | UI |
| F-03 | Envío de mensaje de contacto | UI |
| F-04 | Autenticación y sesión administrativa | UI |
| F-05 | Gestión de habitaciones | UI |
| F-06 | Gestión de mensajes y contenido en home | UI |

---

## 👥 Equipo

| Integrante | Área |
|---|---|
| Cele Olmedo | *(completar)* |
| *(completar)* | *(completar)* |
| *(completar)* | *(completar)* |
| *(completar)* | *(completar)* |

---

## 📎 Referencias

- [Repositorio en GitHub](https://github.com/CeleOlmedo/restful-booker-testing)
- [Documentación API — Postman](https://www.postman.com/automation-in-testing/restful-booker-collections/documentation/ci13ds3/restful-booker-platform)
- [Estrategia QA](./docs/estrategia.md)
