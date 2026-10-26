# Cómo probar toda la app

Hay dos formas. La rápida sirve para probar hoy mismo; el APK es lo que se entrega y se defiende.

## Opción A — Expo Go (rápida, con la laptop encendida)

1. Instalar **Expo Go** desde Play Store en el teléfono.
2. Conectar el teléfono y la laptop a la misma red Wi-Fi.
3. En la carpeta del proyecto:

```bash
npx expo start --clear
```

4. Escanear el QR con Expo Go (Android) o con la cámara del teléfono.
5. Si la red bloquea la conexión, usar `npx expo start --tunnel`.

La app carga `EXPO_PUBLIC_MOCKAPI_URL` desde `.env`, así que en Expo Go también habla con el MockAPI real.

## Opción B — APK (la de la defensa)

1. Descargar el APK del build `preview` en <https://expo.dev/accounts/xoscar4/projects/epmaps-medidores/builds>.
2. Pasarlo al teléfono e instalarlo (permitir “instalar apps desconocidas”).
3. Abrirlo: no necesita laptop ni Expo Go.

## Antes de empezar

```bash
node scripts/seed-mockapi.mjs
```

Eso deja los 8 medidores. Para partir con el historial vacío:

```bash
node scripts/seed-mockapi.mjs --reset-lecturas
```

Abrir en el navegador de la laptop estas dos direcciones para ver la “oficina” en vivo:

- <https://6ade67884e88f1bba4a5218d.mockapi.io/medidores>
- <https://6ade67884e88f1bba4a5218d.mockapi.io/lecturas>

Credenciales: `EMP-001` / `epmaps2026`.

## Orden de pruebas (R1 a R10)

Cada prueba usa un medidor distinto para no chocar con el duplicado del mismo mes.

### 1. Sesión (R1)

1. Entrar con `EMP-001 / epmaps2026`.
2. Cerrar la app desde “Recientes” y abrirla otra vez: entra directo a Mi ruta.
3. En Ajustes, “Cerrar sesión”; volver a abrir la app: pide credenciales de nuevo.

### 2. Código (R2)

1. En “Consultar un medidor” escribir `MED-123` y pulsar Consultar.
2. Probar `MED-10000A`.
3. No debe navegar ni consultar; debe explicar el formato `MED-` + 6 dígitos.

### 3. Caché sin señal (R3)

1. Con internet, entrar a Mi ruta (se descargan los 8 medidores).
2. Abrir `MED-100001`: deben verse los 7 datos.
3. Activar **modo avión**.
4. Volver y abrir `MED-100001` otra vez, y también `MED-100002` (nunca abierto): sus datos deben salir de la copia guardada.

### 4. Lectura pendiente (R4, R9)

1. Sin salir del modo avión, en `MED-100001` registrar Normal con lectura `263`.
2. Guardar: aparece como pendiente y el banner superior dice “Sin conexión · 1 sin enviar”.
3. Ir a Historial: la tarjeta dice “Por enviar”.
4. Cerrar la app desde Recientes y abrirla: la pendiente sigue.

### 5. Estados del formulario (R5)

1. En `MED-100002`, elegir Normal y dejar la lectura vacía: error.
2. En `MED-100005`, elegir Inaccesible: exige motivo y no registra lectura.
3. En `MED-100004`, elegir Dañado: exige descripción; la lectura puede quedar vacía.

### 6. Consumo anómalo (R6)

1. En `MED-100003` (última 50, promedio 8), registrar `100`.
2. Debe mostrar consumo 50 m³ y advertir que supera el triple del promedio (24 m³).
3. Intentar guardar sin confirmar: error.
4. Confirmar “revisé el medidor”: la foto pasa a ser obligatoria.

### 7. Foto (R7)

1. En el caso anterior, tomar la foto y guardar.
2. Cerrar la app y abrirla: la miniatura sigue en Historial.
3. Probar el permiso denegado: Ajustes del teléfono → Apps → EPMAPS/Expo Go → Permisos → Cámara → Denegar.
4. En un medidor normal, la app explica el motivo y permite “Continuar sin foto”. En un caso anómalo o dañado, bloquea y ofrece abrir Ajustes.

