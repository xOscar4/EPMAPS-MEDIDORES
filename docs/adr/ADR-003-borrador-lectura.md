# ADR-003: Guardar un borrador de lectura en AsyncStorage y restaurarlo al abrir la app

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R8.

## Contexto

El técnico puede estar llenando la lectura cuando suena una llamada, se queda sin batería o el sistema operativo cierra la app. R8 exige que el borrador sobreviva al cierre, que al volver se ofrezca continuar o descartar y que no se pierdan los datos ya ingresados, incluida la foto.

El formulario tiene seis campos y una foto. No se necesita historial de borradores ni edición concurrente: una jornada, un técnico y un registro a la vez.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Solo estado del componente (`useState`) | Cero código extra; inmediato. | Si la app se cierra se pierde todo; no cumple R8. |
| Guardar el borrador dentro de la caché de TanStack Query | Ya existe un persister; no se agrega almacenamiento. | La caché es para datos del servidor; mezclar formularios complica la invalidación y el `buster`. |
| SQLite o WatermelonDB | Consultas y transacciones; sirve si hubiera muchos borradores. | Configuración nativa y migraciones para un único registro; sobredimensionado. |
| AsyncStorage con una clave y la foto en el directorio de documentos | Simple, persistente y fácil de explicar; la foto no se guarda en base64. | Hay que limpiar la clave y la foto al descartar; no hay transacción entre ambos. |

## Decisión

Se guarda **un solo borrador** en la clave `EPMAPS_BORRADOR_LECTURA` con la forma `BorradorLectura`: código del medidor, campos del formulario, URI de la foto y fecha de actualización.

- `useLecturaForm` guarda automáticamente 250 ms después del último cambio.
- Un listener de `AppState` fuerza el guardado cuando la app pasa a segundo plano.
- Al entrar de nuevo a la pantalla, se ofrece continuar o descartar en una tarjeta.
- `DraftGate` ofrece la misma decisión al abrir la app, en cualquier pantalla.
- Al guardar la lectura se usa `limpiarBorrador()`: la foto pasa a pertenecer a la lectura.
- Al descartar se usa `borrarBorrador()`: se elimina también el archivo de la foto.

El borrador no se sincroniza ni se comparte: es estrictamente local.

## Consecuencias

- Cerrar la app, reiniciar el teléfono o quedarse sin batería no borra lo avanzado.
- El borrador se recupera con la foto ya copiada a documentos.
- **Desventaja:** solo hay un borrador global; si se empieza otro medidor, el anterior se reemplaza.
- **Desventaja:** AsyncStorage no está cifrado; no se guardan claves ni datos sensibles.
- **Riesgo:** una foto reemplazada puede quedar huérfana en disco; se acepta por simplicidad.
- **Obligación:** toda pantalla que abandone el formulario debe confiar en el autoguardado, no en un botón manual.

## Verificación

- Se llena la mitad del formulario, se cierra la app desde recientes y se vuelve a abrir: aparece el aviso y los datos siguen allí.
- Se elige “Continuar” y el formulario muestra estado, lectura, motivo y foto.
- Se elige “Descartar” y el formulario queda vacío; la foto ya no existe.
- Al guardar la lectura, el borrador desaparece y la foto sigue disponible en el historial.
- `src/features/lecturas/draft.ts` y `use-lectura-form.ts` contienen la lógica.

## Uso de IA

La IA propuso guardar el borrador como una mutación pausada de TanStack Query. Se descartó porque la caché se limpia al cerrar sesión y R8 pide que el borrador sobreviva, incluso antes de iniciar sesión.

También propuso guardar la foto en base64 dentro de AsyncStorage. Se descartó por tamaño y por el límite práctico de AsyncStorage en Android. Se aceptó el guardado en documentos con referencia de URI.
