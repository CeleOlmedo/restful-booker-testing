# Parte B — Tests de API con axios

Los tests de API viven bajo la carpeta **`api/`** y se ejecutan con **Cucumber**; el cliente HTTP es **axios** (ver `api/api.steps.js`).

- **Comando:** `npm run test:api`
- **Con reporte HTML (como en UI):** `npm run test:api:report` (el HTML se genera bajo `reports/`, p. ej. `cucumber-report.html`).

> La UI del curso se sirve en `https://automationintesting.online`. Las pruebas de API apuntan a la instancia pública de **Restful Booker** en **`https://restful-booker.herokuapp.com`**, alineada con el nombre del repositorio y con el flujo demo “restful-booker”.

---

## Dónde está el código

| Archivo | Rol |
|--------|-----|
| `api/api.feature` | Escenarios: listar (GET), crear (POST), actualizar (PUT), borrar (DELETE) y comprobación tras borrado. |
| `api/api.steps.js` | Implementación: llamadas `axios` a `/booking`, `/auth` y manejo de `Cookie: token=…` en PUT/DELETE. |

---

## Endpoints probados

Misma **base** para todos: `https://restful-booker.herokuapp.com`

| Método | Ruta (relativa) | Uso en el proyecto |
|--------|-----------------|--------------------|
| `GET` | `/booking` | Listar IDs de reservas. |
| `POST` | `/booking` | Crear una reserva. |
| `POST` | `/auth` | Obtener token (usuario `admin`, password del demo) para operaciones autenticadas. |
| `PUT` | `/booking/:id` | Actualizar una reserva creada antes. |
| `DELETE` | `/booking/:id` | Eliminar reserva. |
| `GET` | `/booking/:id` | Tras un DELETE, se espera comprobar que el recurso ya no existe. |

**Requisito mínimo de la consigna (GET y POST):** quedan cubiertos en los escenarios *“Listar booking ids (GET)”* y *“Crear booking (POST)”*.

---

## Qué validan (resumen por flujo)

### Listar — `GET /booking`

- Status **200**.
- Cuerpo: **array**. Si tiene elementos, cada ítem es un **objeto** con **`bookingid` numérico**.

### Crear — `POST /booking`

- Status **200** (o falla con error explícito en el step).
- Respuesta con **`bookingid`** y objeto **`booking`**; se comparan con el cuerpo enviado: `firstname`, `lastname`, `totalprice`, `depositpaid`, fechas `checkin`/`checkout` y coherencia general con el payload de creación.

### Autenticar — `POST /auth` (soporta escenarios que modifican o borran)

- Status **200** y presencia de **`token`** en la respuesta.

### Actualizar — `PUT /booking/:id`

- Requiere cookie **`token=…`**.
- Status **200**; el cuerpo devuelto se compara con los nuevos `firstname`, `lastname`, `totalprice`, `depositpaid` y fechas.

### Borrar y verificar — `DELETE` + `GET /booking/:id`

- DELETE: la API de este demo suele responder **201** en borrado correcto; el test lo asume.
- `GET` al mismo `id` después del borrado: se espera **404**.

---

## Ejemplos de request/response (resumidos)

### `GET /booking`

**Request (esencial):**

```http
GET /booking HTTP/1.1
Host: restful-booker.herokuapp.com
Accept: application/json
```

**Response (ilustrativa):** `200` con cuerpo tipo:

```json
[ { "bookingid": 12 }, { "bookingid": 34 } ]
```

*(Los ids reales dependen del entorno; el test valida estructura y tipos, no un id fijo.)*

---

### `POST /booking`

**Request (cuerpo JSON, tal como se usa al crear; valores pueden variar por escenario):**

```json
{
  "firstname": "Juan",
  "lastname": "Perez",
  "totalprice": 123,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-04-01",
    "checkout": "2026-04-05"
  },
  "additionalneeds": "Breakfast"
}
```

**Response (estructura típica):**

```json
{
  "bookingid": 101,
  "booking": {
    "firstname": "Juan",
    "lastname": "Perez",
    "totalprice": 123,
    "depositpaid": true,
    "bookingdates": { "checkin": "2026-04-01", "checkout": "2026-04-05" },
    "additionalneeds": "Breakfast"
  }
}
```

---

### `POST /auth` (referencia, para PUT/DELETE)

**Request (credenciales por defecto del demo en el `Given` del feature):**

```json
{ "username": "admin", "password": "password123" }
```

**Response (esencial):** `200` con cuerpo que incluye al menos un **`token`** reutilizable en `Cookie: token=…` en `PUT` y `DELETE` sobre `/booking/:id`.

---

## Nota sobre `tests/api/`

En `package.json` puede constar el script `test:api:axios` (runner de Node para archivos bajo `tests/api/`). La **Parte B** documentada aquí corresponde a la implementación con **axios** en `api/api.steps.js` y escenarios en `api/api.feature`, ejecutada con `npm run test:api`.
