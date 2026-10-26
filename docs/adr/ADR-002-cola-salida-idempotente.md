# ADR-002: Sincronizar las lecturas con una cola de salida local e idempotencia

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R4, R9 y R10.

## Contexto

R4 permite registrar lecturas sin señal y dejarlas pendientes. R9 exige enviarlas solas al recuperar la conexión, sin duplicarlas si la señal se corta en medio del envío, y mostrar en todas las pantallas cuántas quedan. R10 exige poder corregir una lectura pendiente, no una enviada, y rechazar dos lecturas del mismo medidor en el mismo mes.

Una mutación pausada de TanStack Query conserva los datos, pero no ofrece una lista editable y observable de pendientes para el historial ni un estado de error por lectura. La app necesita esa lista como parte de la interfaz.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Solo mutaciones pausadas de TanStack Query | Menos código; reintento automático; ya está integrado. | No se pueden listar ni corregir fácilmente; cada mutación necesita `setMutationDefaults`; el historial de pendientes queda oculto en la caché. |
| Outbox en AsyncStorage + motor de sincronización | Lista editable, estado por lectura, idempotencia explícita y fácil de mostrar en la defensa. | Hay que programar la cola, el orden y el manejo de errores; AsyncStorage no es una base transaccional. |
| Cola en SQLite / WatermelonDB | Transacciones y consultas robustas. | Configuración nativa y migraciones; sobredimensionado para pocas lecturas por jornada. |
| Enviar al guardar y reintentar desde el estado del componente | Menos archivos. | Si la app se cierra se pierde la cola; no cumple R9. |

## Decisión

Se implementa un **outbox** persistido en AsyncStorage (`EPMAPS_OUTBOX`) con la forma `LecturaLocal`. Cada lectura nace con:

- `id` local y `idempotencia` única.
- `estadoSync`: `pendiente`, `enviando` o `error`.
- `periodo` con formato `YYYY-MM`.

El motor `sincronizarCola` recorre las pendientes en orden, las marca `enviando`, llama a `enviarLectura` y las elimina del outbox solo cuando el servidor confirma. Si el envío falla por red, vuelve a `pendiente` y se detiene para no insistir sin conexión. Si el servidor responde `DUPLICADA`, queda en `error` para que el técnico la revise.

La idempotencia se logra enviando siempre el mismo `idempotencia`; el mock guarda las lecturas y devuelve la existente si ya la recibió. Así, un corte después de guardar en el servidor pero antes de borrar el outbox no produce un duplicado.

NetInfo dispara la sincronización al volver la conexión. El contador de pendientes se muestra en el banner global.

## Consecuencias

- Las lecturas sobreviven al cierre de la app y al modo avión.
- El historial puede listar, corregir y descartar pendientes; las enviadas quedan de solo lectura.
- **Desventaja:** la cola es código propio que hay que probar y explicar; no hay transacciones reales.
- **Riesgo:** si se cierra la app, la sincronización se detiene hasta el siguiente arranque. En esta prueba no se usa `expo-background-task`.
- **Riesgo:** el envío es secuencial; con muchas lecturas tarda, pero evita condiciones de carrera y duplicados.
- **Obligación:** toda lectura se guarda primero en el outbox, nunca directamente en el servidor.
- **Obligación:** la foto se guarda en disco antes de encolar la lectura.

## Verificación

- En modo avión se guarda una lectura y aparece en Historial como pendiente.
- Al volver la red, se envía sola y el contador del banner baja.
- Si se cierra la app durante el envío y se vuelve a abrir, la lectura se reenvía y el mock la recibe una sola vez.
- Un segundo registro del mismo medidor y mes se rechaza en la app y en el mock.
- Una lectura pendiente muestra el botón Corregir; una enviada no.

## Uso de IA

La IA propuso usar solo mutaciones pausadas de TanStack Query. Se descartó porque R10 exige listar y corregir pendientes, y esa lista no existe como API pública de la caché de mutaciones.

También propuso enviar en paralelo y generar el id con la librería `uuid`. Se descartó el paralelismo para mantener el orden y reducir duplicados, y se generó la idempotencia con código, fecha y número aleatorio para no agregar otra dependencia.
