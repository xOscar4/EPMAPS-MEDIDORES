# ADR-004: Guardar las fotos en el directorio de documentos con expo-file-system

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R7.

## Contexto

La cámara entrega la foto en un archivo temporal de la caché. R7 exige que la foto respalde la lectura y que siga existiendo aunque se reinicie el teléfono, especialmente cuando la lectura queda pendiente varios días sin señal.

Las fotos son de una carátula, se toman a 0,45 de calidad y no necesitan edición, recorte ni envío a la galería del usuario.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Usar directamente la URI de la caché | Cero código; la cámara ya la entrega. | El sistema puede borrarla; al reiniciar, el historial quedaría con imágenes rotas. |
| Guardar la imagen en base64 dentro de AsyncStorage | Todo en un solo lugar; fácil de respaldar. | Crecimiento excesivo, lecturas lentas y riesgo de superar el límite de AsyncStorage. |
| Copiar a la galería con `expo-media-library` | El técnico ve la foto en su galería. | La librería no está instalada; expone fotos de clientes y requiere otro permiso. |
| Copiar a `Paths.document/fotos-medidores` | Persistente, privado de la app y sin permisos extra. | Hay que borrar archivos manualmente; no hay transacción con el borrador. |

## Decisión

Al capturar, `guardarFoto` copia el archivo temporal a `Paths.document/fotos-medidores` con un nombre único y devuelve la nueva URI. Se usa la API nueva de `expo-file-system` (`Directory`, `File`, `Paths`), no la API legacy.

- La carpeta se crea con `intermediates: true` e `idempotent: true`.
- La copia usa `overwrite: true` para repetir una captura sin fallar.
- La URI final se guarda en el borrador y luego en `LecturaLocal.fotoUri`.
- `borrarFoto` se usa al descartar una lectura o reemplazar una foto de un pendiente.
- En web se conserva la URI original porque no hay sistema de archivos nativo.

Las fotos quedan dentro del sandbox de la app; no se comparten con la galería ni con terceros.

## Consecuencias

- La foto sigue visible después de reiniciar el teléfono y en modo avión.
- No se agregan permisos de almacenamiento ni de medios.
- **Desventaja:** el archivo no se cifra; alguien con acceso físico al dispositivo podría verlo.
- **Desventaja:** la limpieza es manual; una foto reemplazada puede quedar huérfana.
- **Riesgo:** si el usuario borra los datos de la app, se pierden fotos y lecturas pendientes. Es el comportamiento esperado de un almacenamiento local.
- **Obligación:** nunca guardar en la lectura una URI de caché sin copiarla antes.

## Verificación

- Se toma una foto, se cierra la app por completo y se reabre el borrador: la imagen se muestra.
- En modo avión se guarda una lectura con foto; al reiniciar, el historial conserva la referencia.
- Al descartar una lectura pendiente, el archivo se elimina (`borrarFoto`).
- Al negar el permiso de cámara, la app explica el motivo, ofrece abrir ajustes y permite continuar sin foto cuando es opcional.
- `src/features/lecturas/foto.ts` centraliza copia y borrado.

## Uso de IA

La IA propuso usar `expo-image-manipulator` para comprimir y redimensionar antes de guardar. Se descartó porque la librería no está instalada y la cámara ya permite bajar la calidad.

También propuso guardar en la galería con `expo-media-library`. Se rechazó por el permiso adicional y porque las fotos de medidores son evidencia de trabajo, no contenido personal.
