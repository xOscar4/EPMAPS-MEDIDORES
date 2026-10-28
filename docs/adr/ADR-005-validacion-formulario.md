# ADR-005: Validar el formulario con estado local y funciones puras

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R2, R5, R6 y R7.

## Contexto

El formulario de lectura tiene reglas que dependen del estado seleccionado: normal exige lectura, inaccesible exige motivo y prohíbe lectura, dañado exige descripción y admite lectura opcional. Además, R6 exige calcular consumo y confirmar una anomalía, R7 exige foto en ciertos casos y R2 exige validar el código antes de consultar.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| `react-hook-form` | Menos re-renderizados; manejo de errores probado. | No está instalado; habría que agregar una dependencia y explicar su API. |
| `zod` para un esquema | Validación declarativa y mensajes consistentes. | Solo está como dependencia transitiva; agregarla directa obliga a justificar otra librería. |

## Decisión

El estado del formulario vive en `useLecturaForm` con `useState`. Las reglas viven en funciones puras:

- `esCodigoValido` aplica `^MED-\d{6}$` antes de consultar (R2).
- `numeroDesdeTexto` acepta coma o punto decimal.

## Consecuencias

- Las reglas se pueden leer en un archivo corto y explicar sin abrir la pantalla.
- Una lectura menor a la anterior se muestra con consumo 0 m³ y exige confirmación de reemplazo; no se marca como anomalía de consumo alto.
- No hay dependencias nuevas para formularios.

## Verificación

- Un medidor normal sin lectura muestra “La lectura es obligatoria”.
- Un inaccesible sin motivo muestra error y no permite guardar; no se calcula consumo.
- Un dañado exige descripción y foto.

## Uso de IA

La IA propuso instalar `react-hook-form` con `zod`. Se rechazó porque el enunciado indica que las librerías ya están instaladas y porque zod solo existe como dependencia transitiva.
