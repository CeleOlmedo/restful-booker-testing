# Día 38 Proyecto Final - Análisis y Planificación - Mustaff, Cabrera, Quintana y Olmedo

## Historia: HU-01 | Booking
Como huésped del hotel
Quiero reservar una habitación seleccionando fechas y completando mis datos personales
Para asegurar mi estadía y conocer de inmediato si la reserva fue aceptada o rechazada

*Valor de negocio:* La reserva concentra el valor principal del negocio (ocupación e ingresos) y es el flujo con mayor exposición a errores de datos y disponibilidad.

*Criterios de aceptación:*

- Puedo completar el flujo público de reserva seleccionando fechas y completando los campos requeridos por el formulario.
- Con datos válidos y fechas coherentes según la regla acordada por el equipo, el sistema muestra un resultado observable de éxito (confirmación o estado equivalente).
- Con datos inválidos (por ejemplo nombre/apellido fuera de rango, email inválido, teléfono fuera de 11–21 caracteres), el sistema no finaliza una reserva válida y muestra retroalimentación asociada a la causa.
- Con fechas inconsistentes (por ejemplo salida anterior a entrada) o con fechas pasadas, el comportamiento es explícito y documentado como “esperado” o “defecto”, sin ambigüedad en las pruebas.
- En escenarios de conflicto de disponibilidad (por ejemplo fechas ocupadas o doble reserva en el mismo rango), el sistema comunica el fallo de forma observable (mensaje o estado de error acorde a lo verificado en la demo).

*Notas de QA (supuestos/riesgos/preguntas):*

Supuesto: las reglas de datos observadas en exploración son la referencia hasta contar con especificación formal del producto.
Riesgo: entorno demo compartida; conviene usar fechas dinámicas/ventanas únicas para reducir colisiones entre equipos o corridas.
Pregunta (definición de equipo): ¿Las fechas pasadas deben ser rechazadas por negocio o se cataloga como bug si el sistema las acepta?

---

## Historia: HU-02 | Verificar Disponibilidad
Como huésped
Quiero verificar la disponibilidad de habitaciones para un rango de fechas
Para decidir con información confiable si continúo con la reserva

*Valor de negocio:* La disponibilidad es el paso previo a la conversión; información degradada o inconsistente aumenta abandono y errores en el embudo de reserva.

*Criterios de aceptación:*

- Puedo ejecutar la verificación de disponibilidad ingresando un rango de fechas de forma coherente con la UI.
- Tras una verificación con fechas válidas, el resultado es observable (listado/filtrado/mensaje) y permite decidir el siguiente paso del flujo.
- Antes y después de verificar disponibilidad, la información esencial de la tarjeta de habitación permanece íntegra (por ejemplo imagen y descripción); si no ocurre, se registra como defecto y los casos contrastan comportamiento actual vs esperado.
- Si la verificación no puede completarse, recibo feedback claro (error visible o estado equivalente), sin quedar en un resultado ambiguo.

*Notas de QA (supuestos/riesgos/preguntas):*

Riesgo conocido: regresión en tarjetas tras verificar disponibilidad; puede romper asserts UI basados en imagen/texto de tarjeta.
Supuesto: la “disponibilidad correcta” se valida contra el comportamiento observable del sistema, no contra un inventario fijo desconocido en demo compartida.
Pregunta: ¿La verificación debe validarse contra una habitación específica o basta el comportamiento del listado general?

---

## Historia: HU-03 | Enviar mensaje de contacto
Como visitante del sitio
Quiero enviar un mensaje de contacto con mis datos y el detalle de mi consulta
Para comunicarme con el establecimiento y saber si el mensaje fue enviado o qué debo corregir

*Valor de negocio:* El contacto canaliza leads y soporte; validaciones claras reducen ruido operativo y mejoran la calidad de los mensajes recibidos.

*Criterios de aceptación:*

- Puedo enviar un mensaje cuando cumplo reglas observadas: nombre con al menos 1 carácter, email válido, asunto entre 5 y 100 caracteres, teléfono entre 11 y 21 caracteres, mensaje entre 20 y 2000 caracteres.
- Con datos válidos, el sistema muestra confirmación observable de envío o un estado explícito de éxito equivalente.
- Con datos inválidos o fuera de rango, el sistema impide el envío y muestra errores comprensibles asociados a la restricción incumplida.
- Los casos límite exactos (5/100 en asunto, 20/2000 en mensaje, 11/21 en teléfono) son reproducibles y tienen resultado esperado definido.

