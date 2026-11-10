---
name: brain-auditor
description: Usa este flujo para comprobar calidad, cobertura, contradicciones, fuentes, privacidad, vigencia o mantenimiento de un segundo cerebro Gorilla Brain.
---

# Auditoría del segundo cerebro

## Revisar

1. Estructura requerida y enlaces rotos.
2. Estado real frente al declarado en `STATE.md`.
3. Afirmaciones sin fuente o con fuente débil.
4. Contradicciones y decisiones sustituidas.
5. Datos temporales sin fecha de revisión.
6. Información sensible situada fuera de su ámbito.
7. Agentes sin límites, pruebas o aprobación humana.
8. Pendientes antiguos que bloquean casos de uso.

## Clasificación

- **Crítico:** exposición, pérdida, permiso indebido o fuente de verdad inconsistente.
- **Alto:** decisión operativa basada en información dudosa.
- **Medio:** cobertura o mantenimiento insuficiente.
- **Bajo:** mejora editorial o de navegación.

No corrijas automáticamente una contradicción material. Expón evidencia, impacto y recomendación. Las correcciones mecánicas y reversibles pueden aplicarse si la petición autoriza editar.

## Salida

Entrega hallazgos priorizados, archivos afectados, evidencia y acción recomendada. Actualiza `STATE.md` solo cuando la revisión se haya guardado realmente.

