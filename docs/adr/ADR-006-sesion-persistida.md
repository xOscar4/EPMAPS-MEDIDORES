# ADR-006: Persistir la sesión del técnico en AsyncStorage sin guardar la clave

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R1.

## Contexto

R1 exige iniciar sesión con código de empleado y clave, mantener la sesión al cerrar la app y permitir cerrar sesión. El técnico trabaja todo el día en campo y no puede volver a escribir la clave cada vez que el sistema operativo cierra la app.

En este prototipo no hay servidor de autenticación real ni tokens: el login lo responde el mock local. No se necesita refresco de token ni permisos por rol.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Mantener la sesión solo en memoria | Cero persistencia; muy simple. | Al cerrar la app se pierde la sesión; no cumple R1. |
| `expo-secure-store` | Cifra el dato en Keychain/Keystore; ideal para credenciales. | No está instalado; para el demo solo se guarda el nombre y el código. |
| AsyncStorage con el perfil del técnico | Ya instalado; suficiente para un objeto público pequeño; persistente. | No está cifrado; cualquiera con acceso al sandbox podría leerlo. |
| Token JWT | Separación entre credenciales y perfil; expiración. | El mock no emite tokens; agregar JWT sería teatro sin backend real. |

## Decisión

Se guarda en `EPMAPS_SESION` únicamente el objeto `Tecnico` (código, nombre y zona). **La clave nunca se persiste.**

- `AuthProvider` lee la sesión al arrancar y muestra la app sin pedir login si existe.
- `iniciarSesion` llama al mock, guarda el perfil y actualiza el contexto.
- `cerrarSesion` borra la sesión, limpia la caché de TanStack Query con `queryClient.clear()` y elimina la caché persistida con `persister.removeClient()`.
- Las lecturas pendientes y el borrador **no** se borran al cerrar sesión, para no perder trabajo de campo.

En producción, este mismo contrato se reemplazaría por `expo-secure-store` y un token con expiración; la UI no cambiaría.

## Consecuencias

- La app se abre directamente en la ruta mientras la sesión exista.
- Cerrar sesión no deja datos de consultas del técnico en la caché persistida.
- **Desventaja:** el perfil no está cifrado y no hay expiración de sesión.
- **Riesgo:** en un teléfono compartido, el siguiente usuario vería el nombre del técnico anterior hasta cerrar sesión. En la prueba se usa un solo técnico.
- **Riesgo:** si se borran los datos de la app, se pierde la sesión y también el trabajo pendiente.
- **Obligación:** nunca guardar la clave ni un token en AsyncStorage.

## Verificación

- Se inicia sesión, se cierra la app desde recientes y al abrir se entra directo a Mi ruta.
- Se cierra sesión y la app vuelve al login.
- Después de cerrar sesión, una consulta anterior no aparece desde la caché.
- En `EPMAPS_SESION` no existe el campo de la clave (revisar el código de `session.ts`).

## Uso de IA

La IA propuso usar `expo-secure-store` para todo. Se descartó porque no está instalado y porque el requisito no pide cifrado; se dejó anotado como mejora de producción.

También propuso borrar la cola de salida al cerrar sesión. Se rechazó: R8 y R9 priorizan no perder lecturas de campo. Se documentó como decisión consciente.
