# ADR-008: Conectar el sistema de la oficina a MockAPI remoto con fallback local

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R1, R2, R3, R4, R5, R6, R7, R8, R9 y R10.

## Contexto

El enunciado pide simular el sistema de la oficina con MockAPI o una herramienta mock equivalente, con dos recursos: **medidores** y **lecturas**. La versión anterior usaba un mock local en TypeScript y AsyncStorage (ADR-007), lo que funcionaba sin internet pero no mostraba un backend HTTP real.

La defensa se hace con un APK en un teléfono Android y puede haber una red poco confiable. Si toda la app depende de MockAPI, un corte de internet impide cargar la ruta por primera vez. Si se usa solo el mock local, no se demuestra la integración con una herramienta mock externa.

El proyecto ya tiene `axios` instalado y una capa de servicios que aísla las pantallas: los hooks y el outbox solo conocen funciones como `getRuta`, `getMedidor` y `enviarLectura`.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Mantener solo el mock local | Cero dependencia de red; la defensa nunca falla por internet. | No hay HTTP real ni recursos visibles en una herramienta mock externa; el enunciado queda cumplido solo de forma interpretativa. |
| Usar únicamente MockAPI remoto | Cumple literalmente el enunciado; los recursos se ven en la nube. | La primera carga y el envío dependen de internet; un corte o el límite del plan gratuito afectan la defensa. |
| `json-server` en una laptop | HTTP real en la red local, sin límites de nube. | Hay que levantar otro proceso, compartir red y mantener la laptop encendida; el APK no funciona solo. |
| MockAPI remoto con fachada y fallback local | Recursos reales para la demo y continuidad sin internet; las pantallas no cambian. | Dos adaptadores que mantener y un login que sigue siendo local. |

## Decisión

Se usa **MockAPI** como sistema de la oficina principal y el mock local como fallback.

- Proyecto: `https://6ade67884e88f1bba4a5218d.mockapi.io`.
- Recursos: `medidores` y `lecturas`.
- La URL se inyecta con `EXPO_PUBLIC_MOCKAPI_URL` en `.env` y en los perfiles de `eas.json`.
- `src/services/mockApiRemote.ts` implementa el adaptador HTTP con `axios`:
  - `getRuta()` → `GET /medidores`.
  - `getMedidor(codigo)` → `GET /medidores?codigo=...`.
  - `getLecturasEnviadas()` → `GET /lecturas`.
  - `enviarLectura()` → consulta por `idempotencia`, consulta duplicado por `medidorCodigo + periodo` y hace `POST /lecturas`.
- `src/services/mockApi.ts` es una fachada: si la variable de entorno existe usa MockAPI; si no, usa `mockApiLocal.ts`. Las pantallas, los hooks y el outbox no cambian.
- El login se mantiene local (`EMP-001 / epmaps2026`) para no guardar credenciales en un servicio público. Los recursos pedidos siguen siendo dos.
- Los medidores se cargan con `node scripts/seed-mockapi.mjs`; el script es idempotente y permite limpiar lecturas con `--reset-lecturas`.
- La foto se sigue guardando en el teléfono. MockAPI recibe la URI local como referencia; no se sube el archivo.

La caché de TanStack Query y el outbox mantienen el comportamiento offline: la ruta se lee de la caché y las lecturas se encolan hasta que haya red.

## Consecuencias

- La demo muestra recursos reales en MockAPI y un flujo HTTP verificable.
- Si no hay internet, la app sigue leyendo la caché y guardando en el outbox; al reconectar envía a MockAPI.
- Si se elimina `EXPO_PUBLIC_MOCKAPI_URL`, la app vuelve al mock local sin tocar código.
- **Desventaja:** la primera descarga de la ruta y el envío requieren internet.
- **Desventaja:** MockAPI no impone un índice único; la comprobación de duplicados es de la app y dos dispositivos podrían duplicar a la vez. En la prueba hay un solo técnico.
- **Desventaja:** el plan gratuito de MockAPI tiene límites de peticiones y la URL es pública; solo se usan datos ficticios.
- **Riesgo:** si se reinstala la app, las URIs de fotos guardadas en MockAPI ya no apuntan a archivos existentes.
- **Obligación:** no guardar credenciales reales ni datos personales en MockAPI.

## Verificación

- `node scripts/seed-mockapi.mjs` deja ocho medidores en el recurso `medidores`.
- `GET /medidores?codigo=MED-100001` devuelve un objeto y `GET /medidores?codigo=MED-999999` devuelve vacío, lo que la app traduce a “No existe un medidor”.
- La app muestra la ruta con los ocho medidores y el detalle con los siete datos de R3.
- Al guardar una lectura con red, el recurso `lecturas` recibe el registro y el historial de la app lo muestra como enviado.
- Al repetir el envío con la misma `idempotencia`, el adaptador devuelve la lectura existente y no crea otra.
- Al intentar el mismo medidor y periodo, la app rechaza el duplicado antes de hacer `POST`.
- En modo avión, la lectura queda en el outbox; al recuperar la red se envía y el contador del banner baja.
- Al comentar `EXPO_PUBLIC_MOCKAPI_URL`, la app funciona con el mock local y sin internet.
- `npx tsc --noEmit`, `npx expo-doctor` y `npx expo export --platform android` pasan sin errores.

## Uso de IA

La IA propuso primero conectar la app directamente a MockAPI sin fallback. Se descartó porque un corte de internet durante la defensa impediría cargar la ruta y enviar lecturas. Se mantuvo el mock local de ADR-007 como respaldo.

También propuso crear un recurso `tecnicos` con la clave en MockAPI. Se rechazó: el enunciado pide dos recursos y no es buena práctica publicar credenciales, aunque sean de demo. El login sigue local.

La IA generó el script de siembra y el adaptador HTTP. El equipo verificó los endpoints, la codificación UTF-8 de los sectores, la idempotencia y el rechazo de duplicados antes de aceptar la decisión.