*Notas de QA (supuestos/riesgos/preguntas):*

Supuesto: si aparece un máximo real para “nombre”, se ajustan casos; hasta entonces se prueba mínimo y strings largos como edge controlado.
Riesgo: ambigüedad entre pantallas (“validaciones débiles” en algunas vistas); anclar casos a la pantalla de contacto explícitamente.
Pregunta: si el teléfono acepta cualquier carácter cumpliendo longitud, documentar si es bug o regla real y cubrir edges (letras/símbolos).

---

## Historia: HU-04 | Inicio sesión administrador
Como administrador del sistema
Quiero iniciar sesión y cerrar sesión de manera controlada
Para operar módulos sensibles solo cuando estoy autenticado

*Valor de negocio:* La autenticación protege inventario, reservas y comunicación operativa; un fallo amplifica riesgo de datos y acciones indebidas.

*Criterios de aceptación:*

- Con credenciales válidas, accedo al área administrativa y puedo operar funciones que requieren sesión.
- Con credenciales inválidas, no obtengo acceso administrativo y el sistema muestra feedback coherente con el fallo.
- Sin sesión iniciada, no puedo ejecutar acciones administrativas sensibles (bloqueo, redirección o equivalente observable).
- Al cerrar sesión, pierdo acceso a módulos administrativos hasta autenticarme nuevamente.

*Notas de QA (supuestos/riesgos/preguntas):*

Supuesto: credenciales provistas por el curso/demo; evitar exposición innecesaria en repositorio público (variables de entorno / instructivo interno).
Riesgo: variabilidad de sesión en demo; definir evidencia estable para “post-logout” sin depender de detalles frágiles.
Pregunta: ¿existen roles distintos de admin? Si no, mantener casos mínimos centrados en admin único.

---

## Historia: HU-05 | Gestion de habitaciones como administrador
Como administrador
Quiero crear, listar y editar habitaciones en el módulo de Rooms
Para mantener el inventario publicado consistente y usable por huéspedes

*Valor de negocio:* Inventario duplicado o inconsistente genera confusión, fricción en reservas y carga de soporte; una gestión estable reduce incidentes operativos.

*Criterios de aceptación :*

- Puedo crear una habitación nueva con datos válidos y verla reflejada en el listado administrativo.
- Puedo editar una habitación existente y observar los cambios reflejados en el listado o vista de detalle admin.
- Si la regla de negocio exige unicidad por número y/o nombre, el sistema impide duplicados con mensaje claro; si permite duplicados, se documenta como defecto y los casos reflejan el comportamiento real.
- Las operaciones de gestión requieren sesión administrativa válida (coherente con HU-04).

*Notas de QA (supuestos/riesgos/preguntas):*

Hallazgo exploratorio: posible creación duplicada por número/nombre; acordar expectativa (bloqueo vs bug) para no contradecir resultados esperados en Azure.
Riesgo: colisiones por datos repetidos entre equipos; usar nombres/números únicos por corrida.
Pregunta: ¿los cambios admin se reflejan de inmediato en la vista pública? Definir evidencia de verificación cruzada admin→público cuando aplique.

---

## Historia: HU-06 | Gestión de mensajes y branding
Como administrador
Quiero gestionar mensajes y el contenido relevante de la página principal
Para comunicar información actualizada a visitantes y huéspedes

*Valor de negocio:* La comunicación en home y la gestión de mensajes impacta conversión y percepción de marca; fallos aquí son altamente visibles.

*Criterios de aceptación:*

- Puedo ejecutar en la demo las acciones administrativas disponibles para mensajes y/o contenido de home (según exponga la UI) y observar confirmación o estado final claro en el panel.
- Cuando un cambio deba reflejarse públicamente, puedo verificarlo en la superficie pública correspondiente; si no aplica, la verificación se basa en evidencia administrativa explícita (listado, estado, confirmación).
- Si el módulo es inestable o poco determinístico para automatización, la cobertura queda garantizada por pruebas manuales documentadas en Azure, manteniendo trazabilidad y criterios observables.

*Notas de QA (supuestos/riesgos/preguntas):*

Condición del proyecto (F-06): automatizar solo si no introduce fragilidad; si no, priorizar manual + evidencias.
Riesgo: dependencia de copy/texto o widgets cambiantes entre demos; preferir asserts de comportamiento donde exista ancla estable.
Pregunta: separar explícitamente “mensajes entrantes” vs “edición de contenido de home” si en la UI son módulos distintos, para no mezclar criterios.