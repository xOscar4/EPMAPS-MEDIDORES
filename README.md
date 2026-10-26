# EPMAPS Lecturas — app móvil de registro de medidores

Aplicación Expo/React Native para que un técnico de EPMAPS registre lecturas de medidores de agua en campo, con foto de respaldo, funcionamiento sin señal y envío automático al recuperar la conexión.

Prueba I de desarrollo móvil · ESFOT · Defensa: miércoles 28 de octubre de 2026, 14:00.

## Datos de demostración

| Dato | Valor |
| --- | --- |
| Usuario | `EMP-001` |
| Clave | `epmaps2026` |
| Técnico | Andrea Salazar · Ruta Norte |
| Medidor normal | `MED-100001` |
| Medidor con consumo anómalo | `MED-100003` (promedio 8 m³; superar 74 m³ dispara la alerta) |
| Medidor dañado | `MED-100004` (exige descripción y foto) |
| Medidor suspendido | `MED-100007` |

El sistema de la oficina está conectado a **MockAPI** (`https://6ade67884e88f1bba4a5218d.mockapi.io`), con dos recursos: `medidores` y `lecturas`. La app conserva un **mock local** como fallback si no se define `EXPO_PUBLIC_MOCKAPI_URL` (ADR-007 y ADR-008). La caché de consultas y el outbox permiten seguir trabajando sin señal.

## Backend MockAPI

| Recurso | Endpoint | Uso |
| --- | --- | --- |
| Medidores | `GET /medidores` y `GET /medidores?codigo=MED-100001` | Ruta del día y detalle de R3 |
| Lecturas | `GET/POST /lecturas` | Historial confirmado y envío desde el outbox |

La URL se configura en `.env`:

```bash
EXPO_PUBLIC_MOCKAPI_URL=https://6ade67884e88f1bba4a5218d.mockapi.io
```

Para cargar o actualizar los ocho medidores de demostración:

```bash
node scripts/seed-mockapi.mjs
```

Para borrar las lecturas de prueba y dejar el historial limpio antes de una demo:

```bash
node scripts/seed-mockapi.mjs --reset-lecturas
```

La app usa MockAPI cuando la variable existe. Si la comentas o la eliminas, cambia automáticamente al mock local, que funciona sin internet. El login sigue siendo local para no exponer credenciales en el mock remoto.

## Ejecutar

```bash
npm install
npx expo start          # desarrollo
npx tsc --noEmit        # verificación de tipos
```

Para el APK de la defensa:

```bash
npx eas-cli login
npx eas-cli build:configure   # solo la primera vez, vincula el proyecto
npx eas-cli build --platform android --profile preview
```

El perfil `preview` de `eas.json` genera un APK instalable (`buildType: "apk"`), no un AAB.

El proyecto usa Expo SDK 57, React Native 0.86, React 19.2, TanStack Query 5, AsyncStorage, NetInfo, expo-camera, expo-file-system y expo-symbols.

## Estructura

```
src/
  app/                      rutas de Expo Router
    index.tsx               login (R1)
    (tabs)/rutas.tsx        ruta del día, búsqueda y progreso (R2, R3)
    (tabs)/historial.tsx    pendientes y enviadas (R9, R10)
    (tabs)/ajustes.tsx      sesión, sincronización y datos demo
    medidor/[codigo].tsx    detalle de los 7 campos (R3)
    lectura/[codigo].tsx    formulario de lectura (R5, R6, R7, R8)
  components/               UI reutilizable y banner global (R9)
  constants/                paleta, iconos y tema
  features/
    auth/                   sesión persistida (R1)
    medidores/              hooks de consulta y tarjetas
    lecturas/               borrador, fotos, outbox, sync y formulario
  services/                 queryClient, fachada mockApi, adaptador remoto y mock local
  types/                    modelos TypeScript
  utils/                    formato y validadores puros
docs/adr/                   decisiones de arquitectura (8 ADR)
```

## Cómo se resuelve cada requisito

| Req. | Implementación | Dónde |
| --- | --- | --- |
| R1 | Login con código y clave, sesión persistida sin guardar la clave, logout que limpia la caché | `features/auth`, `app/index.tsx` |
| R2 | Regex `^MED-\d{6}$`; la consulta no se ejecuta con códigos incompletos | `utils/validators.ts`, `features/medidores/hooks.ts` |
| R3 | TanStack Query con `staleTime` de 12 h y persistencia en AsyncStorage de 7 días; siete datos en el detalle | `services/queryClient.ts`, `app/medidor/[codigo].tsx` |
| R4 | La lectura se guarda primero en el outbox local y queda pendiente de envío/verificación | `features/lecturas/outbox.ts`, `guardar-lectura.ts` |
| R5 | Normal exige lectura; inaccesible exige motivo y no calcula consumo; dañado exige descripción y admite lectura | `utils/validators.ts`, `estado-picker.tsx` |
| R6 | Consumo = actual − anterior; alerta si supera 3× el promedio y exige confirmación | `consumo-resumen.tsx`, `validators.ts` |
| R7 | Foto obligatoria en anómalos/dañados y opcional en el resto; copia a documentos; permiso explicado | `photo-picker.tsx`, `camera-modal.tsx`, `foto.ts` |
| R8 | Borrador automático con debounce y `AppState`; aviso continuar/descartar | `use-lectura-form.ts`, `draft-gate.tsx` |
| R9 | Envío secuencial con idempotencia, reintento al reconectar y banner global con conexión y pendientes | `sync.ts`, `outbox-provider.tsx`, `status-banner.tsx` |
| R10 | Pendientes editables, enviadas de solo lectura, duplicado medidor+mes rechazado en app y MockAPI | `historial.tsx`, `guardar-lectura.ts`, `mockApiRemote.ts` |

