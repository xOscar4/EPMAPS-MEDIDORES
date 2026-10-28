# ADR-007: Simular el sistema de la oficina con un MockAPI local persistente

## Estado

Reemplazado por ADR-008 el 2026-10-26. No vigente.

## Fecha

2026-10-26.

## Requisitos relacionados

R1, R2, R3, R4, R9 y R10.

## Contexto

La prueba se defiende con un APK en un teléfono Android, posiblemente sin internet confiable. El enunciado pide conectarse a un sistema de la oficina, pero no entrega un backend real ni credenciales de un servicio externo. La app necesita latencia, errores de credenciales, medidores inexistentes y rechazo de duplicados para demostrar los flujos.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
| --- | --- | --- |
| MockAPI / servicio REST en la nube | Parece un backend real; URLs y códigos HTTP visibles. | Depende de internet y de una cuenta; puede fallar el día de la defensa. |
| `json-server` en una laptop | HTTP real en la red local. | Hay que levantar otro proceso y compartir red; el APK no funcionaría solo. |

## Decisión

Se implementa `src/services/mockApi.ts` como sistema de la oficina simulado:

- `login` espera 600 ms y valida `EMP-001 / epmaps2026`.
- `getRuta` espera 700 ms y devuelve 8 medidores de `seed.ts`.
