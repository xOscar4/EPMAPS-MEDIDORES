# ADR-004: Guardar las fotos en el directorio de documentos con expo-file-system

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R7.

## Contexto

La cámara entrega la foto en un archivo temporal de la caché. R7 exige que la foto respalde la lectura y que siga existiendo aunque se reinicie el teléfono, especialmente cuando la lectura queda pendiente varios días sin señal.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Usar directamente la URI de la caché | Cero código; la cámara ya la entrega. | El sistema puede borrarla; al reiniciar, el historial quedaría con imágenes rotas. |
| Guardar la imagen en base64 dentro de AsyncStorage | Todo en un solo lugar; fácil de respaldar. | Crecimiento excesivo, lecturas lentas y riesgo de superar el límite de AsyncStorage. |

## Decisión

Al capturar, `guardarFoto` copia el archivo temporal a `Paths.document/fotos-medidores` con un nombre único y devuelve la nueva URI. Se usa la API nueva de `expo-file-system` (`Directory`, `File`, `Paths`), no la API legacy.

- La carpeta se crea con `intermediates: true` e `idempotent: true`.
- La copia usa `overwrite: true` para repetir una captura sin fallar.

## Consecuencias

- La foto sigue visible después de reiniciar el teléfono y en modo avión cuando la copia a documentos tuvo éxito.
- No se agregan permisos de almacenamiento ni de medios.
- **Desventaja:** el archivo no se cifra; alguien con acceso físico al dispositivo podría verlo.

## Verificación

- Se toma una foto, se cierra la app por completo y se reabre el borrador: la imagen se muestra (cuando la copia a documentos tuvo éxito).
- En modo avión se guarda una lectura con foto; al reiniciar, el historial conserva la referencia (si la copia a documentos tuvo éxito).
- Al descartar una lectura pendiente, el archivo se elimina (`borrarFoto`).

## Uso de IA
