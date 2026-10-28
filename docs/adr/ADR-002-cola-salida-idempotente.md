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

El motor `sincronizarCola` recorre las pendientes en orden, las marca `enviando`, llama a `enviarLectura` y las elimina del outbox solo cuando MockAPI confirma. Si el envío falla por red, vuelve a `pendiente` y detiene esa pasada para no insistir sin conexión. Si el servidor responde `DUPLICADA`, queda en `error` y no se reintenta sola. Una lectura que quedó en `enviando` porque la app murió se vuelve a incluir al arrancar.

La idempotencia se logra enviando siempre el mismo `idempotencia`; MockAPI guarda las lecturas y devuelve la existente si ya la recibió. Así, un corte después de guardar en el servidor pero antes de borrar el outbox no produce un duplicado.

La app comprueba el duplicado por `medidorCodigo + periodo` en `persistirLectura` contra el outbox y el historial; `enviarLectura` repite la consulta contra MockAPI antes del `POST`.

El `OutboxProvider` dispara la sincronización al recuperar la conexión, al arrancar con red, al volver la app a primer plano y cada 20 s mientras haya pendientes. Un flag evita ejecuciones simultáneas. El contador de pendientes se muestra en el banner global.

## Consecuencias

- Las lecturas sobreviven al cierre de la app y al modo avión.
- El historial puede listar y corregir las lecturas en estado `pendiente` y descartar las pendientes o con error; las enviadas quedan de solo lectura.
- **Limitación:** una lectura en `error` (por ejemplo, duplicada) no se reintenta automáticamente ni se edita desde la tarjeta; se revisa y se descarta. La corrección está disponible mientras la lectura sigue en `pendiente`.
- **Desventaja:** la cola es código propio que hay que probar y explicar; no hay transacciones reales.
- **Riesgo:** si se cierra la app, la sincronización se detiene hasta el siguiente arranque. En esta prueba no se usa `expo-background-task`.
- **Riesgo:** el envío es secuencial; con muchas lecturas tarda, pero evita condiciones de carrera y duplicados.
- **Obligación:** toda lectura se guarda primero en el outbox, nunca directamente en el servidor.
- **Obligación:** la foto se intenta copiar a disco antes de encolar la lectura; si la copia falla, se conserva la URI temporal (ADR-004).

## Verificación

- En modo avión se guarda una lectura y aparece en Historial como pendiente.
- Al volver la red, se envía sola y el contador del banner baja.
- Si se cierra la app durante el envío y se vuelve a abrir, la lectura se reenvía y MockAPI la recibe una sola vez.
- Un segundo registro del mismo medidor y mes se rechaza en la app y en MockAPI.
- Una lectura en estado `pendiente` muestra el botón Corregir; una enviada no; una con error solo se puede descartar.

## Uso de IA

La IA propuso usar solo mutaciones pausadas de TanStack Query. Se descartó porque R10 exige listar y corregir pendientes, y esa lista no existe como API pública de la caché de mutaciones.

También propuso enviar en paralelo y generar el id con la librería `uuid`. Se descartó el paralelismo para mantener el orden y reducir duplicados, y se generó la idempotencia con código, fecha y número aleatorio para no agregar otra dependencia.