## Recorrido de defensa (8 minutos)

Guion detallado con preguntas probables: [`docs/guion-defensa.md`](docs/guion-defensa.md).

1. **Login (R1):** entrar con `EMP-001 / epmaps2026`; cerrar la app y abrirla para mostrar que la sesión sigue.
2. **Ruta y caché (R2, R3):** buscar `MED-123` (no consulta), luego `MED-100001`; abrir el detalle, activar modo avión y volver a entrar: los siete datos siguen visibles.
3. **Formulario normal (R5):** registrar una lectura, mostrar consumo y guardar. La tarjeta queda “Por enviar”.
4. **Anomalía (R6):** en `MED-100003` ingresar 100 m³; aparece la alerta del triple del promedio y no deja guardar sin confirmar.
5. **Dañado y foto (R7):** en `MED-100004` elegir Dañado; intentar guardar sin foto y mostrar el error; tomar la foto y explicar la copia a documentos.
6. **Borrador (R8):** empezar otra lectura, cerrar la app desde recientes y abrirla: aparece el aviso para continuar o descartar.
7. **Sincronización (R9):** con varias pendientes, desactivar modo avión; el banner envía solo y el contador baja. Mostrar en MockAPI el recurso `lecturas` con la lectura recibida.
8. **Historial (R10):** corregir una pendiente, mostrar que una enviada no tiene botones de edición e intentar registrar dos veces el mismo medidor y mes.

## Decisiones de arquitectura

| ADR | Decisión | Requisitos |
| --- | --- | --- |
| 001 | TanStack Query + persistencia en AsyncStorage para consultas | R3, R4 |
| 002 | Outbox local con idempotencia y envío secuencial | R4, R9, R10 |
| 003 | Borrador de lectura en AsyncStorage con recuperación | R8 |
| 004 | Fotos en el directorio de documentos con expo-file-system | R7 |
| 005 | Validación con estado local y funciones puras | R2, R5, R6 |
| 006 | Sesión persistida sin guardar la clave | R1 |
| 007 | MockAPI local persistente con latencia artificial (fallback sin internet) | R1, R2, R3, R4, R9, R10 |
| 008 | Conexión a MockAPI remoto con fallback local y variables de entorno | R1–R4, R9, R10 |

Cada ADR incluye alternativas, desventajas, verificación y uso de IA.

## Pruebas manuales rápidas

- **Sin señal:** modo avión → registrar lectura → aparece en Historial como pendiente.
- **Reconexión:** quitar modo avión → el banner envía sola → la lectura pasa a “Enviada”.
- **Sin duplicados:** repetir el mismo medidor en el mes → se rechaza con mensaje.
- **Reinicio:** matar la app con una lectura pendiente y un borrador → ambos siguen allí.
- **Permiso de cámara:** negar el permiso → se explica y, si la foto es opcional, se puede continuar.
- **Código inválido:** `MED-12` no dispara consulta; se muestra el formato esperado.

## Limitaciones conocidas

- La primera carga de la ruta necesita internet para llegar a MockAPI; después la caché permite consultar sin señal.
- El login se valida localmente. MockAPI solo expone `medidores` y `lecturas`; no se guardan credenciales en la nube.
- MockAPI no impone unicidad: la app consulta antes de insertar para rechazar un duplicado medidor+mes. Dos dispositivos enviando a la vez podrían duplicar; en la prueba hay un solo técnico.
- Las fotos se guardan en el teléfono; MockAPI recibe la referencia local, no el archivo. Si se reinstala la app, las fotos antiguas del historial remoto dejan de estar disponibles.
- La sincronización se detiene si la app se cierra; no se usa `expo-background-task`.
- La cola no es transaccional (AsyncStorage); se mitiga con idempotencia.
- La sesión, el borrador y las fotos no están cifrados. En producción se usaría SecureStore y cifrado de archivos.
- Solo se admite un borrador global a la vez.
- No se configuró ESLint; la verificación automática es `npx tsc --noEmit` y `npx expo-doctor`.
