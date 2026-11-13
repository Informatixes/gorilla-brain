---
name: agent-designer
description: Analiza un segundo cerebro para detectar trabajo repetible y propone, crea o revisa especialistas, skills, automatizaciones o complementos adaptados a casos de uso demostrables.
---

# Diseño de especialistas y oportunidades

No crees agentes porque suenen útiles. Créelos cuando exista un trabajo repetible, entradas reconocibles, un resultado verificable y límites claros.

## Descubrir oportunidades en todo el cerebro

Úsalo al cerrar la primera implantación, cuando el usuario lo pida o cuando el repositorio haya cambiado de forma material.

1. Lee `PROJECT.md`, `STATE.md`, `knowledge/SOURCES.md`, `knowledge/MAINTENANCE.md` y `agents/AGENTS.md`.
2. Levanta un inventario completo de archivos dentro de la raíz autorizada. Excluye salidas generadas, binarios, secretos, `.git`, `node_modules` y ámbitos expresamente separados. No sigas enlaces fuera de la raíz.
3. Recorre todas las notas legibles por lotes. Registra archivos revisados, excluidos y fallidos; «todo el repositorio» significa todo el alcance autorizado, no cuentas externas ni fuentes sin permiso.
4. Extrae señales del trabajo cotidiano con sus rutas de evidencia:
   - tareas o consultas repetidas;
   - decisiones recurrentes;
   - traspasos entre personas o herramientas;
   - revisiones, informes y capturas periódicas;
   - fuentes que cambian con frecuencia;
   - bloqueos, duplicidades, errores y pendientes;
   - acciones externas que exigen aprobación.
5. Agrupa señales por resultado práctico, no por herramienta ni por carpeta.
6. Para cada grupo decide la solución mínima suficiente:
   - instrucción o plantilla;
   - skill invocable;
   - agente especializado;
   - automatización programada;
   - complemento solo cuando requiera una integración o interfaz reutilizable.
7. Descarta oportunidades sin evidencia, frecuencia, entrada reconocible o resultado comprobable.
8. Guarda el análisis en `agents/OPPORTUNITIES.md` usando `../../templates/AGENT_OPPORTUNITIES.md`.

## Propuesta priorizada

Cada candidato debe incluir:

- problema y evidencia concreta;
- frecuencia observada o `PENDIENTE DE VALIDAR`;
- usuarios y ámbito;
- tipo de solución recomendado y por qué;
- frase de invocación;
- entradas, fuentes y permisos mínimos;
- procedimiento y salida esperada;
- acciones permitidas y aprobaciones;
- valor, esfuerzo, riesgo y prioridad;
- pruebas de aceptación;
- solapamientos y alternativa más simple;
- estado `Propuesto`, `Aprobado`, `Diseñado`, `Probado` u `Operativo`.

Presenta primero entre tres y cinco oportunidades de mayor valor. No conviertas automáticamente propuestas en agentes activos. Solicita aprobación conjunta de los candidatos que el usuario quiera implementar.

## Implementar candidatos aprobados

1. Agrupa casos de uso por responsabilidad.
2. Evita solapamientos. Un especialista debe tener propósito, activadores, entradas, fuentes, procedimiento, salida, límites, aprobaciones y pruebas.
3. Usa `../../templates/AGENT.md` y actualiza `agents/AGENTS.md`.
4. Usa una skill cuando la tarea necesite instrucciones invocables pero no identidad o coordinación propias.
5. Propón un complemento solo si existe una capacidad técnica reutilizable que una skill no pueda aportar.
6. Crea un coordinador únicamente cuando existan al menos dos especialistas con rutas distintas o dependencias reales.
7. Cuando el caso de uso sea consultar el repositorio, deriva a `librarian-agent-factory`; no diseñes otro Bibliotecario.

## Coordinación

El coordinador conoce el catálogo, selecciona el especialista adecuado, transmite el contexto mínimo y consolida resultados. No debe duplicar el trabajo de todos ni conceder permisos adicionales.

## Validación

Prueba cada especialista con un caso normal, información incompleta, una contradicción, una petición fuera de alcance y una acción que requiera aprobación. Registra resultados y correcciones antes de marcarlo operativo.

Repite el descubrimiento cuando cambien de forma material los casos de uso o las fuentes, no en cada ejecución diaria sin novedades.
