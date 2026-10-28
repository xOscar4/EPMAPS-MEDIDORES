# ADR-008: Usar MockAPI remoto como único sistema de la oficina

## Estado

Aceptado y vigente. Reemplaza a ADR-007.

## Fecha

2026-10-26.

## Requisitos relacionados

R1, R2, R3, R4, R5, R6, R7, R8, R9 y R10.

## Contexto

El enunciado exige simular el sistema de la oficina con MockAPI o una herramienta equivalente y usar dos recursos: **medidores** y **lecturas**. La prueba se entrega como APK y se defiende en un teléfono Android, donde la señal puede fallar.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Mantener solo el mock local | Funciona sin red y sin configuración. | No hay HTTP real; incumple el pedido de usar MockAPI y oculta errores de integración. |
| MockAPI con *fallback* local | Continuidad total si falla internet. | Dos adaptadores y dos fuentes de verdad; más código que explicar y riesgo de datos inconsistentes. |

## Decisión

MockAPI es el único sistema de la oficina. No queda ningún mock ni conjunto de medidores simulado dentro de la app.

- `src/services/api.ts` crea un cliente `axios` con `baseURL = EXPO_PUBLIC_MOCKAPI_URL`. Si la variable no existe, usa la URL de la prueba como valor por defecto, de modo que el APK siempre apunta a MockAPI.
- Funciones del adaptador:

## Consecuencias

- La demo muestra recursos reales en MockAPI; cualquier lectura enviada se puede ver en el panel del servicio.
- Sin internet, la ruta y el detalle salen de la caché o de `EPMAPS_MEDIDORES_VISTOS`; las lecturas quedan en `EPMAPS_OUTBOX` y se envían al reconectar.
- Si MockAPI está caído, la app no pierde datos: el error se muestra y la lectura sigue pendiente con reintento.

## Verificación

- `node scripts/seed-mockapi.mjs` deja en `/medidores` los medidores definidos en el script (16 en la revisión actual) y es idempotente.
- `GET /medidores?codigo=MED-100001` devuelve un registro y `GET /medidores?codigo=MED-999999` devuelve vacío; la app muestra “No existe un medidor”.
- La app lista los medidores devueltos por `GET /medidores` y el detalle muestra los siete datos de R3.

## Uso de IA

La IA propuso primero un mock local y luego una fachada con *fallback*. Ambas se descartaron cuando el requisito pidió MockAPI real sin mocks locales: dos fuentes de verdad complican la explicación y esconden fallos de red.
