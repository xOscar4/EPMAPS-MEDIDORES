# Registro de decisiones de arquitectura

Los ADR de este directorio siguen la plantilla de la prueba técnica: cada documento registra una decisión, requisitos relacionados, contexto, alternativas con ventajas y desventajas aplicadas al proyecto, decisión, consecuencias, verificación y uso de IA.

## Índice

| ADR | Decisión | Estado |
| --- | --- | --- |
| [ADR-001](ADR-001-capa-datos-offline-tanstack-query.md) | Caché de consultas con TanStack Query y persistencia local | Aceptado |
| [ADR-002](ADR-002-cola-salida-idempotente.md) | Cola local de lecturas e idempotencia | Aceptado |
| [ADR-003](ADR-003-borrador-lectura.md) | Persistencia del borrador de lectura | Aceptado |
| [ADR-004](ADR-004-fotos-almacenamiento-permanente.md) | Conservación local de fotos | Aceptado |
| [ADR-005](ADR-005-validacion-formulario.md) | Validación del formulario con funciones puras | Aceptado |
| [ADR-006](ADR-006-sesion-persistida.md) | Persistencia de la sesión sin guardar la clave | Aceptado |
| [ADR-007](ADR-007-mockapi-local.md) | Mock local del sistema de oficina | Reemplazado por ADR-008 |
| [ADR-008](ADR-008-mockapi-remoto.md) | MockAPI remoto como sistema de oficina | Aceptado; reemplaza ADR-007 |
| [ADR-009](ADR-009-estado-compartido-react-context.md) | Estado compartido con React Context | Aceptado |

## Criterios de mantenimiento

- No se cambia silenciosamente una decisión aceptada. Si cambia la arquitectura, se crea un ADR nuevo y se marca el anterior como reemplazado.
- Las alternativas deben ser opciones reales y explicar sus ventajas y costos para esta aplicación, no solo describir características generales.
- Las consecuencias deben reconocer al menos una desventaja o riesgo.
- Las fechas y el orden de implementación deben contrastarse con el historial de Git. Un documento agregado después del código no demuestra que la decisión se tomó antes.
