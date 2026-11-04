# ADR-003: Guardar un borrador de lectura en AsyncStorage y restaurarlo al abrir la app

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R8.

## Contexto

El técnico puede estar llenando la lectura cuando suena una llamada, se queda sin batería o el sistema operativo cierra la app. R8 exige que el borrador sobreviva al cierre, que al volver se ofrezca continuar o descartar y que no se pierdan los datos ya ingresados, incluida la foto.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Solo estado del componente (`useState`) | Cero código extra; inmediato. | Si la app se cierra se pierde todo; no cumple R8. |
| Guardar el borrador dentro de la caché de TanStack Query | Ya existe un persister; no se agrega almacenamiento. | La caché es para datos del servidor; mezclar formularios complica la invalidación y el `buster`. |

## Decisión

Se guarda **un solo borrador** en la clave `EPMAPS_BORRADOR_LECTURA` con la forma `BorradorLectura`: código del medidor, campos del formulario, URI de la foto y fecha de actualización.

- `useLecturaForm` guarda automáticamente 250 ms después del último cambio.
- Un listener de `AppState` fuerza el guardado cuando la app pasa a segundo plano.

## Consecuencias

- Cerrar la app, reiniciar el teléfono o quedarse sin batería no borra lo avanzado.
- El borrador se recupera con la foto copiada a documentos; si la copia falló, conserva la URI temporal y la foto puede perderse al reiniciar (ver ADR-004).
- **Desventaja:** solo hay un borrador global; si se empieza otro medidor, el anterior se reemplaza.

## Verificación

- Se llena la mitad del formulario, se cierra la app desde recientes y se vuelve a abrir: aparece el aviso y los datos siguen allí.
- Se elige “Continuar” y el formulario muestra estado, lectura, motivo y foto.
- Se elige “Descartar” y el formulario queda vacío; la foto ya no existe.

## Uso de IA

La IA propuso guardar el borrador como una mutación pausada de TanStack Query. Se descartó porque la caché se limpia al cerrar sesión y R8 pide que el borrador sobreviva, incluso antes de iniciar sesión.
