# ADR-001: Usar TanStack Query con persistencia en AsyncStorage para la caché de consultas

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R3 y R4.

## Contexto

El técnico consulta un medidor con señal y necesita volver a ver esos mismos datos cuando entra a una caja subterránea o a una parroquia rural sin cobertura. El requisito R3 exige que una segunda consulta del mismo medidor no espere una nueva descarga, y R4 exige registrar la lectura sin conexión.

Los datos son pequeños y cambian una vez al mes. No se necesita una base de datos relacional ni un store global para todo el estado del servidor. El proyecto ya incluye TanStack Query, AsyncStorage y NetInfo, y el equipo debe mantener archivos pequeños y explicables en la defensa.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Context + `useReducer` + AsyncStorage manual | Sin dependencias nuevas; control total; fácil de explicar. | Hay que programar caché, claves, invalidación, reintentos y estados de carga; el código crece y se mezcla con la UI. |
| Redux Toolkit + RTK Query + `redux-persist` | Caché y DevTools maduros; un solo store predecible. | Tres librerías y boilerplate; se persiste un store global aunque casi todo es estado del servidor; sobredimensionado para una ruta. |
| SWR | API pequeña y caché con revalidación. | Menos integración con React Native y sin persistencia oficial en AsyncStorage; habría que escribir el adaptador. |
| TanStack Query + `query-async-storage-persister` | `staleTime`, reintentos, invalidación y persistencia oficial con pocas líneas; encaja con el stack instalado. | Dependencia adicional; la caché persistida no está cifrada; obliga a cuidar `buster` y datos serializables. |

## Decisión

Se usa TanStack Query como capa de estado del servidor. Su caché se persiste en AsyncStorage con `createAsyncStoragePersister` en la clave `EPMAPS_QUERY_CACHE`.

- `networkMode: 'offlineFirst'` en consultas para mostrar la caché de inmediato.
- `staleTime` de 12 horas en medidores y ruta; `gcTime` y `maxAge` de 7 días.
- Solo se persisten consultas en estado `success`.
- `buster: 'v1'` se sube a mano si cambia el modelo `Medidor`.
- NetInfo alimenta `onlineManager` para que TanStack sepa cuándo hay red.
- La cola de escritura **no** se resuelve con mutaciones pausadas; se registra en el ADR-002.

## Consecuencias

- Una segunda consulta del mismo medidor muestra datos al instante, con o sin señal.
- No se escribe a mano la lógica de caché ni de reintentos.
- La caché persistida se complementa con `EPMAPS_MEDIDORES_VISTOS`: cada medidor consultado queda también en AsyncStorage para abrir el detalle sin red aunque la caché de consultas se pierda (ADR-008).
- **Desventaja:** se agrega una librería que no se vio en clase y hay que explicar su ciclo de vida (`isPending`, `isFetching`, `isError`).
- **Riesgo:** la caché en AsyncStorage no está cifrada; no se guardan tokens ni claves.
- **Riesgo:** un medidor puede cambiar en la oficina y la app mostrar el dato anterior. Se mitiga con `staleTime`, `refetchOnReconnect` y el botón de actualizar.
- **Obligación:** las consultas de pantallas pasan por hooks de `features/medidores`; el alta de medidor es la excepción y usa `crearMedidor` del adaptador (ADR-008).
- **Obligación:** al cerrar sesión se limpia la caché con `queryClient.clear()` y `persister.removeClient()`.

## Verificación

- `src/services/queryClient.ts` contiene el persister y `maxAge`.
- Con señal se consulta un medidor; al activar modo avión, la segunda consulta muestra los mismos datos sin pantalla de error.
- Al cerrar y abrir la app, la ruta sigue disponible sin red.
- Las consultas de pantallas usan `useMedidor` y `useRuta`; el alta usa `crearMedidor` del adaptador, no un mock local.
- Si se borra o expira la caché de Query, un medidor ya consultado sigue abriéndose desde `EPMAPS_MEDIDORES_VISTOS`.
- `npx tsc --noEmit` termina sin errores.

## Uso de IA

Se pidió a la IA comparar alternativas de caché para React Native. Recomendó TanStack Query y se aceptó por la persistencia oficial y el bajo boilerplate.

Se descartaron dos sugerencias: persistir también consultas con error (guardaría estados vacíos) y usar `staleTime: 0` (forzaría descargas que en campo fallan). Se cambió el `staleTime` global a 5 minutos y se dejó 12 horas en los datos de medidores, que cambian una vez al mes.
