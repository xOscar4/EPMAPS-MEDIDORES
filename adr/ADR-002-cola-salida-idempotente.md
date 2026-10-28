# ADR-002: Sincronizar las lecturas con una cola de salida local e idempotencia

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R4, R9 y R10.

## Contexto

R4 permite registrar lecturas sin señal y dejarlas pendientes. R9 exige enviarlas solas al recuperar la conexión, sin duplicarlas si la señal se corta en medio del envío, y mostrar en todas las pantallas cuántas quedan. R10 exige poder corregir una lectura pendiente, no una enviada, y rechazar dos lecturas del mismo medidor en el mismo mes.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Solo mutaciones pausadas de TanStack Query | Menos código; reintento automático; ya está integrado. | No se pueden listar ni corregir fácilmente; cada mutación necesita `setMutationDefaults`; el historial de pendientes queda oculto en la caché. |
| Outbox en AsyncStorage + motor de sincronización | Lista editable, estado por lectura, idempotencia explícita y fácil de mostrar en la defensa. | Hay que programar la cola, el orden y el manejo de errores; AsyncStorage no es una base transaccional. |

## Decisión

Se implementa un **outbox** persistido en AsyncStorage (`EPMAPS_OUTBOX`) con la forma `LecturaLocal`. Cada lectura nace con:

- `id` local y `idempotencia` única.
- `estadoSync`: `pendiente`, `enviando` o `error`.

## Consecuencias

- Las lecturas sobreviven al cierre de la app y al modo avión.
- El historial puede listar y corregir las lecturas en estado `pendiente` y descartar las pendientes o con error; las enviadas quedan de solo lectura.
- **Limitación:** una lectura en `error` (por ejemplo, duplicada) no se reintenta automáticamente ni se edita desde la tarjeta; se revisa y se descarta. La corrección está disponible mientras la lectura sigue en `pendiente`.

## Verificación

- En modo avión se guarda una lectura y aparece en Historial como pendiente.
- Al volver la red, se envía sola y el contador del banner baja.
- Si se cierra la app durante el envío y se vuelve a abrir, la lectura se reenvía y MockAPI la recibe una sola vez.

## Uso de IA

La IA propuso usar solo mutaciones pausadas de TanStack Query. Se descartó porque R10 exige listar y corregir pendientes, y esa lista no existe como API pública de la caché de mutaciones.
