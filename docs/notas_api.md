# Parte B — Tests de API con axios

Los tests de API viven bajo la carpeta **`api/`** y se ejecutan con **Cucumber**; el cliente HTTP es **axios** (ver `api/api.steps.js`).

- **Comando:** `npm run test:api`
- **Con reporte HTML:** `npm run test:api:report` (el HTML se genera en `reports/cucumber-report.html`).

> La UI del curso se sirve en `https://automationintesting.online`. Las pruebas de API apuntan a la instancia pública de **Restful Booker** en **`https://restful-booker.herokuapp.com`**.

---

## Dónde está el código

| Archivo | Rol |
|---------|-----|
| `api/api.feature` | Escenarios: listar (GET), crear (POST), actualizar (PUT), borrar (DELETE) y comprobación tras borrado. |
| `api/api.steps.js` | Implementación: llamadas `axios` a `/booking`, `/auth` y manejo de `Cookie: token=…` en PUT/DELETE. |

---

## Endpoints probados

**Base URL:** `https://restful-booker.herokuapp.com`

| Método | Ruta | Uso en el proyecto |
|--------|------|--------------------|
| `GET` | `/booking` | Listar IDs de reservas. |
| `POST` | `/booking` | Crear una reserva. |
| `POST` | `/auth` | Obtener token para operaciones autenticadas (usuario `admin`). |
| `PUT` | `/booking/:id` | Actualizar una reserva creada previamente. |
| `DELETE` | `/booking/:id` | Eliminar reserva. |
| `GET` | `/booking/:id` | Tras un DELETE, verificar que el recurso ya no existe (404). |

**Cobertura mínima de la consigna (GET y POST):** cubierta en los escenarios *"Listar booking ids (GET)"* y *"Crear booking (POST)"*. El proyecto va más allá e incluye PUT y DELETE.

---

## Qué valida cada flujo

### Listar — `GET /booking`

- Status **200**.
- Cuerpo: **array**. Si tiene elementos, cada ítem es un **objeto** con **`bookingid` numérico**.

### Crear — `POST /booking`

- Status **200**.
- Respuesta con **`bookingid`** y objeto **`booking`**; se comparan con el payload enviado: `firstname`, `lastname`, `totalprice`, `depositpaid`, fechas `checkin`/`checkout`.

### Autenticar — `POST /auth`

- Status **200** y presencia de **`token`** en la respuesta.
- El token se reutiliza en `Cookie: token=…` para las llamadas PUT y DELETE.

### Actualizar — `PUT /booking/:id`

- Requiere header `Cookie: token=…`.
- Status **200**; el cuerpo devuelto se compara con los nuevos valores de `firstname`, `lastname`, `totalprice`, `depositpaid` y fechas.

### Borrar y verificar — `DELETE /booking/:id` + `GET /booking/:id`

- DELETE: la API responde **201** en borrado exitoso.
- GET al mismo `id` después del borrado: se espera **404**.

---

## Ejemplos de request/response

### `GET /booking`

**Request:**

```http
GET /booking HTTP/1.1
Host: restful-booker.herokuapp.com
Accept: application/json
```

**Response — 200:**

```json
[
  { "bookingid": 12 },
  { "bookingid": 34 }
]
```

*Los IDs reales dependen del entorno; el test valida estructura y tipos, no un ID fijo.*

---

### `POST /booking`

**Request:**

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

**Response — 200:**

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

### `POST /auth`

**Request:**

```json
{ "username": "admin", "password": "password123" }
```

**Response — 200:**

```json
{ "token": "abc123def456" }
```

El token recibido se usa en las llamadas PUT y DELETE como `Cookie: token=abc123def456`.

---

### `PUT /booking/:id`

**Request (con header de autenticación):**

```http
PUT /booking/101 HTTP/1.1
Host: restful-booker.herokuapp.com
Content-Type: application/json
Cookie: token=abc123def456
```

```json
{
  "firstname": "Maria",
  "lastname": "Lopez",
  "totalprice": 200,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2026-05-01",
    "checkout": "2026-05-07"
  },
  "additionalneeds": "Lunch"
}
```

**Response — 200:** cuerpo con los datos actualizados (misma estructura que POST /booking sin el `bookingid` envolvente).

---

### `DELETE /booking/:id` + verificación

**Request:**

```http
DELETE /booking/101 HTTP/1.1
Host: restful-booker.herokuapp.com
Cookie: token=abc123def456
```

**Response — 201:** (comportamiento del demo; el test asume este código).

**GET posterior:**

```http
GET /booking/101 HTTP/1.1
Host: restful-booker.herokuapp.com
```

**Response — 404:** confirma que el recurso fue eliminado.

---

## Resultados de la última ejecución

| Métrica    | Valor                  |
|------------|------------------------|
| Escenarios | 4                      |
| Resultado  | **4 passed, 0 failed** |
| Pasos      | 21 passed              |

Reporte completo: `reports/cucumber-report-api.html`.
