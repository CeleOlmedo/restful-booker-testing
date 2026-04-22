# Notas tecnicas de ejecucion UI

## Problemas encontrados y resolucion

- No existia configuracion ejecutable para Cucumber + Playwright en el repositorio.
  - Se agrego `package.json` con scripts `test:ui`, `test:ui:headed` y `test:ui:contact`.
- No existia `world`/`hooks` para ciclo de vida del browser.
  - Se implemento `features/support/world.js` y `features/support/hooks.js`.
- No habia captura de evidencia en error.
  - Se agrego screenshot automatico al fallar un escenario en `reports/screenshots/`.
- El proyecto no tenia estructura POM funcional.
  - Se implementaron `BasePage`, `HomePage`, `ContactPage` y `BookingPage` con locators centralizados y metodos de negocio.

## Decisiones tecnicas

- Los steps solo orquestan y delegan acciones de UI a los metodos de `pages/`.
- Las URLs, mensajes y datos de prueba se centralizan en `constants/` y `data/`.
- Se usa validacion HTML nativa del navegador para escenarios negativos de contacto.

## Comandos recomendados

```bash
npm install
npx playwright install
npm run test:ui
```
