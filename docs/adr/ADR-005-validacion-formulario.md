# ADR-005: Validar el formulario con estado local y funciones puras

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R2, R5, R6 y R7.

## Contexto

El formulario de lectura tiene reglas que dependen del estado seleccionado: normal exige lectura, inaccesible exige motivo y prohíbe lectura, dañado exige descripción y admite lectura opcional. Además, R6 exige calcular consumo y confirmar una anomalía, R7 exige foto en ciertos casos y R2 exige validar el código antes de consultar.

Estas reglas deben poder explicarse y probarse sin levantar la interfaz. El proyecto ya incluye React 19 y TypeScript, pero no tiene instalado `react-hook-form`; `zod` solo aparece como dependencia transitiva de Expo CLI, no como dependencia directa.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| `react-hook-form` | Menos re-renderizados; manejo de errores probado. | No está instalado; habría que agregar una dependencia y explicar su API. |
| `zod` para un esquema | Validación declarativa y mensajes consistentes. | Solo está como dependencia transitiva; agregarla directa obliga a justificar otra librería. |
| Un store global (Redux/Zustand) | Estado centralizado para varios formularios. | Solo hay un formulario activo; agrega boilerplate sin beneficio. |
| `useState` local + funciones puras en `utils/validators.ts` | Sin dependencias; reglas legibles y reutilizables; fácil de defender. | Hay que mantener los mensajes y el mapa de errores a mano. |

## Decisión

El estado del formulario vive en `useLecturaForm` con `useState`. Las reglas viven en funciones puras:

- `esCodigoValido` aplica `^MED-\d{6}$` antes de consultar (R2).
- `numeroDesdeTexto` acepta coma o punto decimal.
- `consumoDe` calcula la resta sin valores negativos.
- `esConsumoAnomalo` compara contra `promedio * 3`.
- `esLecturaMenor` detecta una lectura inferior a la anterior; se acepta solo si el técnico confirma que cambiaron el medidor.
- `validarFormulario` devuelve un mapa `campo → mensaje` y aplica R5, R7 y las confirmaciones de R6.
- `persistirLectura` vuelve a calcular consumo, anomalía y lectura menor, y comprueba duplicados antes de guardar, para que el servidor reciba datos coherentes.

La UI solo pinta `errores[campo]`. El botón Guardar llama a la misma validación que se usa para mostrar los mensajes.

## Consecuencias

- Las reglas se pueden leer en un archivo corto y explicar sin abrir la pantalla.
- Una lectura menor a la anterior se muestra con consumo 0 m³ y exige confirmación de reemplazo; no se marca como anomalía de consumo alto.
- No hay dependencias nuevas para formularios.
- **Desventaja:** no hay validación declarativa ni esquema compartido con el backend; los mensajes se escriben a mano.
- **Desventaja:** cada campo se registra manualmente con `setCampo`.
- **Riesgo:** una regla nueva debe agregarse en dos capas (UI y persistencia). Se mitiga manteniendo los cálculos en `utils/validators.ts`.
- **Obligación:** la UI no guarda valores sin pasar por `validarFormulario`.

## Verificación

- Un medidor normal sin lectura muestra “La lectura es obligatoria”.
- Un inaccesible sin motivo muestra error y no permite guardar; no se calcula consumo.
- Un dañado exige descripción y foto.
- Una lectura que supera el triple del promedio muestra la alerta; no guarda hasta confirmar y luego exige foto.
- Una lectura menor a la anterior exige confirmar el reemplazo del medidor.
- `MED-123` no dispara ninguna consulta; `MED-100001` sí.
- `utils/validators.ts` no importa React ni AsyncStorage: es testeable de forma aislada.

## Uso de IA

La IA propuso instalar `react-hook-form` con `zod`. Se rechazó porque el enunciado indica que las librerías ya están instaladas y porque zod solo existe como dependencia transitiva.

También propuso validar solo al presionar Guardar. Se cambió a un mapa de errores por campo para que el técnico vea qué corregir sin perder lo escrito.
