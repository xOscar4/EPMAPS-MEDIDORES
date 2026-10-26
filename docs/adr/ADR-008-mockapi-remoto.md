# ADR-008: Usar MockAPI remoto como único sistema de la oficina

## Estado

Aceptado. Reemplaza a ADR-007.

## Fecha

2026-10-26.

## Requisitos relacionados

R1, R2, R3, R4, R5, R6, R7, R8, R9 y R10.

## Contexto

El enunciado exige simular el sistema de la oficina con MockAPI o una herramienta equivalente y usar dos recursos: **medidores** y **lecturas**. La prueba se entrega como APK y se defiende en un teléfono Android, donde la señal puede fallar.

La primera versión usaba un mock local en TypeScript con AsyncStorage (ADR-007) y después se añadió MockAPI con un *fallback* local. Esa fachada duplicaba código y dejaba dos caminos posibles: en la defensa no quedaba claro si los datos venían de la nube o del teléfono. El requisito final pide usar MockAPI real, sin mocks locales ni datos simulados dentro de la app.

El proyecto ya tiene `axios`, AsyncStorage, NetInfo y TanStack Query. El proyecto de MockAPI existe en `https://6ade67884e88f1bba4a5218d.mockapi.io`, con los recursos `/medidores` y `/lecturas` y sus campos ya definidos.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Mantener solo el mock local | Funciona sin red y sin configuración. | No hay HTTP real; incumple el pedido de usar MockAPI y oculta errores de integración. |
| MockAPI con *fallback* local | Continuidad total si falla internet. | Dos adaptadores y dos fuentes de verdad; más código que explicar y riesgo de datos inconsistentes. |
| `json-server` en una laptop | HTTP real y control total del servidor. | Hay que levantar otro proceso y compartir red; el APK no funciona solo. |
| MockAPI remoto + persistencia local | Backend real y verificable; la app sigue operando sin señal con caché y outbox. | La primera carga y el envío necesitan internet; hay que cuidar los límites del plan gratuito. |

## Decisión

MockAPI es el único sistema de la oficina. No queda ningún mock ni conjunto de medidores simulado dentro de la app.

- `src/services/api.ts` crea un cliente `axios` con `baseURL = EXPO_PUBLIC_MOCKAPI_URL`. Si la variable no existe, usa la URL de la prueba como valor por defecto, de modo que el APK siempre apunta a MockAPI.
- Funciones del adaptador:
  - `getRuta()` → `GET /medidores`.
  - `getMedidor(codigo)` → `GET /medidores?codigo=...`; si no hay resultados lanza `NO_ENCONTRADO`.
  - `getLecturasEnviadas()` → `GET /lecturas` y normaliza los campos de texto.
  - `enviarLectura()` → consulta por `idempotencia`, consulta duplicados por `medidorCodigo + periodo` y hace `POST /lecturas`.
- Se respetan los nombres y tipos del esquema de MockAPI: `codigo`, `direccion`, `sector`, `cuenta`, `estado`, `ultimaLectura`, `fechaUltimaLectura`, `promedioMensual`; y `idempotencia`, `medidorCodigo`, `periodo`, `estadoMedidor`, `lectura`, `motivo`, `descripcion`, `consumo`, `promedio`, `anomalia`, `confirmoAnomalia`, `fotoUri`, `tecnicoCodigo`, `enviadoEn`.
- **Persistencia local con AsyncStorage:**
  - `EPMAPS_QUERY_CACHE`: caché de TanStack Query con la ruta y el historial.
  - `EPMAPS_MEDIDORES_VISTOS`: copia de cada medidor consultado, para abrir el detalle sin red.
  - `EPMAPS_OUTBOX`: lecturas pendientes con su `idempotencia`.
  - `EPMAPS_BORRADOR_LECTURA`: registro a medio llenar.
  - `EPMAPS_SESION`: perfil del técnico, sin clave.
  - Las fotos se copian a `document/fotos-medidores` con `expo-file-system`.
- `src/services/auth.ts` valida el login quemado `EMP-001 / epmaps2026`. La prueba permite datos quemados y MockAPI solo expone los dos recursos pedidos; no se publican credenciales en la nube.
- La sincronización automática vive en `outbox-provider.tsx`: al recuperar la conexión envía en orden, elimina del outbox solo cuando MockAPI confirma y reintenta con la misma `idempotencia`.
- Los medidores de demostración se cargan con `node scripts/seed-mockapi.mjs`, que es idempotente y permite limpiar lecturas con `--reset-lecturas`.

## Consecuencias

- La demo muestra recursos reales en MockAPI; cualquier lectura enviada se puede ver en el panel del servicio.
- Sin internet, la ruta y el detalle salen de la caché o de `EPMAPS_MEDIDORES_VISTOS`; las lecturas quedan en `EPMAPS_OUTBOX` y se envían al reconectar.
- Si MockAPI está caído, la app no pierde datos: el error se muestra y la lectura sigue pendiente con reintento.
- **Desventaja:** la primera carga de la ruta y el envío requieren internet.
- **Desventaja:** MockAPI no impone un índice único; la comprobación de duplicados es de la app y dos dispositivos podrían duplicar a la vez. En la prueba hay un solo técnico.
- **Desventaja:** el plan gratuito tiene límites y la URL es pública; solo se usan datos ficticios.
- **Riesgo:** si se reinstala la app, las URIs de fotos guardadas en MockAPI ya no apuntan a archivos existentes.
- **Obligación:** no guardar credenciales reales ni datos personales en MockAPI.

## Verificación

- `node scripts/seed-mockapi.mjs` deja ocho medidores en `/medidores`.
- `GET /medidores?codigo=MED-100001` devuelve un registro y `GET /medidores?codigo=MED-999999` devuelve vacío; la app muestra “No existe un medidor”.
- La app lista los ocho medidores y el detalle muestra los siete datos de R3.
- Al guardar una lectura con red, `POST /lecturas` aparece en el panel de MockAPI y el historial la marca como enviada.
- Al repetir el envío con la misma `idempotencia`, el adaptador devuelve la lectura existente y no crea otra.
- Al intentar el mismo `medidorCodigo + periodo`, la app rechaza antes de hacer `POST`.
- En modo avión la lectura queda en el outbox; al recuperar la red se envía y el contador del banner baja.
- Al cerrar y abrir la app, el outbox y el borrador siguen en AsyncStorage.
- `npx tsc --noEmit`, `npx expo-doctor` y `npx expo export --platform android` pasan sin errores.

## Uso de IA

La IA propuso primero un mock local y luego una fachada con *fallback*. Ambas se descartaron cuando el requisito pidió MockAPI real sin mocks locales: dos fuentes de verdad complican la explicación y esconden fallos de red.

También propuso crear un recurso `tecnicos` con la clave en MockAPI. Se rechazó: el enunciado pide dos recursos y publicar credenciales, aunque sean de demo, es una mala práctica. El login quedó en `auth.ts`.

La IA generó el adaptador, el script de siembra y la persistencia. El equipo verificó los endpoints, la codificación UTF-8, la idempotencia, el rechazo de duplicados y que el APK siguiera funcionando sin señal.
