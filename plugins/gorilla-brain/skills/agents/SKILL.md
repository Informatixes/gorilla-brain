---
name: agent-designer
description: Usa este flujo cuando haya que crear, revisar o coordinar especialistas adaptados al segundo cerebro y a casos de uso ya definidos.
---

# Diseño de especialistas

No crees agentes porque suenen útiles. Créelos cuando exista un trabajo repetible, entradas reconocibles, un resultado verificable y límites claros.

## Proceso

1. Lee `PROJECT.md`, `STATE.md`, `knowledge/CONTEXT.md` y `agents/AGENTS.md`.
2. Agrupa casos de uso por responsabilidad, no por herramienta.
3. Decide si basta con una instrucción, una plantilla, una skill o un agente especializado.
4. Evita solapamientos. Un especialista debe tener:
   - propósito;
   - activadores;
   - entradas;
   - fuentes autorizadas;
   - procedimiento;
   - salida esperada;
   - límites y aprobaciones;
   - pruebas de aceptación.
5. Crea un coordinador solo cuando existan al menos dos especialistas con rutas distintas o dependencias reales.
6. Usa `../../templates/AGENT.md` y actualiza `agents/AGENTS.md`.

Cuando el caso de uso sea consultar el repositorio, no diseñes otro agente desde cero: deriva a `librarian-agent-factory`, que instancia el Bibliotecario y valida sus límites de solo lectura.

## Coordinación

El coordinador conoce el catálogo, selecciona el especialista adecuado, transmite el contexto mínimo y consolida resultados. No debe duplicar el trabajo de todos ni conceder permisos adicionales.

## Validación

Prueba cada especialista con:

- un caso normal;
- información incompleta;
- una contradicción;
- una petición fuera de alcance;
- una acción que requiera aprobación.

Registra resultados y correcciones antes de marcarlo operativo.

