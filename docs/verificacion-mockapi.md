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

## Comportamiento 404 de MockAPI

MockAPI responde **404 `Not found`** cuando un `GET` con filtros no encuentra
filas (por ejemplo `?idempotencia=...` o un medidor sin lecturas). No es un
fallo de red: significa “lista vacía”. `src/services/api.ts` lo traduce con un
interceptor de respuesta, así que:

- el chequeo de idempotencia y el de duplicados siguen su curso cuando no hay filas;
- solo un error real de red o de servidor cancela el envío;
- `getMedidor()` sigue informando “No existe un medidor con ese código” cuando la lista llega vacía.

## Prueba en dispositivo (emulador Android, Expo Go)

Ejecutada el 2026-10-26 con dos lecturas pendientes reales (`MED-100002` y
`MED-100003`) guardadas en modo avión:

1. Al desactivar el modo avión la app sincronizó sola; el banner pasó a
   “En línea · 0 pendientes”.
2. `GET /lecturas` mostró 3 filas: `MED-100001` (263), `MED-100002` (133) y
   `MED-100003` (100, `anomalia: true`, `confirmoAnomalia: true`, con `fotoUri`).
3. La cola local quedó vacía (`EPMAPS_OUTBOX` → `[]`), es decir, los pendientes
   se borraron solo después de recibir respuesta del servidor.
4. Cada fila conservó su `idempotencia`, `medidorCodigo`, `periodo`,
   `consumo`, `promedio`, `tecnicoCodigo` y `enviadoEn`.
5. Se probó el alta desde **Añadir medidor**: `POST /medidores` creó
   `MED-200001` con `fechaUltimaLectura: "2026-10-15"` elegida en el calendario
   nativo (`@react-native-community/datetimepicker`). El registro de prueba se
   eliminó después y quedaron los 8 medidores de la ruta.
6. Con última lectura 75 y lectura actual 74, la app mostró consumo 0 m³, la
   etiqueta “Lectura menor” y exigió confirmar el reemplazo antes de guardar.

## Recorrido recomendado en el APK

El APK `preview` se compila en EAS. En el teléfono conviene repetir este recorrido del R1 al R10 con `docs/pruebas-paso-a-paso.md`:

1. Abrir la app con internet: se cargan los 8 medidores.
2. Activar modo avión y abrir un medidor ya consultado: se ven los 7 datos.
3. Registrar una lectura: queda como pendiente y el banner muestra 1.
4. Cerrar y abrir la app: la pendiente y el borrador siguen.
5. Desactivar modo avión: el banner sincroniza y la lectura aparece en MockAPI.
6. Intentar otra lectura del mismo medidor y mes: se rechaza.
