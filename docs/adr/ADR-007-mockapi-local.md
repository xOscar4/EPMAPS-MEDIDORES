# ADR-007: Simular el sistema de la oficina con un MockAPI local persistente

## Estado

Reemplazado por ADR-008 el 2026-10-26.

> Este ADR se conserva como registro histórico. El mock local se eliminó del código: la app usa únicamente MockAPI remoto (ADR-008). La continuidad sin Internet se resuelve con la caché, la copia de medidores en AsyncStorage y el outbox, no con un backend simulado.

## Fecha

2026-10-26.

## Requisitos relacionados

R1, R2, R3, R4, R9 y R10.

## Contexto

La prueba se defiende con un APK en un teléfono Android, posiblemente sin internet confiable. El enunciado pide conectarse a un sistema de la oficina, pero no entrega un backend real ni credenciales de un servicio externo. La app necesita latencia, errores de credenciales, medidores inexistentes y rechazo de duplicados para demostrar los flujos.

Si la demo depende de un servicio en la nube, un corte de red o un límite gratuito pueden impedir la defensa. Si se usa solo memoria, se pierde el historial al reiniciar.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| MockAPI / servicio REST en la nube | Parece un backend real; URLs y códigos HTTP visibles. | Depende de internet y de una cuenta; puede fallar el día de la defensa. |
| `json-server` en una laptop | HTTP real en la red local. | Hay que levantar otro proceso y compartir red; el APK no funcionaría solo. |
| `msw` (Mock Service Worker) | Intercepta `fetch` con handlers realistas. | Pensado para web/tests; configuración extra en React Native. |
| Mock local en `mockApi.ts` con AsyncStorage | Funciona sin red, con latencia y errores controlados; el APK es autosuficiente. | No hay HTTP real; las fallas de red se simulan desde NetInfo, no desde el servidor. |

## Decisión

Se implementa `src/services/mockApi.ts` como sistema de la oficina simulado:

- `login` espera 600 ms y valida `EMP-001 / epmaps2026`.
- `getRuta` espera 700 ms y devuelve 8 medidores de `seed.ts`.
- `getMedidor` espera 900 ms y lanza `NO_ENCONTRADO` si el código no existe.
- `enviarLectura` espera 1200 ms, verifica `idempotencia` y rechaza duplicados por `medidor + periodo`.
- Las lecturas confirmadas se guardan en `EPMAPS_MOCK_LECTURAS` dentro de AsyncStorage, por lo que sobreviven al reinicio y alimentan el historial.
- Los errores se modelan con `ApiError` y códigos `CREDENCIALES`, `NO_ENCONTRADO`, `DUPLICADA` y `RED`.

La app consume este mock únicamente a través de hooks (`useRuta`, `useMedidor`, `useHistorial`) y del motor de sincronización. Cambiar a un backend HTTP implicaría reemplazar `mockApi.ts` sin tocar las pantallas.

## Consecuencias

- La defensa funciona en modo avión después de la descarga inicial de la ruta.
- Se pueden demostrar credenciales incorrectas, código inexistente y duplicados sin preparar servidores.
- **Desventaja:** no hay HTTP real ni token; la latencia es artificial.
- **Desventaja:** el mock y la app comparten el mismo almacenamiento; no representa la separación física de la oficina.
- **Riesgo:** los datos de prueba quedan en el teléfono entre demostraciones. Se puede reiniciar la app o borrar sus datos para volver al estado inicial.
- **Obligación:** las pantallas no importan `mockApi` directamente; solo los hooks y la sincronización.

## Verificación

- Con `EMP-001 / epmaps2026` se entra; con otra clave se muestra el error del mock.
- `MED-100001` aparece en la ruta; un código inventado devuelve “No existe un medidor”.
- Se registra una lectura, se cierra la app y el historial la conserva.
- Un segundo envío del mismo medidor y periodo es rechazado por el mock aunque la app no lo haya detectado.
- `expo start --offline` o modo avión no impide ver la ruta ya cacheada.

## Uso de IA

La IA propuso usar MockAPI en la nube y un archivo `.env` con la URL. Se rechazó por el riesgo de depender de internet durante la defensa y porque el enunciado no entrega credenciales.

También propuso usar `axios` para llamar a un endpoint local. Se descartó: una función TypeScript con latencia simulada demuestra el mismo flujo sin agregar configuración de red.
