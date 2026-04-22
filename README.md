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
# Ejecutar la suite UI configurada en Cucumber
npm run test:ui

# Ejecutar la suite UI en modo headed
npm run test:ui:headed

# Ejecutar solo escenarios de contacto (@ui @contact)
npm run test:ui:contact
```

La ejecución UI usa `DEBUG=pw:api` para registrar logs de Playwright API.
Si querés screenshots en fallos, activalos con `SCREENSHOT_ON_FAIL=true`.

```bash
# Ejemplo (PowerShell)
$env:SCREENSHOT_ON_FAIL="true"; npm run test:ui
```

---

## 📁 Estructura del proyecto (POM + BDD)

```
restful-booker-testing/
├── constants/          # URLs y mensajes reutilizables
├── data/               # Datos de prueba centralizados
├── pages/              # Page Object Models
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── BookingPage.js
│   ├── ContactPage.js
│   ├── AdminPage.js
│   └── RoomsAdminPage.js
├── features/           # Escenarios Gherkin
│   ├── booking.feature
│   ├── contact.feature
│   ├── admin_login.feature
│   ├── rooms_admin.feature
│   ├── step_definitions/
│   │   ├── common.steps.js
│   │   ├── booking.steps.js
│   │   ├── contact.steps.js
│   │   ├── admin_login.steps.js
│   │   └── rooms_admin.steps.js
│   └── support/
│       ├── world.js
│       └── hooks.js
├── reports/            # Evidencia de ejecución
│   └── screenshots/
├── cucumber.js
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
| Celeste Olmedo | Academia C&S |
| Noelia Mustaff | Academia C&S |
| Martin Cabrera | Academia C&S |
| Agustin Quintana | Academia C&S |

---