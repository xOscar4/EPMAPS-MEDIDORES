# ADR-009: Compartir la sesión y la cola de lecturas mediante React Context

## Estado

Aceptado.

## Fecha

2026-10-28.

## Requisitos relacionados

R1, R4, R9 y R10.

## Contexto

La sesión del técnico se necesita en distintas pantallas para identificar quién registra una lectura y para decidir si se muestra el inicio de sesión o el área de trabajo. La cola de lecturas pendientes también debe ser visible desde el historial y desde el flujo de registro; además, el contador de pendientes debe actualizarse cuando una lectura se agrega, se corrige, se descarta o se sincroniza.

La aplicación es pequeña y tiene un único flujo de trabajo local. No necesita compartir todo el estado de la interfaz globalmente: los campos que se escriben mientras se completa una lectura pertenecen al formulario y se guardan como borrador por separado (ADR-003). Los datos descargados del sistema de oficina pertenecen a TanStack Query (ADR-001 y ADR-008).

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| Pasar datos y funciones por props | Dependencias explícitas y fácil seguimiento en componentes pequeños. | La sesión y la cola atraviesan varias pantallas y componentes; habría que pasar props por niveles que no las usan. |
| React Context con providers específicos | Ya viene con React; permite que las pantallas consumidoras accedan a la sesión y a la cola sin una dependencia adicional. | Los cambios en el valor de un contexto pueden volver a renderizar a sus consumidores; conviene separar responsabilidades y memorizar el valor. |
| Zustand | Selectores compactos y suscripciones por parte del estado; útil para estado cliente compartido. | No está declarado como dependencia directa; habría que añadirlo y justificarlo para dos conjuntos acotados de datos que ya tienen límites claros. |
| Redux Toolkit | Flujo de acciones y herramientas de depuración consistentes en aplicaciones grandes. | Agrega configuración y conceptos que no aportan suficiente valor para el tamaño de esta aplicación. |

## Decisión

Se usa React Context con providers separados por responsabilidad:

- `AuthProvider` expone el técnico, el estado de carga y las acciones de inicio y cierre de sesión. El perfil se restaura desde `EPMAPS_SESION`; la clave no se guarda.
- `OutboxProvider` expone las lecturas locales pendientes y las operaciones para guardar, actualizar y descartar lecturas. Las pantallas que necesitan el contador o la cola consumen `useOutbox`.
- El formulario se mantiene en el estado local de `useLecturaForm`; el borrador persistente se maneja por separado en `draft.ts`.
- La caché de las respuestas de oficina sigue siendo responsabilidad de TanStack Query, no de los contextos.

Esta separación evita que Context se convierta en un almacén genérico para todos los datos de la aplicación.

## Consecuencias

- Las pantallas acceden a la sesión y a la cola sin encadenar props por componentes intermedios.
- No se agrega una dependencia de estado global.
- El estado de la sesión, el estado de la cola y el estado del servidor tienen responsabilidades distintas y más fáciles de explicar.
- **Desventaja:** Context no ofrece selectores de estado integrados; una actualización puede provocar renderizados adicionales en consumidores del provider.
- **Riesgo:** si una pantalla se monta fuera del provider correspondiente, los hooks fallan. Los providers deben permanecer en el layout raíz.
- **Obligación:** no mover el formulario completo ni la caché de TanStack Query a Context sin una decisión nueva que justifique ese cambio.

## Verificación

- `src/features/auth/auth-provider.tsx` contiene `AuthProvider`, `AuthContext` y `useAuth`.
- `src/features/lecturas/outbox-provider.tsx` contiene el provider y el hook de acceso a la cola.
- El layout raíz monta los providers antes de las pantallas que los consumen.
- Al iniciar sesión, navegar al historial y volver al registro, el perfil permanece disponible.
- Al guardar o sincronizar una lectura, el historial y el contador reflejan el cambio sin reiniciar la aplicación.
- Los campos del formulario se restauran desde `EPMAPS_BORRADOR_LECTURA`, no desde un store global.

## Uso de IA

Se compararon props, React Context, Zustand y Redux Toolkit para compartir estado entre pantallas. La decisión favorece Context porque React ya está en el proyecto y las necesidades compartidas se limitan a sesión y cola. Zustand y Redux serían opciones razonables si el estado cliente creciera, pero agregar esas dependencias ahora aumentaría el costo de mantenimiento sin resolver un problema que Context no pueda cubrir.

## Nota sobre el historial

Este ADR documenta la implementación existente al 2026-10-28. La fecha de este archivo no demuestra que la decisión se registrara antes de implementar el código; esa secuencia solo puede acreditarse mediante el historial real de commits del repositorio.
