# ADR-006: Persistir la sesión del técnico en AsyncStorage sin guardar la clave

## Estado

Aceptado.

## Fecha

2026-10-26.

## Requisitos relacionados

R1.

## Contexto

R1 exige iniciar sesión con código de empleado y clave, mantener la sesión al cerrar la app y permitir cerrar sesión. El técnico trabaja todo el día en campo y no puede volver a escribir la clave cada vez que el sistema operativo cierra la app.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Mantener la sesión solo en memoria | Cero persistencia; muy simple. | Al cerrar la app se pierde la sesión; no cumple R1. |
| `expo-secure-store` | Cifra el dato en Keychain/Keystore; ideal para credenciales. | No está instalado; para el demo solo se guarda el nombre y el código. |

## Decisión

Se guarda en `EPMAPS_SESION` únicamente el objeto `Tecnico` (código, nombre y zona). **La clave nunca se persiste.** El login no pasa por MockAPI: `src/services/auth.ts` compara las credenciales fijas y devuelve el perfil.

- `AuthProvider` lee la sesión al arrancar y muestra la app sin pedir login si existe.
- `iniciarSesion` llama a `login` de `src/services/auth.ts`, guarda el perfil y actualiza el contexto.

## Consecuencias

- La app se abre directamente en la ruta mientras la sesión exista.
- Cerrar sesión no deja datos de consultas del técnico en la caché persistida.
- **Desventaja:** el perfil no está cifrado y no hay expiración de sesión.

## Verificación

- Se inicia sesión, se cierra la app desde recientes y al abrir se entra directo a Mi ruta.
- Se cierra sesión y la app vuelve al login.
- Después de cerrar sesión, una consulta anterior no aparece desde la caché.

## Uso de IA

La IA propuso usar `expo-secure-store` para todo. Se descartó porque no está instalado y porque el requisito no pide cifrado; se dejó anotado como mejora de producción.
