# Verificación de la integración con MockAPI

Fecha: 2026-10-26. URL: `https://6ade67884e88f1bba4a5218d.mockapi.io`.

## Checklist del pedido

| Pedido | Dónde está | Estado |
| --- | --- | --- |
| Usar MockAPI real, sin mocks locales | `src/services/api.ts` es el único cliente; se eliminaron `mockApi.ts`, `mockApiLocal.ts`, `mockApiRemote.ts` y `seed.ts` | Cumple |
| Respetar los recursos y campos existentes | `Medidor` y `LecturaServidor` en `src/types/models.ts`; el adaptador envía y normaliza los mismos nombres | Cumple |
| Consultar medidores en MockAPI | `getRuta()` → `GET /medidores`; `getMedidor()` → `GET /medidores?codigo=...` | Cumple |
| Registrar lecturas en MockAPI | `enviarLectura()` → `POST /lecturas` | Cumple |
| Persistencia local con AsyncStorage | Caché de Query, `EPMAPS_MEDIDORES_VISTOS`, `EPMAPS_OUTBOX`, `EPMAPS_BORRADOR_LECTURA`, `EPMAPS_SESION`; fotos en `document/fotos-medidores` | Cumple |
| Consultar medidores guardados sin Internet | Caché de TanStack Query (7 días) + copia por medidor en AsyncStorage + `networkMode: offlineFirst` | Cumple |
| Registrar lecturas sin Internet | El formulario escribe en el outbox antes de intentar la red | Cumple |
| Conservar pendientes y borradores al cerrar | `outbox.ts`, `draft.ts` y `use-lectura-form.ts` leen AsyncStorage al iniciar | Cumple |
| Sincronizar al recuperar la conexión | `outbox-provider.tsx` escucha NetInfo y ejecuta `sincronizarCola()` | Cumple |
| Evitar duplicados con `idempotencia` | `enviarLectura()` consulta `/lecturas?idempotencia=...` antes del `POST`; el reintento devuelve la existente | Cumple |
| Estado de conexión y pendientes en todas las pantallas | `StatusBanner` está en `src/app/_layout.tsx`, sobre el `Stack` | Cumple |
| Errores de red sin perder datos | Si el envío falla, la lectura vuelve a `pendiente` y se reintenta; solo `DUPLICADA` queda en `error` | Cumple |
| Dependencias compatibles con SDK 57 | `npx expo install --check` y `npx expo-doctor` (21/21) | Cumple |
| Solo dependencias necesarias | No se agregó ninguna librería nueva; `expo-file-system` se declaró explícito porque ya se usaba | Cumple |
| R1 a R10 | Ver la tabla del `README.md` y los ADR 001–008 | Cumple |

## Evidencia automática

- `npx tsc --noEmit` → sin errores.
- `npx expo-doctor` → 21/21 comprobaciones aprobadas.
- `npx expo install --check` → “Dependencies are up to date”.
- `npx expo export --platform android` → bundle generado con `EXPO_PUBLIC_MOCKAPI_URL`.
- `node scripts/seed-mockapi.mjs` → 8 medidores en `/medidores`.

## Evidencia contra MockAPI

Prueba ejecutada el 2026-10-26 con un periodo de prueba (`2099-12`):

1. `GET /lecturas?idempotencia=...` → 0 filas antes del envío.
2. `GET /lecturas?medidorCodigo=MED-100001&periodo=2099-12` → 0 duplicados.
3. `POST /lecturas` → HTTP 201 con `id` asignado por MockAPI.
4. `GET` del medidor y periodo → 1 fila con `lectura: 269` y la misma `idempotencia`.
5. Repetir el filtro de idempotencia → 1 fila (no se crea otra).
6. Un segundo intento con otra idempotencia y el mismo medidor+periodo es rechazado por la app.
7. `DELETE` del registro de prueba → `/lecturas` queda en 0.

Los datos reales del proyecto (8 medidores, 0 lecturas) quedaron intactos.

## Prueba pendiente en dispositivo

El APK `preview` se compila en EAS. En el teléfono conviene repetir este recorrido:

1. Abrir la app con internet: se cargan los 8 medidores.
2. Activar modo avión y abrir un medidor ya consultado: se ven los 7 datos.
3. Registrar una lectura: queda como pendiente y el banner muestra 1.
4. Cerrar y abrir la app: la pendiente y el borrador siguen.
5. Desactivar modo avión: el banner sincroniza y la lectura aparece en MockAPI.
6. Intentar otra lectura del mismo medidor y mes: se rechaza.
