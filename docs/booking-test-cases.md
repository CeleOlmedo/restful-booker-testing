# Casos de prueba – HU-RES-01 (Reserva de habitación)

## Flujo asociado
F-01 — Reserva de habitación

## Objetivo
Validar el correcto funcionamiento del flujo de reserva, incluyendo validaciones de datos, fechas y comportamiento ante errores.

---

## Casos de prueba

TC-RES-001 – Reserva exitosa
Tipo: Happy Path
Precondición: Usuario en la página principal
Pasos:
1. Ingresar fechas válidas
2. Completar datos correctamente
3. Confirmar reserva
Resultado esperado: El sistema muestra confirmación de reserva

---

TC-RES-002 – Fecha de inicio pasada
Tipo: Negativo
Resultado esperado: El sistema no permite continuar o muestra error

---

TC-RES-003 – Check-out menor a check-in
Tipo: Negativo
Resultado esperado: Error de validación

---

TC-RES-004 – Email inválido
Tipo: Negativo
Resultado esperado: Error en el campo email

---

TC-RES-005 – Teléfono con letras
Tipo: Edge / Defecto
Resultado esperado: El sistema debería rechazarlo (actualmente lo permite → bug)

---

TC-RES-006 – Reserva duplicada en mismas fechas
Tipo: Negativo
Resultado esperado: El sistema impide la reserva o muestra error