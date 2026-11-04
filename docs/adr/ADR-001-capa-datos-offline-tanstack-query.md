# ADR-001: Usar TanStack Query con persistencia en AsyncStorage para la caché de consultas

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R3 y R4.

## Contexto

El técnico consulta un medidor con señal y necesita volver a ver esos mismos datos cuando entra a una caja subterránea o a una parroquia rural sin cobertura. El requisito R3 exige que una segunda consulta del mismo medidor no espere una nueva descarga, y R4 exige registrar la lectura sin conexión.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Context + `useReducer` + AsyncStorage manual | Sin dependencias nuevas; control total; fácil de explicar. | Hay que programar caché, claves, invalidación, reintentos y estados de carga; el código crece y se mezcla con la UI. |
| Redux Toolkit + RTK Query + `redux-persist` | Caché y DevTools maduros; un solo store predecible. | Tres librerías y boilerplate; se persiste un store global aunque casi todo es estado del servidor; sobredimensionado para una ruta. |

## Decisión

Se usa TanStack Query como capa de estado del servidor. Su caché se persiste en AsyncStorage con `createAsyncStoragePersister` en la clave `EPMAPS_QUERY_CACHE`.

- `networkMode: 'offlineFirst'` en consultas para mostrar la caché de inmediato.
- `staleTime` de 12 horas en medidores y ruta; `gcTime` y `maxAge` de 7 días.

## Consecuencias

- Una segunda consulta del mismo medidor muestra datos al instante, con o sin señal.
- No se escribe a mano la lógica de caché ni de reintentos.
- La caché persistida se complementa con `EPMAPS_MEDIDORES_VISTOS`: cada medidor consultado queda también en AsyncStorage para abrir el detalle sin red aunque la caché de consultas se pierda (ADR-008).

## Verificación

- `src/services/queryClient.ts` contiene el persister y `maxAge`.
- Con señal se consulta un medidor; al activar modo avión, la segunda consulta muestra los mismos datos sin pantalla de error.
- Al cerrar y abrir la app, la ruta sigue disponible sin red.

## Uso de IA

Se pidió a la IA comparar alternativas de caché para React Native. Recomendó TanStack Query y se aceptó por la persistencia oficial y el bajo boilerplate.