### 8. Borrador (R8)

1. Empezar otra lectura, elegir Normal y escribir una lectura, sin guardar.
2. Mandar la app al fondo y quitarla de Recientes.
3. Abrir de nuevo: aparece “Tienes un registro sin terminar”.
4. “Continuar” conserva estado, lectura y foto. “Descartar” lo borra.

### 9. Sincronización automática (R9)

1. Tener 2 o 3 pendientes de medidores distintos.
2. Desactivar el modo avión.
3. El banner muestra “Sincronizando lecturas…”, el contador baja y las tarjetas pasan a “Enviada”.
4. Recargar `https://6ade67884e88f1bba4a5218d.mockapi.io/lecturas`: deben aparecer los registros con sus campos.
5. Repetir el envío no crea filas nuevas: la app consulta la `idempotencia` antes del `POST`.

### 10. Historial (R10)

1. Una pendiente tiene botón “Corregir”; una enviada no y dice “solo lectura”.
2. Corregir una pendiente y guardar: se actualiza.
3. Intentar registrar otra lectura del mismo medidor en el mismo mes: se rechaza.

### 11. Alta de medidor (extra)

1. En Mi ruta, tocar **Añadir medidor**.
2. Escribir código `MED-200001`, dirección, sector, cuenta de 10 dígitos, última lectura `320` y promedio `18`.
3. Tocar **Fecha de la última lectura**: se abre el calendario nativo; elegir un día y confirmar.
4. Guardar: aparece “Medidor agregado” y se abre el detalle con la fecha elegida.
5. En `/medidores` de MockAPI debe estar el registro con `fechaUltimaLectura` en formato `YYYY-MM-DD`.
6. Repetir el alta con el mismo código: se rechaza con “Ya existe un medidor con ese código”.

> El alta necesita conexión porque escribe directo en MockAPI. El medidor queda además guardado en el teléfono para consultarlo sin señal.

### Lectura menor que la anterior

En un medidor con última lectura `75`, escribir `74`:

1. El consumo se muestra en `0 m³` y aparece la etiqueta “Lectura menor”.
2. La app avisa que solo es válido si reemplazaron el medidor.
3. Hay que marcar “Confirmo que el medidor fue reemplazado”; sin esa marca no se guarda.

El servidor recibe `confirmoAnomalia: true` y `anomalia` sigue en `false`, porque no es un consumo alto sino un cambio de medidor.

## Verificar que quedó en MockAPI

En el navegador, abrir:

```text
https://6ade67884e88f1bba4a5218d.mockapi.io/lecturas
```

Cada lectura enviada debe tener `idempotencia`, `medidorCodigo`, `periodo`, `estadoMedidor`, `lectura`, `consumo`, `promedio`, `anomalia`, `fotoUri`, `tecnicoCodigo` y `enviadoEn`.

Si se quiere comprobar una lectura concreta:

```text
https://6ade67884e88f1bba4a5218d.mockapi.io/lecturas?medidorCodigo=MED-100001
```

## Repetir las pruebas desde cero

1. `node scripts/seed-mockapi.mjs --reset-lecturas` (limpia la oficina).
2. En el teléfono: Ajustes → Apps → EPMAPS → Almacenamiento → Borrar datos (borra sesión, outbox y borradores).
3. Volver a entrar con `EMP-001 / epmaps2026`.

## Errores comunes

- **“No se pudo consultar”**: revisar internet y que la URL de MockAPI responda en el navegador.
- **El contador no baja**: confirmar que el modo avión está desactivado y tocar el banner para reintentar.
- **“Ya existe una lectura de este medidor en el mes”**: es correcto; usar otro medidor o limpiar `/lecturas`.
- **La foto no aparece**: si se borraron los datos de la app, los archivos de fotos también se eliminan.
