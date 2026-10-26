# Guion de defensa — EPMAPS Lecturas

Duración objetivo: 8–10 minutos. Orden pensado para que cada requisito se vea funcionando, no solo se mencione.

## Antes de entrar al aula

- APK `preview` instalado en el teléfono Android (no Expo Go).
- Batería suficiente y brillo alto.
- Probar una vez el login y borrar los datos de la app si se quiere partir de cero.
- Verificar que MockAPI responde y tiene los ocho medidores: `node scripts/seed-mockapi.mjs`. Si se quiere el historial limpio, ejecutar antes `node scripts/seed-mockapi.mjs --reset-lecturas`.
- Abrir la app una vez con internet para que la ruta quede en la caché; después se puede demostrar el modo avión.
- Tener a mano el modo avión y la pantalla de “Recientes” para demostrar R8.
- Confirmar que el teléfono tiene la hora y fecha correctas: el periodo del mes se calcula con `new Date()`.

## 1. Login y sesión (R1) — 40 s

1. Abrir la app: se ve el login con la marca EPMAPS.
2. Ingresar `EMP-001` / `epmaps2026`.
3. Cerrar la app desde recientes y abrirla otra vez: entra directo a Mi ruta.

**Qué decir:** “La clave no se guarda; solo el perfil del técnico. Cerrar sesión limpia la caché de consultas.”

## 2. Código y caché (R2, R3) — 1 min

1. En “Consultar un medidor”, escribir `MED-123` y pulsar Consultar. No navega y explica el formato.
2. Escribir `MED-100001` y abrir el detalle.
3. Mostrar los siete datos: código, dirección, sector, cuenta, estado, última lectura y fecha.
4. Activar modo avión, volver a Mi ruta y abrir otra vez `MED-100001`.

**Qué decir:** “La consulta se desactiva si el código no cumple `MED-` + seis dígitos. La segunda consulta sale de la caché persistida en AsyncStorage; no se queda en pantalla de error.”

## 3. Lectura normal y cola (R4, R5, R9) — 1 min

1. En `MED-100001`, tocar “Registrar lectura”.
2. Elegir Normal, ingresar una lectura (por ejemplo 263) y mostrar el consumo calculado.
3. Guardar. El aviso dice que queda pendiente de verificación.
4. Ir a Historial: la tarjeta dice “Por enviar”.

**Qué decir:** “La lectura no se envía directo al servidor. Se guarda primero en un outbox local; si hay señal se envía a MockAPI, y si no, sobrevive al cierre de la app.”

## 4. Anomalía (R6) — 1 min

1. Abrir `MED-100003` (última 50, promedio 8).
2. Registrar una lectura de `100`.
3. Mostrar la alerta: el límite es 24 m³ y el consumo es 50 m³.
4. Intentar guardar sin confirmar: aparece el error.
5. Confirmar “revisé el medidor” y guardar.

**Qué decir:** “La regla es estrictamente mayor que el triple del promedio. La confirmación se exige en la interfaz y la lectura se marca como anómala para la oficina.”

## 5. Dañado y foto (R7) — 1 min

1. Abrir `MED-100004`, elegir Dañado.
2. Intentar guardar sin foto: error de foto obligatoria.
3. Tomar la foto y guardar.
4. Mostrar la miniatura en Historial.

**Qué decir:** “La cámara entrega un archivo temporal; lo copio al directorio de documentos para que la evidencia sobreviva al reinicio. Si el permiso se niega, la app explica y ofrece ajustes; solo bloquea cuando la foto es obligatoria.”

## 6. Borrador (R8) — 40 s

1. Abrir otro medidor y llenar estado y lectura.
2. Mandar la app al fondo y cerrarla desde recientes.
3. Abrir de nuevo: aparece “Tienes un registro sin terminar”.
4. Elegir Continuar y mostrar que los datos y la foto siguen allí.

**Qué decir:** “El borrador se guarda con debounce y también cuando la app pasa a segundo plano. Al descartarlo se borra también el archivo de la foto.”

## 7. Sincronización (R9, R10) — 1 min

1. Con dos o tres pendientes en Historial, desactivar modo avión.
2. Mostrar el banner “Sincronizando…” y cómo baja el contador.
3. Abrir el panel de MockAPI y mostrar el recurso `lecturas` con la lectura recibida.
4. Mostrar una enviada: no tiene botón Corregir, dice “solo lectura”.
5. En una pendiente, tocar Corregir, cambiar la lectura y guardar.
6. Intentar registrar dos veces el mismo medidor y mes: se rechaza.

**Qué decir:** “La cola envía en orden a MockAPI. Cada lectura lleva una idempotencia; si el envío se corta después de que el servidor guardó, al reintentar devuelve la misma lectura y no crea otra. Antes de insertar se consulta medidor + periodo para rechazar duplicados.”

## 8. Cierre — 30 s

**Qué decir:** “La app cumple R1–R10. Las decisiones están en ocho ADR: caché con TanStack Query, outbox idempotente, borrador, fotos, validación, sesión, mock local descartado y MockAPI como único backend. Las limitaciones conscientes son: la primera carga necesita internet, el login se valida en el teléfono porque la prueba permite datos quemados, la sesión no está cifrada y la sincronización no corre en segundo plano.”

## Preguntas probables y respuestas cortas

| Pregunta | Respuesta |
| --- | --- |
| ¿Por qué TanStack Query y no Redux? | El 90 % del estado es del servidor; TanStack ya da caché, reintentos, invalidación y persistencia. Redux habría agregado un store global y más boilerplate. |
| ¿Por qué no guardaste las mutaciones en TanStack? | R10 necesita listar y corregir pendientes. La caché de mutaciones no ofrece esa lista como API pública; el outbox sí. |
| ¿Cómo evitas duplicados si se corta la señal? | La lectura nace con una `idempotencia` única que se conserva en el outbox. Antes de insertar, el adaptador busca esa clave en MockAPI; si ya está, devuelve la existente. |
| ¿Qué pasa si el teléfono se reinicia con una lectura pendiente? | El outbox está en AsyncStorage; al abrir, el proveedor lo lee y sincroniza si hay red. Si quedó en `enviando`, se reenvía con la misma clave. |
| ¿Por qué no SecureStore? | No está instalado y la prueba no pide cifrado. Se documentó como mejora de producción; la clave nunca se guarda. |
| ¿Por qué MockAPI y no un mock local? | El enunciado pide una herramienta mock real; MockAPI da HTTP verificable. Sin señal, la app sigue con la caché de TanStack Query, la copia de medidores en AsyncStorage y el outbox. |
| ¿Cómo se prueba la foto tras reiniciar? | Se copia de la caché a `Paths.document/fotos-medidores` y se guarda la URI en el borrador/lectura. |
| ¿Qué pasa si el cliente reclama por consumo alto? | La lectura guarda consumo, promedio, bandera de anomalía y foto; el historial conserva la evidencia y la fecha. |
| ¿Por qué no hay edición de enviadas? | R10 lo prohíbe; la UI oculta acciones y el adaptador de MockAPI no expone `PUT` sobre `lecturas` confirmadas. |
| ¿Qué mejorarías con más tiempo? | SecureStore, sincronización en segundo plano, cifrado y subida de fotos, pruebas unitarias de `validators.ts` y un backend propio con autenticación e índice único. |

## Frase de cierre

“La app está pensada para el peor escenario: sin señal, con el teléfono bajo el brazo y un medidor que no se puede leer. Todo lo que el técnico ingresa queda en el teléfono; la oficina recibe una sola versión, con foto y trazabilidad.”
